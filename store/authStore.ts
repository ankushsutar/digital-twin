import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ApiError } from '../types/api';
import { AuthSession, AuthUser, LoginForm, RegisterForm } from '../types/user';

interface AuthState {
  // State
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;

  // Actions
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthUser) => void;
  setSession: (session: AuthSession) => void;
}

// Custom storage adapter for SecureStore
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      // Fallback to regular storage if SecureStore fails
      console.warn('SecureStore failed, falling back to regular storage');
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      console.warn('Failed to remove item from SecureStore');
    }
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // Actions
      login: async (credentials: LoginForm) => {
        set({ isLoading: true, error: null });
        
        try {
          // Here you would call your actual login API
          // const response = await apiClient.post('/auth/login', credentials);
          
          // Mock response for now
          const mockUser: AuthUser = {
            id: '1',
            email: credentials.email,
            emailVerified: true,
            createdAt: new Date(),
          };

          const mockSession: AuthSession = {
            user: mockUser,
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          };

          // Store tokens securely
          await SecureStore.setItemAsync('accessToken', mockSession.accessToken);
          await SecureStore.setItemAsync('refreshToken', mockSession.refreshToken);

          set({
            user: mockUser,
            session: mockSession,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error as ApiError,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },

      register: async (userData: RegisterForm) => {
        set({ isLoading: true, error: null });
        
        try {
          // Here you would call your actual register API
          // const response = await apiClient.post('/auth/register', userData);
          
          // Mock response for now
          const mockUser: AuthUser = {
            id: '1',
            email: userData.email,
            name: userData.name,
            emailVerified: false,
            createdAt: new Date(),
          };

          const mockSession: AuthSession = {
            user: mockUser,
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          };

          // Store tokens securely
          await SecureStore.setItemAsync('accessToken', mockSession.accessToken);
          await SecureStore.setItemAsync('refreshToken', mockSession.refreshToken);

          set({
            user: mockUser,
            session: mockSession,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error as ApiError,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          // Clear secure storage
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          
          // Clear state
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Error during logout:', error);
          set({ isLoading: false });
        }
      },

      refreshSession: async () => {
        const { session } = get();
        if (!session) return;

        try {
          // Here you would call your actual refresh API
          // const response = await apiClient.post('/auth/refresh', {
          //   refreshToken: session.refreshToken,
          // });
          
          // Mock refresh for now
          const newSession: AuthSession = {
            ...session,
            accessToken: 'new-mock-access-token',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          };

          await SecureStore.setItemAsync('accessToken', newSession.accessToken);
          
          set({ session: newSession });
        } catch (error) {
          // Refresh failed, logout user
          await get().logout();
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: AuthUser) => {
        set({ user });
      },

      setSession: (session: AuthSession) => {
        set({ session, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 