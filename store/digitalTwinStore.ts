import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, ChatSession, LoadingState } from '../types/api';
import { DigitalTwinProfile, MoodEntry } from '../types/user';

interface DigitalTwinState {
  // State
  profile: DigitalTwinProfile | null;
  currentSession: ChatSession | null;
  chatHistory: ChatSession[];
  moodHistory: MoodEntry[];
  isLoading: boolean;
  error: string | null;
  loadingState: LoadingState;

  // Actions
  initializeProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<DigitalTwinProfile>) => Promise<void>;
  addChatMessage: (message: ChatMessage) => void;
  createNewSession: (title?: string) => void;
  updateMood: (mood: string, intensity: number, context?: string) => void;
  getMoodTrend: () => { average: number; trend: 'up' | 'down' | 'stable' };
  getPersonalityInsights: () => string[];
  clearError: () => void;
  resetProfile: () => void;
}

const defaultProfile: Omit<DigitalTwinProfile, 'id' | 'userId'> = {
  personality: {
    traits: ['curious', 'empathetic', 'analytical'],
    communicationStyle: 'friendly',
    interests: ['technology', 'personal growth', 'creativity'],
    goals: ['help users achieve their goals', 'provide meaningful insights'],
  },
  memory: {
    conversations: [],
    preferences: {},
    moodHistory: [],
  },
  settings: {
    responseLength: 'medium',
    formality: 'casual',
    topics: ['general', 'personal', 'professional'],
  },
};

export const useDigitalTwinStore = create<DigitalTwinState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      currentSession: null,
      chatHistory: [],
      moodHistory: [],
      isLoading: false,
      error: null,
      loadingState: 'idle',

      // Actions
      initializeProfile: async (userId: string) => {
        set({ loadingState: 'loading' });
        
        try {
          // Here you would fetch from your API
          // const response = await apiClient.get(`/digital-twin/${userId}`);
          
          // Mock profile for now
          const profile: DigitalTwinProfile = {
            id: '1',
            userId,
            ...defaultProfile,
          };

          set({
            profile,
            loadingState: 'success',
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to initialize profile',
            loadingState: 'error',
          });
        }
      },

      updateProfile: async (updates: Partial<DigitalTwinProfile>) => {
        const { profile } = get();
        if (!profile) return;

        set({ isLoading: true });
        
        try {
          // Here you would update via API
          // await apiClient.put(`/digital-twin/${profile.id}`, updates);
          
          const updatedProfile = { ...profile, ...updates };
          
          set({
            profile: updatedProfile,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update profile',
            isLoading: false,
          });
        }
      },

      addChatMessage: (message: ChatMessage) => {
        const { currentSession, profile } = get();
        
        if (!currentSession) {
          // Create new session if none exists
          get().createNewSession();
          return;
        }

        const updatedSession: ChatSession = {
          ...currentSession,
          messages: [...currentSession.messages, message],
          updatedAt: new Date(),
        };

        // Update memory with conversation context
        if (profile) {
          const updatedProfile = {
            ...profile,
            memory: {
              ...profile.memory,
              conversations: [
                ...profile.memory.conversations,
                `${message.role}: ${message.content}`,
              ].slice(-50), // Keep last 50 conversation snippets
            },
          };

          set({
            currentSession: updatedSession,
            profile: updatedProfile,
          });
        } else {
          set({ currentSession: updatedSession });
        }
      },

      createNewSession: (title?: string) => {
        const session: ChatSession = {
          id: Date.now().toString(),
          userId: '1', // This should come from auth store
          title: title || `Chat ${new Date().toLocaleDateString()}`,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Add previous session to history if it exists
        const { currentSession } = get();
        if (currentSession && currentSession.messages.length > 0) {
          set(state => ({
            chatHistory: [...state.chatHistory, currentSession],
            currentSession: session,
          }));
        } else {
          set({ currentSession: session });
        }
      },

      updateMood: (mood: string, intensity: number, context?: string) => {
        const moodEntry: MoodEntry = {
          timestamp: new Date(),
          mood,
          intensity,
          context,
        };

        set(state => ({
          moodHistory: [...state.moodHistory, moodEntry],
        }));

        // Update profile memory
        const { profile } = get();
        if (profile) {
          const updatedProfile = {
            ...profile,
            memory: {
              ...profile.memory,
              moodHistory: [...profile.memory.moodHistory, moodEntry],
            },
          };
          set({ profile: updatedProfile });
        }
      },

      getMoodTrend: () => {
        const { moodHistory } = get();
        if (moodHistory.length < 2) {
          return { average: 5, trend: 'stable' as const };
        }

        const recent = moodHistory.slice(-7); // Last 7 entries
        const average = recent.reduce((sum, entry) => sum + entry.intensity, 0) / recent.length;
        
        const older = moodHistory.slice(-14, -7); // Previous 7 entries
        const olderAverage = older.length > 0 
          ? older.reduce((sum, entry) => sum + entry.intensity, 0) / older.length 
          : average;

        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (average > olderAverage + 0.5) trend = 'up';
        else if (average < olderAverage - 0.5) trend = 'down';

        return { average, trend };
      },

      getPersonalityInsights: () => {
        const { profile, moodHistory, chatHistory } = get();
        const insights: string[] = [];

        if (!profile) return insights;

        // Analyze communication patterns
        const totalMessages = chatHistory.reduce((sum, session) => sum + session.messages.length, 0);
        if (totalMessages > 50) {
          insights.push('Active communicator with consistent engagement');
        }

        // Analyze mood patterns
        if (moodHistory.length > 10) {
          const { trend } = get().getMoodTrend();
          if (trend === 'up') {
            insights.push('Showing positive mood progression');
          } else if (trend === 'down') {
            insights.push('May need support or encouragement');
          }
        }

        // Analyze interests
        if (profile.personality.interests.length > 0) {
          insights.push(`Interested in: ${profile.personality.interests.join(', ')}`);
        }

        return insights;
      },

      clearError: () => {
        set({ error: null });
      },

      resetProfile: () => {
        set({
          profile: null,
          currentSession: null,
          chatHistory: [],
          moodHistory: [],
          error: null,
          loadingState: 'idle',
        });
      },
    }),
    {
      name: 'digital-twin-storage',
      partialize: (state) => ({
        profile: state.profile,
        chatHistory: state.chatHistory,
        moodHistory: state.moodHistory,
      }),
    }
  )
); 