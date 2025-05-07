import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { theme } from '../theme';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const BACKEND_WS_URL = 'ws://192.168.1.15:8000/ws/emotion';

export default function Landing() {
  const navigation: any = useNavigation();
  const [message, setMessage] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [error, setError] = useState<string | null>(null);
  const [emotions, setEmotions] = useState<(string | { index: number, name: string })[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // Greeting logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return 'late night';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

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
        // No visual feedback or overlay for frame capture (no shutter/flash)
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
    if (ws && isRecording && showCamera) {
      frameInterval = setInterval(sendFrame, 200);
    }
    return () => {
      if (frameInterval) {
        clearInterval(frameInterval);
      }
    };
  }, [ws, cameraRef, isRecording, showCamera]);

  useEffect(() => {
    if (!isRecording) return;
    const wsInstance = new WebSocket(BACKEND_WS_URL);
    wsInstance.onopen = () => console.log('WebSocket connected');
    wsInstance.onmessage = (event: any) => {
      try {
        const data = JSON.parse(event.data);
        if (data.most_common) {
          setCurrentEmotion(`${data.most_common.name} (index: ${data.most_common.index})`);
          setEmotions(prev => [data.most_common, ...prev].slice(0, 10));
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

  if (!showCamera) {
    return (
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        {/* Main content */}
        <View style={styles.content}>
          <Text style={styles.greeting}>
            What do we want to talk about this {getGreeting()}?
          </Text>
          {/* Message input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message here..."
              placeholderTextColor={theme.colors.muted}
              value={message}
              onChangeText={setMessage}
              multiline
            />
          </View>
          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="add-circle" size={32} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AIModelSelection')}>
              <Ionicons name="settings" size={32} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.startButton]} onPress={() => setShowCamera(true)}>
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-forward" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Camera and emotion detection UI
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setShowCamera(false)}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.greeting}>Emotion Detection</Text>
      </View>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 32,
    fontFamily: theme.fonts.family,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    minHeight: 120,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
  },
  arrowContainer: {
    backgroundColor: theme.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    marginTop: getStatusBarHeight(),
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: theme.spacing.medium,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
});
