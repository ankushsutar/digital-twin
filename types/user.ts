// User profile types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    chat: boolean;
    reminders: boolean;
    updates: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
  };
  digitalTwin: {
    personality: string;
    interests: string[];
    communicationStyle: 'casual' | 'formal' | 'friendly';
  };
}

// Authentication types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
  createdAt: Date;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// Digital Twin types
export interface DigitalTwinProfile {
  id: string;
  userId: string;
  personality: {
    traits: string[];
    communicationStyle: string;
    interests: string[];
    goals: string[];
  };
  memory: {
    conversations: string[];
    preferences: Record<string, any>;
    moodHistory: MoodEntry[];
  };
  settings: {
    responseLength: 'short' | 'medium' | 'long';
    formality: 'casual' | 'formal';
    topics: string[];
  };
}

export interface MoodEntry {
  timestamp: Date;
  mood: string;
  intensity: number; // 1-10
  context?: string;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface ProfileUpdateForm {
  name?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
} 