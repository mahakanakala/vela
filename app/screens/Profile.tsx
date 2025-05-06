import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { theme } from '../theme';

const Profile = () => {
  const [avatar, setAvatar] = useState('default');
  const [voice, setVoice] = useState('default');

  const voiceOptions = [
    { id: '1', name: 'Natural', description: 'Smooth and conversational' },
    { id: '2', name: 'Warm', description: 'Friendly and supportive' },
    { id: '3', name: 'Professional', description: 'Clear and precise' },
  ];

  return (
    <View style={styles.container}>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Avatar</Text>
        <TouchableOpacity style={styles.avatarContainer}>
          <Image
            source={require('../assets/oil_spill_icon.png')}
            style={styles.avatar}
          />
          <Text style={styles.avatarText}>Change Avatar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice Settings</Text>
        {voiceOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.voiceOption,
              voice === option.id && styles.selectedVoice,
            ]}
            onPress={() => setVoice(option.id)}
          >
            <Text style={styles.voiceText}>{option.name}</Text>
            <Text style={styles.voiceDescription}>{option.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  sectionTitle: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    marginBottom: theme.spacing.medium,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {
    color: theme.colors.background,
    fontFamily: theme.fonts.family,
    marginTop: theme.spacing.small,
  },
  voiceOption: {
    padding: theme.spacing.medium,
    borderRadius: 8,
    marginBottom: theme.spacing.small,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
  },
  selectedVoice: {
    backgroundColor: theme.colors.primary,
  },
  voiceText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    fontSize: theme.fonts.sizes.body,
  },
  voiceDescription: {
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    fontSize: theme.fonts.sizes.body - 2,
    marginTop: theme.spacing.small,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.inputBorder,
  },
  settingText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.family,
    fontSize: theme.fonts.sizes.body,
  },
  settingValue: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.family,
    fontSize: theme.fonts.sizes.body,
  },
});

export default Profile;
