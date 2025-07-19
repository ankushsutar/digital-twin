import Constants from 'expo-constants';

interface EnvironmentConfig {
  OPENAI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  APP_ENV: 'development' | 'staging' | 'production';
  API_BASE_URL: string;
}

// Get environment variables from Expo Constants
const getEnvVars = (): EnvironmentConfig => {
  const extra = Constants.expoConfig?.extra;
  
  return {
    OPENAI_API_KEY: extra?.OPENAI_API_KEY || process.env.OPENAI_API_KEY || '',
    SUPABASE_URL: extra?.SUPABASE_URL || process.env.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: extra?.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
    APP_ENV: (extra?.APP_ENV || process.env.APP_ENV || 'development') as EnvironmentConfig['APP_ENV'],
    API_BASE_URL: extra?.API_BASE_URL || process.env.API_BASE_URL || 'https://api.yourdomain.com',
  };
};

export const env = getEnvVars();

// Validation function to ensure all required env vars are present
export const validateEnv = (): void => {
  const requiredVars = ['OPENAI_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  
  for (const varName of requiredVars) {
    if (!env[varName as keyof EnvironmentConfig]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }
};

// Helper to check if we're in development
export const isDevelopment = (): boolean => env.APP_ENV === 'development';
export const isProduction = (): boolean => env.APP_ENV === 'production'; 