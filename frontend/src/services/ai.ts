import apiClient from './api';
import { ChatMessage, AIReport } from '@/types';

export const aiService = {
  chat: (message: string) => {
    return apiClient.post<ChatMessage>('/ai/chat', { message });
  },

  getChatHistory: (limit = 50, offset = 0) => {
    return apiClient.get<{ messages: ChatMessage[]; total: number }>('/ai/chat/history', {
      params: { limit, offset },
    });
  },

  deleteMessage: (id: number) => {
    return apiClient.delete(`/ai/chat/${id}`);
  },

  analyze: () => {
    return apiClient.post<AIReport>('/ai/analyze', {});
  },

  getReport: (period = 'weekly') => {
    return apiClient.get<AIReport>('/ai/report', {
      params: { period },
    });
  },
};

export default aiService;
