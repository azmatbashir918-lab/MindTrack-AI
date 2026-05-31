import apiClient from './api';
import { MoodEntry } from '@/types';

export const moodService = {
  list: (limit = 100, offset = 0) => {
    return apiClient.get<{ moods: MoodEntry[]; total: number }>('/mood', {
      params: { limit, offset },
    });
  },

  get: (id: number) => {
    return apiClient.get<MoodEntry>(`/mood/${id}`);
  },

  create: (moodData: Omit<MoodEntry, 'id' | 'created_at'>) => {
    return apiClient.post<MoodEntry>('/mood/create', moodData);
  },

  update: (id: number, moodData: Partial<MoodEntry>) => {
    return apiClient.put<MoodEntry>(`/mood/${id}`, moodData);
  },

  delete: (id: number) => {
    return apiClient.delete(`/mood/${id}`);
  },

  getHistory: (days = 7) => {
    return apiClient.get<MoodEntry[]>('/mood/history', {
      params: { days },
    });
  },

  getStats: () => {
    return apiClient.get<{
      avg_mood_score: number;
      mood_distribution: Record<string, number>;
    }>('/mood/stats');
  },
};

export default moodService;
