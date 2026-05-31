import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/common/Layout';
import Card from '@/components/common/Card';
import Chart from '@/components/features/Chart';

const Analytics: React.FC = () => {
  const habitTrendData = [
    { week: 'Week 1', completion: 65 },
    { week: 'Week 2', completion: 72 },
    { week: 'Week 3', completion: 78 },
    { week: 'Week 4', completion: 85 },
  ];

  const productivityData = [
    { day: 'Mon', productivity: 7 },
    { day: 'Tue', productivity: 8 },
    { day: 'Wed', productivity: 9 },
    { day: 'Thu', productivity: 7 },
    { day: 'Fri', productivity: 9 },
    { day: 'Sat', productivity: 6 },
    { day: 'Sun', productivity: 5 },
  ];

  const stats = [
    { label: 'Total Habits', value: 8, change: '+2 this month' },
    { label: 'Avg Completion', value: '75%', change: '+5% vs last month' },
    { label: 'Best Day', value: 'Friday', change: '92% completion' },
    { label: 'Streaks Active', value: 5, change: 'Over 7 days' },
  ];

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-2">Deep dive into your progress and patterns</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                <p className="text-xs text-cyan-400 mt-1">{stat.change}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Chart
              title="Monthly Habit Completion Trend"
              data={habitTrendData}
              xKey="week"
              yKey="completion"
              type="line"
              color="#00E5FF"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Chart
              title="Weekly Productivity Score"
              data={productivityData}
              xKey="day"
              yKey="productivity"
              type="bar"
              color="#7C4DFF"
            />
          </motion.div>
        </div>

        {/* Insights */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Key Insights</h2>
          <div className="space-y-3">
            {[
              {
                icon: '📈',
                title: 'Upward Trend',
                description: 'Your habit completion is improving week over week!',
              },
              {
                icon: '🎯',
                title: 'Best Performer',
                description: 'Morning Exercise is your most consistent habit (92% completion)',
              },
              {
                icon: '⏰',
                title: 'Peak Productivity',
                description: 'You\'re most productive on weekdays between 9 AM - 12 PM',
              },
              {
                icon: '🔄',
                title: 'Consistency Matters',
                description: 'You have 5 active streaks - keep the momentum!',
              },
            ].map((insight, idx) => (
              <div key={idx} className="flex gap-4 p-3 bg-gray-900/50 rounded-lg">
                <span className="text-2xl flex-shrink-0">{insight.icon}</span>
                <div>
                  <p className="font-medium text-white">{insight.title}</p>
                  <p className="text-sm text-gray-400">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default Analytics;
