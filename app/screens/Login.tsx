import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    TouchableOpacity,
    ActivityIndicator
  } from 'react-native';
  import React, { useState } from 'react';
  import { FIREBASE_AUTH } from '../../FirebaseConfig';
  import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
  } from 'firebase/auth';
  import { theme } from '../theme';
  
  interface LoginProps {
    navigation: any;
  }

  const Login: React.FC<LoginProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
  
    const signIn = async () => {
      setLoading(true);
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        console.log(response);
        navigation.navigate('Home');
      } catch (error: any) {
        console.log(error);
        alert("sign in failed " + error.message);
      } finally {
        setLoading(false);
      }
    };
  
    const signUp = async () => {
      setLoading(true);
      try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log(response);
        alert('Check your email!');
      } catch (error: any) {
        console.log(error.message);
        alert('sign up failed ' + error.message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          autoCapitalize="none"
          style={styles.input}
        />
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={signIn}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={signUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.medium,
      justifyContent: 'center',
    },
    title: {
      fontSize: theme.fonts.sizes.title,
      color: theme.colors.text,
      fontFamily: theme.fonts.family,
      marginBottom: theme.spacing.large,
      textAlign: 'center',
    },
    input: {
      height: 50,
      borderColor: theme.colors.inputBorder,
      borderWidth: 1,
      marginBottom: theme.spacing.medium,
      paddingHorizontal: theme.spacing.medium,
      borderRadius: 8,
      color: theme.colors.text,
      fontFamily: theme.fonts.family,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.medium,
      borderRadius: 8,
      marginBottom: theme.spacing.small,
    },
    buttonText: {
      color: theme.colors.background,
      textAlign: 'center',
      fontSize: theme.fonts.sizes.body,
      fontFamily: theme.fonts.family,
      fontWeight: 'bold',
    },
    buttonContainer: {
      marginTop: theme.spacing.medium,
    },
  });
  
  export default Login;  