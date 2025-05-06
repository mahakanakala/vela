import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { theme } from '../theme';

const Home = ({ navigation }: { navigation: any }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
      </View>

      <View style={[styles.featuresContainer, { padding: theme.spacing.medium }]}>
        <View style={styles.featureCard}>
          <Image
            source={require('../assets/oil_spill_icon.png')}
            style={styles.featureImage}
          />
          <Text style={styles.featureTitle}>Real-time Emotion Detection</Text>
          <Text style={styles.featureDescription}>
            Analyzes facial expressions and emotions in real-time
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Image
            source={require('../assets/oil_spill_icon.png')}
            style={styles.featureImage}
          />
          <Text style={styles.featureTitle}>Natural Language Processing</Text>
          <Text style={styles.featureDescription}>
            Understands and responds to your voice naturally
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Image
            source={require('../assets/oil_spill_icon.png')}
            style={styles.featureImage}
          />
          <Text style={styles.featureTitle}>Context-Aware AI</Text>
          <Text style={styles.featureDescription}>
            Provides intelligent responses based on your emotions and context
          </Text>
        </View>
      </View>

      <View style={[styles.actionButtons, { padding: theme.spacing.medium }]}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.buttonText }>Customize AI Avatar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('EmotionDetection')}
        >
          <Text style={styles.buttonText}>Start Emotion Detection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.descriptionContainer, { padding: theme.spacing.medium }]}>
        <Text style={styles.descriptionTitle}>How It Works</Text>
        <Text style={styles.descriptionText}>
          AI Video Companion combines advanced computer vision, natural language processing, and emotional intelligence to provide a unique interactive experience. 
          The AI analyzes your facial expressions and voice in real-time to understand your emotional state and provide appropriate responses.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 0,
  },
  header: {
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.inputBorder,
  },
  title: {
    fontSize: theme.fonts.sizes.title,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  logo: {
    fontSize: theme.fonts.sizes.title,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.xlarge,
    letterSpacing: 2,
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  tagline: {
    fontSize: theme.fonts.sizes.subtitle,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    textAlign: 'center',
    lineHeight: 40,
  },
  taglineLight: {
    fontSize: theme.fonts.sizes.subtitle,
    color: theme.colors.muted,
    fontFamily: theme.fonts.family,
    textAlign: 'center',
    lineHeight: 40,
  },
  featuresContainer: {
    marginBottom: theme.spacing.large,
    paddingHorizontal: theme.spacing.medium,
  },
  featureCard: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: 12,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    elevation: 2,
    shadowColor: theme.colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: theme.spacing.small,
  },
  featureTitle: {
    fontSize: theme.fonts.sizes.body + 2,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.small,
  },
  featureDescription: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    textAlign: 'center',
    opacity: 0.8,
  },
  actionButtons: {
    marginBottom: theme.spacing.large,
  },
  button: {
    padding: theme.spacing.medium,
    borderRadius: 8,
    marginBottom: theme.spacing.medium,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
  },
  buttonText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    fontSize: theme.fonts.sizes.body,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: theme.spacing.large,
  },
  descriptionTitle: {
    fontSize: theme.fonts.sizes.title,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    fontWeight: 'bold',
    marginBottom: theme.spacing.medium,
  },
  descriptionText: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    opacity: 0.8,
    lineHeight: 24,
  },
});

export default Home;