/* Storage utilities */
const TOKEN_KEY = 'mindtrack_access_token';
const REFRESH_TOKEN_KEY = 'mindtrack_refresh_token';
const USER_KEY = 'mindtrack_user';

export const storage = {
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  
  setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  
  setUser(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  removeUser() {
    localStorage.removeItem(USER_KEY);
  },
  
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

/* Date formatting utilities */
export const dateUtils = {
  format(date: Date | string, format: string = 'MMM dd, yyyy'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },
  
  formatTime(date: Date | string, format: string = 'HH:mm'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  },
  
  isToday(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return d.toDateString() === today.toDateString();
  },
  
  daysAgo(date: Date | string): number {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
};

/* Validation utilities */
export const validators = {
  email(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  password(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) errors.push('Minimum 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Uppercase letter required');
    if (!/[0-9]/.test(password)) errors.push('Number required');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Special character required');
    
    return { valid: errors.length === 0, errors };
  },
  
  username(username: string): boolean {
    return username.length >= 3 && username.length <= 100;
  }
};

/* Formatting utilities */
export const formatters = {
  percentage(value: number): string {
    return `${Math.round(value)}%`;
  },
  
  moodScore(score: number): string {
    const moodMap: Record<number, string> = {
      1: '😢 Very Bad',
      2: '😞 Bad',
      3: '😐 Neutral',
      4: '😊 Good',
      5: '😄 Excellent'
    };
    return moodMap[score] || '';
  },
  
  streak(days: number): string {
    if (days === 0) return 'No streak';
    if (days === 1) return '🔥 1 day';
    return `🔥 ${days} days`;
  }
};

/* API utilities */
export const apiUtils = {
  getErrorMessage(error: any): string {
    if (error?.response?.data?.error) {
      return error.response.data.error;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An error occurred';
  }
};
