import apiClient from './api';
import { User, AuthResponse } from '@/types';

export const authService = {
  register: (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    return apiClient.post<AuthResponse>('/auth/register', userData);
  },

  login: (credentials: { email: string; password: string }) => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return Promise.resolve();
  },

  refreshToken: (refreshToken: string) => {
    return apiClient.post<AuthResponse>('/auth/refresh', { refresh_token: refreshToken });
  },

  forgotPassword: (email: string) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: (token: string, newPassword: string) => {
    return apiClient.post('/auth/reset-password', { token, new_password: newPassword });
  },

  verifyEmail: (token: string) => {
    return apiClient.post('/auth/verify-email', { token });
  },
};

export const userService = {
  getProfile: () => {
    return apiClient.get<User>('/users/profile');
  },

  updateProfile: (userData: Partial<User>) => {
    return apiClient.put<User>('/users/profile', userData);
  },

  changePassword: (currentPassword: string, newPassword: string) => {
    return apiClient.post('/users/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  deleteAccount: () => {
    return apiClient.delete('/users/profile');
  },
};

export default {
  auth: authService,
  user: userService,
};
