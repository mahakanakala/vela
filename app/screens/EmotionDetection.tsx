import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { CameraMode, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { theme } from '../theme';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useRef, useEffect, useState, useCallback } from 'react';
import Config from 'react-native-config';

interface EmotionDetectionProps {
  navigation: any;
}

const BACKEND_WS_URL = Config.EMOTION_WS_URL;

const EmotionDetection = ({ navigation }: EmotionDetectionProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [error, setError] = useState<string | null>(null);
  const [emotions, setEmotions] = useState<(string | { index: number, name: string })[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const type = 'front';

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current || !ws || ws.readyState !== WebSocket.OPEN) return;
    try {
      const frame = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
        skipProcessing: true
      });
      if (frame?.base64) {
        ws.send(JSON.stringify({
          type: 'frame',
          data: frame.base64,
          timestamp: Date.now()
        }));
      }
    } catch (err) {
      setError('Error taking picture');
      console.error(err);
    }
  }, [ws]);

  // Handle video frames for emotion detection
  useEffect(() => {
    let frameInterval: NodeJS.Timeout;
    const sendFrame = async () => {
      if (!cameraRef.current || !ws || ws.readyState !== WebSocket.OPEN) return;
      try {
        const frame = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
          skipProcessing: true
        });
        if (frame?.base64) {
          ws.send(JSON.stringify({
            type: 'frame',
            data: frame.base64,
            timestamp: Date.now()
          }));
        }
      } catch (err) {
        setError('Error capturing frame');
        console.error(err);
      }
    };
    if (ws && isRecording) {
      frameInterval = setInterval(sendFrame, 200);
    }
    return () => {
      if (frameInterval) {
        clearInterval(frameInterval);
      }
    };
  }, [ws, cameraRef, isRecording]);

  useEffect(() => {
    if (!isRecording) return;
    const wsInstance = new WebSocket(BACKEND_WS_URL);
    wsInstance.onopen = () => console.log('WebSocket connected');
    wsInstance.onmessage = (event: any) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'emotion') {
          setCurrentEmotion(data.emotion);
          setEmotions(prev => [data.emotion, ...prev].slice(0, 10));
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
    wsInstance.onclose = () => console.log('WebSocket disconnected');
    wsInstance.onerror = (error: any) => console.error('WebSocket error:', error);
    setWs(wsInstance);
    return () => wsInstance.close();
  }, [isRecording]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.resumePreview();
    }
  }, [cameraRef]);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
        </Text>
        <Pressable
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {permission?.granted ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={cameraRef}
            mode="video"
            facing='front'
            mute={true}
            responsiveOrientationWhenOrientationLocked
          />
        </View>
      ) : (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            We need your permission to use the camera
          </Text>
          <Pressable
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.controls}>
        <Pressable
          style={[styles.button, isRecording ? styles.recordingButton : styles.primaryButton]}
          onPress={() => setIsRecording(!isRecording)}
        >
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.emotionHistory}>
        <Text style={styles.historyTitle}>Emotion History:</Text>
        <ScrollView style={styles.historyList}>
          {emotions.map((emotion, index) => (
            typeof emotion === 'object' && emotion !== null && 'name' in emotion && 'index' in emotion ? (
              <Text key={index} style={styles.historyItem}>
                {emotion.name} (index: {emotion.index})
              </Text>
            ) : (
              <Text key={index} style={styles.historyItem}>{emotion}</Text>
            )
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  permissionText: {
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    marginTop: getStatusBarHeight(),
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 64,
  },
  shutterContainer: {
    position: 'absolute',
    bottom: 44,
    left: 0,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: 'transparent',
    borderWidth: 5,
    borderColor: 'white',
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.medium,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: 8,
  },
  secondaryButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    padding: theme.spacing.medium,
    borderRadius: 8,
  },
  recordingButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: theme.colors.background,
    fontFamily: theme.fonts.family,
    fontSize: theme.fonts.sizes.body,
    fontWeight: 'bold',
  },
  emotionHistory: {
    padding: theme.spacing.medium,
  },
  historyTitle: {
    fontSize: theme.fonts.sizes.title,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    fontWeight: 'bold',
    marginBottom: theme.spacing.medium,
  },
  historyList: {
    maxHeight: 200,
  },
  historyItem: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    opacity: 0.8,
    marginBottom: theme.spacing.small,
  },
});

export default EmotionDetection;