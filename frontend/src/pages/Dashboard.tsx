import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/common/Layout';
import StatsCard from '@/components/common/StatsCard';
import Card from '@/components/common/Card';
import Chart from '@/components/features/Chart';
import { localData } from '@/utils/localData';

const Dashboard: React.FC = () => {
  const habits = localData.getHabits();
  const moods = localData.getMoods();
  const today = localData.today();
  const completedToday = habits.filter((habit) => habit.completions?.includes(today)).length;
  const averageMood =
    moods.length > 0
      ? moods.reduce((sum, mood) => sum + mood.mood_score, 0) / moods.length
      : 0;
  const bestStreak = Math.max(0, ...habits.map((habit) => habit.current_streak ?? 0));

  const stats = [
    { label: 'Current Streak', value: bestStreak, icon: 'Streak', trend: 0, color: 'orange' as const },
    { label: 'Habits Tracked', value: habits.length, icon: 'Habits', trend: 0, color: 'cyan' as const },
    {
      label: 'Avg Mood Score',
      value: averageMood ? `${averageMood.toFixed(1)}/10` : 'No data',
      icon: 'Mood',
      trend: 0,
      color: 'purple' as const,
    },
  ];

  const habitData = habits.map((habit) => ({
    name: habit.name,
    completed: habit.completions?.length ?? 0,
  }));

  const moodData = moods
    .slice()
    .reverse()
    .slice(-7)
    .map((mood, index) => ({
      entry: `#${index + 1}`,
      mood: mood.mood_score,
    }));

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">
            You completed {completedToday} of {habits.length} habits today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart
            title="Habit Completions"
            data={habitData.length ? habitData : [{ name: 'No habits', completed: 0 }]}
            xKey="name"
            yKey="completed"
            type="bar"
            color="#00E5FF"
          />

          <Chart
            title="Recent Mood Trend"
            data={moodData.length ? moodData : [{ entry: 'No mood', mood: 0 }]}
            xKey="entry"
            yKey="mood"
            type="line"
            color="#7C4DFF"
          />
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Today's Focus</h2>
          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg"
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={habit.completions?.includes(today) ?? false}
                  className="w-5 h-5 rounded accent-cyan-500"
                />
                <span className="text-gray-300">{habit.name}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {habit.reminder_time || 'Anytime'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;
