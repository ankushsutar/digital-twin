import { create } from 'zustand';

interface MemoryState {
  mood: string;
  latestEntry: string;
  setMood: (mood: string) => void;
  setLatestEntry: (entry: string) => void;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  mood: 'neutral',
  latestEntry: '',
  setMood: (mood) => set({ mood }),
  setLatestEntry: (entry) => set({ latestEntry: entry }),
}));