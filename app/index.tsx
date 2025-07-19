import { router } from 'expo-router';
import { useEffect } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function Index() {
  useEffect(() => {
    // Redirect to the onboarding screen
    router.replace('/(auth)/onboarding');
  }, []);

  return <LoadingSpinner fullScreen text="Loading..." />;
} 