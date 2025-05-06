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

interface AIModelSelectionProps {
  navigation: any;
}

const AIModelSelection = ({ navigation }: AIModelSelectionProps) => {
  const [selectedModels, setSelectedModels] = useState({
    emotion: false,
    nlp: false,
    voice: false,
  });

  const handleModelSelect = (model: keyof typeof selectedModels) => {
    setSelectedModels(prev => ({
      ...prev,
      [model]: !prev[model],
    }));
  };

  const handleNext = () => {
    // Store the selected models in AsyncStorage or Redux
    // For now, we'll just navigate to the next screen
    navigation.navigate('EmotionDetection');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Model Selection</Text>
      <Text style={styles.subtitle}>
        Select which AI models you want to use. These models will be loaded when you start using the app.
      </Text>

      <ScrollView style={styles.modelsContainer}>
        <TouchableOpacity
          style={[styles.modelCard, selectedModels.emotion && styles.selected]}
          onPress={() => handleModelSelect('emotion')}
        >
          <Text style={styles.modelName}>Emotion Detection</Text>
          <Text style={styles.modelDescription}>
            Analyze facial expressions to detect emotions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modelCard, selectedModels.nlp && styles.selected]}
          onPress={() => handleModelSelect('nlp')}
        >
          <Text style={styles.modelName}>Natural Language Processing</Text>
          <Text style={styles.modelDescription}>
            Analyze text and speech for sentiment and context
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modelCard, selectedModels.voice && styles.selected]}
          onPress={() => handleModelSelect('voice')}
        >
          <Text style={styles.modelName}>Voice Recognition</Text>
          <Text style={styles.modelDescription}>
            Convert speech to text and analyze voice patterns
          </Text>
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
    backgroundColor: theme.colors.card,
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
