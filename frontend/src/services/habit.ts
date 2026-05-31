import apiClient from './api';
import { Habit, HabitCompletion } from '@/types';

export const habitService = {
  list: (limit = 100, offset = 0) => {
    return apiClient.get<{ habits: Habit[]; total: number }>('/habits', {
      params: { limit, offset },
    });
  },

  get: (id: number) => {
    return apiClient.get<Habit>(`/habits/${id}`);
  },

  create: (habitData: Omit<Habit, 'id' | 'created_at'>) => {
    return apiClient.post<Habit>('/habits/create', habitData);
  },

  update: (id: number, habitData: Partial<Habit>) => {
    return apiClient.put<Habit>(`/habits/${id}`, habitData);
  },

  delete: (id: number) => {
    return apiClient.delete(`/habits/${id}`);
  },

  markComplete: (id: number) => {
    return apiClient.post<HabitCompletion>(`/habits/${id}/complete`, {});
  },

  getStats: (id: number) => {
    return apiClient.get<{
      current_streak: number;
      longest_streak: number;
      completion_rate: number;
    }>(`/habits/${id}/stats`);
  },

  getAnalytics: () => {
    return apiClient.get<{
      total_habits: number;
      completion_rate: number;
      avg_streak: number;
    }>('/habits/analytics');
  },
};

export default habitService;
