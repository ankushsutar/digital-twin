import { router } from 'expo-router';
import { useEffect } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function OnboardingRedirect() {
  useEffect(() => {
    // Redirect to the auth onboarding screen
    router.replace('/(auth)/onboarding');
  }, []);

  return <LoadingSpinner fullScreen text="Loading..." />;
} 