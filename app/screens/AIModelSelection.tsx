import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

interface AIModelSelectionProps {
  navigation: any;
}

const EMOTION_MODELS = [
  { name: 'best.pt', description: 'Default emotion detection model (YOLOv8)' },
  { name: 'emotion_v2.pt', description: 'Experimental model with improved accuracy' },
];
const NLP_MODELS = [
  { name: 'gpt-3.5', description: 'OpenAI GPT-3.5 for natural language understanding' },
  { name: 'bert-base', description: 'BERT base model for sentiment analysis' },
];
const VOICE_MODELS = [
  { name: 'whisper', description: 'OpenAI Whisper for speech-to-text' },
  { name: 'deepspeech', description: 'Mozilla DeepSpeech for voice recognition' },
];

const AIModelSelection = ({ navigation }: AIModelSelectionProps) => {
  const [selectedModels, setSelectedModels] = useState({
    emotion: true, // Preselect emotion detection
    nlp: false,
    voice: false,
  });
  const [selectedEmotionModel, setSelectedEmotionModel] = useState(EMOTION_MODELS[0].name);
  const [selectedNLPModel, setSelectedNLPModel] = useState(NLP_MODELS[0].name);
  const [selectedVoiceModel, setSelectedVoiceModel] = useState(VOICE_MODELS[0].name);

  const handleModelSelect = (model: keyof typeof selectedModels) => {
    setSelectedModels(prev => ({
      ...prev,
      [model]: !prev[model],
    }));
  };

  const handleNext = () => {
    // Store the selected models in AsyncStorage or Redux
    // For now, we'll just navigate to the next screen
    navigation.navigate('Landing');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Model Selection</Text>
      <Text style={styles.subtitle}>
        Select which AI models you want to use. These models will be loaded when you start using the app.
      </Text>

      <ScrollView style={styles.modelsContainer}>
        {/* Emotion Detection */}
        <TouchableOpacity
          style={[styles.modelCard, selectedModels.emotion && styles.selected]}
          onPress={() => handleModelSelect('emotion')}
        >
          <Text style={styles.modelName}>Emotion Detection</Text>
          <Text style={styles.modelDescription}>
            Analyze facial expressions to detect emotions
          </Text>
          <Picker
            enabled={selectedModels.emotion}
            selectedValue={selectedEmotionModel}
            onValueChange={setSelectedEmotionModel}
            style={styles.picker}
          >
            {EMOTION_MODELS.map((model) => (
              <Picker.Item
                key={model.name}
                label={`${model.name} - ${model.description}`}
                value={model.name}
              />
            ))}
          </Picker>
        </TouchableOpacity>

        {/* NLP */}
        <TouchableOpacity
          style={[styles.modelCard, selectedModels.nlp && styles.selected]}
          onPress={() => handleModelSelect('nlp')}
        >
          <Text style={styles.modelName}>Natural Language Processing</Text>
          <Text style={styles.modelDescription}>
            Analyze text and speech for sentiment and context
          </Text>
          <Picker
            enabled={selectedModels.nlp}
            selectedValue={selectedNLPModel}
            onValueChange={setSelectedNLPModel}
            style={styles.picker}
          >
            {NLP_MODELS.map((model) => (
              <Picker.Item
                key={model.name}
                label={`${model.name} - ${model.description}`}
                value={model.name}
              />
            ))}
          </Picker>
        </TouchableOpacity>

        {/* Voice */}
        <TouchableOpacity
          style={[styles.modelCard, selectedModels.voice && styles.selected]}
          onPress={() => handleModelSelect('voice')}
        >
          <Text style={styles.modelName}>Voice Recognition</Text>
          <Text style={styles.modelDescription}>
            Convert speech to text and analyze voice patterns
          </Text>
          <Picker
            enabled={selectedModels.voice}
            selectedValue={selectedVoiceModel}
            onValueChange={setSelectedVoiceModel}
            style={styles.picker}
          >
            {VOICE_MODELS.map((model) => (
              <Picker.Item
                key={model.name}
                label={`${model.name} - ${model.description}`}
                value={model.name}
              />
            ))}
          </Picker>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={[styles.nextButton, !Object.values(selectedModels).some(Boolean) && styles.disabled]}
        onPress={handleNext}
        disabled={!Object.values(selectedModels).some(Boolean)}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
  },
  title: {
    fontSize: theme.fonts.sizes.title,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    marginBottom: theme.spacing.large,
    textAlign: 'center',
  },
  modelsContainer: {
    flex: 1,
    gap: theme.spacing.medium,
  },
  modelCard: {
    backgroundColor: theme.colors.background, // Fix: use background instead of card
    padding: theme.spacing.large,
    borderRadius: 8,
    elevation: 2,
  },
  selected: {
    backgroundColor: theme.colors.primary,
  },
  modelName: {
    fontSize: theme.fonts.sizes.title,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    marginBottom: theme.spacing.small,
  },
  modelDescription: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.family,
  },
  picker: {
    backgroundColor: theme.colors.background,
    marginTop: 8,
    marginBottom: 8,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: theme.spacing.medium,
  },
  disabled: {
    backgroundColor: theme.colors.background,
  },
  nextButtonText: {
    color: theme.colors.background,
    fontSize: theme.fonts.sizes.body,
    fontFamily: theme.fonts.family,
    fontWeight: 'bold',
  },
});

export default AIModelSelection;
