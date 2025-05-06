import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import { theme } from '../theme';

const About = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Meet Vela: Your AI Companion</Text>

        <View style={styles.section}>
          <Text style={styles.subtitle}>What is Sage?</Text>
          <Text style={styles.content}>
            Vela is your thoughtful, emotionally-aware AI companion. Using advanced conversational intelligence, Vela aims to help you feel seen and supported — whether you're talking through something or just want company.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>How It Works</Text>
          <Text style={styles.content}>
            Vela combines advanced natural language understanding with emotional intelligence to provide thoughtful and supportive conversations.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Key Features</Text>
          <View style={styles.features}>
            <Text style={styles.featureItem}>• Context-aware responses</Text>
            <Text style={styles.featureItem}>• Private and secure conversations</Text>
            <Text style={styles.featureItem}>• Personalized interaction based on your preferences</Text>
            <Text style={styles.featureItem}>• Emotionally intelligent support</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Your Privacy Matters</Text>
          <Text style={styles.content}>
            Your privacy is our top priority. All conversations are processed locally on your device and are not stored on our servers unless you explicitly opt-in to share data for model improvement.
            {'\n\n'}
            We use end-to-end encryption for all data in transit. Your data is used solely to improve your experience and is never shared with third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Learning Mode (Opt-in)</Text>
          <Text style={styles.content}>
            Want to help Vela get better? You can enable Learning Mode in your Settings to share emotion snapshots with us — securely and anonymously. This helps train future models with real-world emotion patterns.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Tech Behind Vela</Text>
          <Text style={styles.content}>
            • Emotion Detection Model: YOLOv8 (Ultralytics), trained via Roboflow{'\n'}
            • Speech Recognition: Coming soon via Whisper + custom NLP layer{'\n'}
            • Real-time backend: FastAPI + Uvicorn for model serving{'\n'}
            • Frontend: React Native + Expo
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Contact & Support</Text>
          <Text style={styles.content}>
            Questions or feedback? We'd love to hear from you. Email us at maha.kanakala@gmail.com
          </Text>
        </View>

        {/* Version information will be added in a future update */}
      </ScrollView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
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
    marginBottom: theme.spacing.large,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.large,
  },
  subtitle: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    fontWeight: 'bold',
    marginBottom: theme.spacing.small,
  },
  content: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    lineHeight: 24,
  },
  features: {
    marginTop: theme.spacing.small,
  },
  featureItem: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    marginBottom: theme.spacing.small,
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: 8,
    marginTop: theme.spacing.large,
  },
  backButtonText: {
    color: theme.colors.background,
    textAlign: 'center',
    fontFamily: theme.fonts.family,
    fontSize: theme.fonts.sizes.body,
    fontWeight: 'bold',
  },
});

export default About;