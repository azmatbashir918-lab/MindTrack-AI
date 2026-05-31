import { create } from 'zustand';
import { Habit } from '@/types';

interface HabitStore {
  habits: Habit[];
  isLoading: boolean;
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: number, habit: Partial<Habit>) => void;
  deleteHabit: (id: number) => void;
  setIsLoading: (value: boolean) => void;
}

export const useHabitStore = create<HabitStore>((set) => ({
  habits: [],
  isLoading: false,
  setHabits: (habits) => set({ habits }),
  addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
  updateHabit: (id, habitData) =>
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, ...habitData } : h)),
    })),
  deleteHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    })),
  setIsLoading: (value) => set({ isLoading: value }),
}));

export default useHabitStore;
