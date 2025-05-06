import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { theme } from '../theme';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signOut, deleteUser } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Settings = ({ navigation }: { navigation: any }) => {
  const [dataCollection, setDataCollection] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted from our servers. If you want to keep your data for training purposes but want to stop using the app, you can simply uninstall it. If you want your data completely removed, please contact us at maha.kanakala@gmail.com',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = FIREBASE_AUTH.currentUser;
              if (user) {
                await deleteUser(user);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again later.');
            }
          },
        },
      ]
    );
  };

  const handleDataCollectionToggle = (value: boolean) => {
    if (!value) {
      Alert.alert(
        'Data Collection',
        'Collecting data helps tailor future sessions and improve your personal model. Are you sure you want to disable data collection?',
        [
          { text: 'Cancel', onPress: () => setDataCollection(true), style: 'cancel' },
          { text: 'Disable', onPress: () => setDataCollection(false) },
        ]
      );
    } else {
      setDataCollection(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingText}>Data Collection</Text>
            <Text style={styles.settingDescription}>
              Help improve Vela by sharing usage data
            </Text>
          </View>
          <Switch
            value={dataCollection}
            onValueChange={handleDataCollectionToggle}
            trackColor={{ false: theme.colors.inputBorder, true: theme.colors.primary }}
            thumbColor={dataCollection ? theme.colors.background : theme.colors.text}
          />
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.primary }]}
          onPress={handleDeleteAccount}
        >
          <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
            Delete Account
          </Text>
        </TouchableOpacity>
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
    marginBottom: 4,
  },
  settingDescription: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.family,
    fontSize: theme.fonts.sizes.small,
  },
  aboutItem: {
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.inputBorder,
  },
  aboutText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.family,
    fontSize: theme.fonts.sizes.body,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: 8,
    marginTop: theme.spacing.medium,
  },
  buttonText: {
    color: theme.colors.background,
    textAlign: 'center',
    fontFamily: theme.fonts.family,
    fontSize: theme.fonts.sizes.body,
    fontWeight: 'bold',
  },
});

export default Settings;
