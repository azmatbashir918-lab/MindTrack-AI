import apiClient from './api';

export const analyticsService = {
  getDashboard: () => {
    return apiClient.get('/analytics/dashboard');
  },

  getHabitAnalytics: (period = 'week') => {
    return apiClient.get('/analytics/habits', { params: { period } });
  },

  getMoodAnalytics: (period = 'week') => {
    return apiClient.get('/analytics/mood', { params: { period } });
  },

  getProductivityMetrics: () => {
    return apiClient.get('/analytics/productivity');
  },
};

export default analyticsService;
