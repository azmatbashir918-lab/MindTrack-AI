/* Auth Types */
export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  timezone: string;
  theme: string;
  is_email_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthTokens & { user?: User };
}

/* Habit Types */
export enum HabitCategory {
  FITNESS = 'fitness',
  STUDY = 'study',
  WORK = 'work',
  HEALTH = 'health',
  PERSONAL = 'personal'
}

export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: HabitCategory;
  frequency: HabitFrequency;
  target_days: number;
  color: string;
  icon: string | null;
  reminder_time: string | null;
  reminder_enabled: boolean;
  is_active: boolean;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface HabitStats {
  habit_id: string;
  name: string;
  total_completions: number;
  current_streak: number;
  longest_streak: number;
  completion_rate: number;
  last_completed: string | null;
}

/* Mood Types */
export enum MoodLevel {
  VERY_BAD = 'very_bad',
  BAD = 'bad',
  NEUTRAL = 'neutral',
  GOOD = 'good',
  EXCELLENT = 'excellent'
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_level: MoodLevel;
  mood_score: number;
  notes: string | null;
  energy_level: number | null;
  stress_level: number | null;
  tags: string[] | null;
  created_at: string;
}

export interface MoodStats {
  total_entries: number;
  average_mood_score: number;
  most_common_mood: MoodLevel;
  entries_this_week: number;
}

/* AI Types */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tokens_used: number | null;
  created_at: string;
}

export interface ChatRequest {
  message: string;
}

/* API Response Types */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

/* Dashboard Types */
export interface DashboardData {
  user: {
    name: string;
    email: string;
    avatar: string | null;
  };
  stats: {
    total_habits: number;
    active_habits: number;
    mood_entries_this_week: number;
    average_mood: number;
  };
  habits: Habit[];
  recent_mood: Array<{
    date: string;
    mood_score: number;
    energy: number | null;
    stress: number | null;
  }>;
}
