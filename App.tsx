import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import { User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Home from './app/screens/Home';
import Profile from './app/screens/Profile';
import Settings from './app/screens/Settings';
import AIModelSelection from './app/screens/AIModelSelection';
import { theme } from './app/theme';
import Landing from './app/screens/Landing';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the stack navigator types
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Landing: undefined;
  Profile: undefined;
  Settings: undefined;
  AIModelSelection: undefined;
  About: undefined;
};

type InsideStackParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  AIModelSelection: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const InsideStack = createNativeStackNavigator<InsideStackParamList>();

import About from './app/screens/About';
import { SpinningSpiral } from './app/components/Loading';

function InsideLayout() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleLogout = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return (
    <InsideStack.Navigator
      id={undefined}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontFamily: theme.fonts.family,
          fontWeight: 'bold',
        },
      }}
    >
      <InsideStack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'VELA',
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ paddingRight: 10 }}
            >
              <Text style={{ color: theme.colors.primary, fontFamily: theme.fonts.family }}>Logout</Text>
            </TouchableOpacity>
          )
        }}
      />
      <InsideStack.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }) => ({
          title: 'Profile',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 10 }}
            >
              <Text style={{
                color: theme.colors.primary,
                fontFamily: theme.fonts.family,
                fontSize: 16,
                fontWeight: '500'
              }}>
                ← Back
              </Text>
            </TouchableOpacity>
          )
        })}
      />
      <InsideStack.Screen
        name="Settings"
        component={Settings}
        options={({ navigation }) => ({
          title: 'Settings',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 10 }}
            >
              <Text style={{
                color: theme.colors.primary,
                fontFamily: theme.fonts.family,
                fontSize: 16,
                fontWeight: '500'
              }}>
                ← Back
              </Text>
            </TouchableOpacity>
          )
        })}
      />
      <InsideStack.Screen
        name="AIModelSelection"
        component={AIModelSelection}
        options={({ navigation }) => ({
          title: 'AI Model',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 10 }}
            >
              <Text style={{
                color: theme.colors.primary,
                fontFamily: theme.fonts.family,
                fontSize: 16,
                fontWeight: '500'
              }}>
                ← Back
              </Text>
            </TouchableOpacity>
          )
        })}
      />
      <InsideStack.Screen
        name="About"
        component={About}
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 10 }}
            >
              <Text style={{
                color: theme.colors.primary,
                fontFamily: theme.fonts.family,
                fontSize: 16,
                fontWeight: '500'
              }}>
                ← Back
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  if (isLoading) {
    return (
      <View style={theme.loadingContainer}>
        <SpinningSpiral
          message="Loading your VELA experience..."
          spinnerColor={theme.colors.primary}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'Landing' : 'Login'}
        id={undefined}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="Landing"
          component={Landing}
        />
        <Stack.Screen
          name="Home"
          component={InsideLayout}
        />
        <Stack.Screen
          name="AIModelSelection"
          component={AIModelSelection}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
