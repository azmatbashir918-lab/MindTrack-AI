import { create } from 'zustand';
import { MoodEntry } from '@/types';

interface MoodStore {
  moods: MoodEntry[];
  isLoading: boolean;
  setMoods: (moods: MoodEntry[]) => void;
  addMood: (mood: MoodEntry) => void;
  updateMood: (id: number, mood: Partial<MoodEntry>) => void;
  deleteMood: (id: number) => void;
  setIsLoading: (value: boolean) => void;
}

export const useMoodStore = create<MoodStore>((set) => ({
  moods: [],
  isLoading: false,
  setMoods: (moods) => set({ moods }),
  addMood: (mood) => set((state) => ({ moods: [mood, ...state.moods] })),
  updateMood: (id, moodData) =>
    set((state) => ({
      moods: state.moods.map((m) => (m.id === id ? { ...m, ...moodData } : m)),
    })),
  deleteMood: (id) =>
    set((state) => ({
      moods: state.moods.filter((m) => m.id !== id),
    })),
  setIsLoading: (value) => set({ isLoading: value }),
}));

export default useMoodStore;
