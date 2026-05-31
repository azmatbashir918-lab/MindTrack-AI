import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/common/Layout';
import StatsCard from '@/components/common/StatsCard';
import Card from '@/components/common/Card';
import Chart from '@/components/features/Chart';

const Dashboard: React.FC = () => {
  // Mock data - replace with API calls
  const stats = [
    { label: 'Current Streak', value: 12, icon: '🔥', trend: 8, color: 'orange' as const },
    { label: 'Habits Tracked', value: 8, icon: '🎯', trend: 0, color: 'cyan' as const },
    { label: 'Avg Mood Score', value: '7.8/10', icon: '😊', trend: 5, color: 'purple' as const },
  ];

  const habitData = [
    { day: 'Mon', completed: 6, total: 8 },
    { day: 'Tue', completed: 7, total: 8 },
    { day: 'Wed', completed: 8, total: 8 },
    { day: 'Thu', completed: 5, total: 8 },
    { day: 'Fri', completed: 7, total: 8 },
    { day: 'Sat', completed: 6, total: 8 },
    { day: 'Sun', completed: 8, total: 8 },
  ];

  const moodData = [
    { day: 'Mon', mood: 6 },
    { day: 'Tue', mood: 7 },
    { day: 'Wed', mood: 8 },
    { day: 'Thu', mood: 6 },
    { day: 'Fri', mood: 8 },
    { day: 'Sat', mood: 9 },
    { day: 'Sun', mood: 8 },
  ];

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back! Here's your weekly overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Chart
              title="Weekly Habit Completion"
              data={habitData}
              xKey="day"
              yKey="completed"
              type="bar"
              color="#00E5FF"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Chart
              title="Daily Mood Trend"
              data={moodData}
              xKey="day"
              yKey="mood"
              type="line"
              color="#7C4DFF"
            />
          </motion.div>
        </div>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '➕', label: 'Add Habit', href: '/habits' },
              { icon: '😊', label: 'Log Mood', href: '/mood' },
              { icon: '🤖', label: 'Chat AI', href: '/chat' },
              { icon: '📈', label: 'View Reports', href: '/reports' },
            ].map((action, idx) => (
              <a
                key={idx}
                href={action.href}
                className="flex flex-col items-center justify-center p-4 bg-gray-900/50 rounded-lg hover:bg-cyan-500/10 transition-colors"
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <p className="text-xs text-gray-400 text-center">{action.label}</p>
              </a>
            ))}
          </div>
        </Card>

        {/* Today's Focus */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Today's Focus</h2>
          <div className="space-y-3">
            {['Morning Exercise', 'Study Session', 'Meditation', 'Reading'].map(
              (habit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <input type="checkbox" className="w-5 h-5 rounded accent-cyan-500" />
                  <span className="text-gray-300">{habit}</span>
                  <span className="ml-auto text-xs text-gray-500">9:00 AM</span>
                </div>
              )
            )}
          </div>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;
