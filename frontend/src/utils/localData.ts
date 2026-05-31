import { ChatMessage, Habit, MoodEntry, MoodLevel } from '@/types';

const HABITS_KEY = 'mindtrack_habits';
const MOODS_KEY = 'mindtrack_moods';
const CHAT_KEY = 'mindtrack_chat_messages';

const today = () => new Date().toISOString().slice(0, 10);

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const seedHabits = (): Habit[] => [
  {
    id: 1,
    name: 'Morning Exercise',
    description: 'Start the day with a 30-minute workout',
    category: 'fitness',
    frequency: 'daily',
    current_streak: 2,
    longest_streak: 5,
    reminder_time: '06:00',
    created_at: new Date().toISOString(),
    is_active: true,
    completions: [],
  },
  {
    id: 2,
    name: 'Reading',
    description: 'Read for at least 30 minutes',
    category: 'personal',
    frequency: 'daily',
    current_streak: 1,
    longest_streak: 4,
    reminder_time: '19:00',
    created_at: new Date().toISOString(),
    is_active: true,
    completions: [],
  },
];

export const seedMoods = (): MoodEntry[] => [
  {
    id: 1,
    mood_level: MoodLevel.GOOD,
    mood_score: 7,
    notes: 'Had a great workout today',
    activities: ['Exercise', 'Work'],
    tags: ['Exercise', 'Work'],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    is_private: false,
  },
  {
    id: 2,
    mood_level: MoodLevel.EXCELLENT,
    mood_score: 9,
    notes: 'Completed a major project',
    activities: ['Achievement', 'Social'],
    tags: ['Achievement', 'Social'],
    created_at: new Date().toISOString(),
    is_private: false,
  },
];

export const seedMessages = (): ChatMessage[] => [
  {
    id: 1,
    role: 'assistant',
    content:
      "Hi, I'm your MindTrack coach. Tell me what you are working on, how you feel, or which habit is getting hard.",
    created_at: new Date().toISOString(),
  },
];

export const localData = {
  getHabits: () => read<Habit[]>(HABITS_KEY, seedHabits()),
  saveHabits: (habits: Habit[]) => write(HABITS_KEY, habits),
  getMoods: () => read<MoodEntry[]>(MOODS_KEY, seedMoods()),
  saveMoods: (moods: MoodEntry[]) => write(MOODS_KEY, moods),
  getMessages: () => read<ChatMessage[]>(CHAT_KEY, seedMessages()),
  saveMessages: (messages: ChatMessage[]) => write(CHAT_KEY, messages),
  today,
};

export const buildCoachReply = (message: string): string => {
  const text = message.toLowerCase();
  const habits = localData.getHabits();
  const moods = localData.getMoods();
  const completedToday = habits.filter((habit) => habit.completions?.includes(today()));
  const averageMood =
    moods.length > 0
      ? moods.reduce((sum, mood) => sum + mood.mood_score, 0) / moods.length
      : 0;
  const strongestHabit = [...habits].sort(
    (a, b) => (b.current_streak ?? 0) - (a.current_streak ?? 0)
  )[0];

  if (text.includes('sad') || text.includes('stress') || text.includes('anxious')) {
    return `I hear you. Your recent mood average is ${averageMood.toFixed(
      1
    )}/10, so today I would keep the plan gentle: one small habit, a short walk or breathing break, and one honest mood note. What is the smallest useful thing you can do in the next 10 minutes?`;
  }

  if (text.includes('habit') || text.includes('streak') || text.includes('routine')) {
    return `You have ${habits.length} active habits and ${completedToday.length} marked done today. ${
      strongestHabit
        ? `${strongestHabit.name} is your strongest streak at ${strongestHabit.current_streak ?? 0} days.`
        : 'Start with one habit today.'
    } Aim for consistency over intensity.`;
  }

  if (text.includes('mood') || text.includes('feel')) {
    return `Your average logged mood is ${averageMood.toFixed(
      1
    )}/10 across ${moods.length} entries. Add a quick mood note after major events today; patterns become much clearer when you capture context.`;
  }

  if (text.includes('plan') || text.includes('today') || text.includes('focus')) {
    const nextHabit = habits.find((habit) => !habit.completions?.includes(today()));
    return nextHabit
      ? `For today, focus on ${nextHabit.name}. Make it easy enough that you can finish it even on a messy day, then log your mood afterward.`
      : 'Everything is marked complete today. Nice work. Use the extra energy for recovery, reflection, or preparing tomorrow.';
  }

  return `Based on your current tracker, you have ${habits.length} habits, ${completedToday.length} completed today, and an average mood of ${averageMood.toFixed(
    1
  )}/10. I can help with a habit plan, mood reflection, or a simple focus list.`;
};
