import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { validateEnv } from './config/env';
import ChatScreen from './screens/ChatScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

// Custom error fallback component
const ErrorFallback = () => (
  <LoadingSpinner
    fullScreen
    text="Something went wrong. Please restart the app."
    type="pulse"
  />
);

export default function App() {
  React.useEffect(() => {
    // Validate environment variables on app start
    try {
      validateEnv();
    } catch (error) {
      console.error('Environment validation failed:', error);
      // In production, you might want to show an error screen
    }
  }, []);

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Onboarding"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}