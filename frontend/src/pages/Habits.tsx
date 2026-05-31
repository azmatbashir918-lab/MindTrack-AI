import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/common/Layout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import HabitCard from '@/components/features/HabitCard';
import { Habit } from '@/types';

const HabitsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      name: 'Morning Exercise',
      description: 'Start the day with a 30-minute workout',
      category: 'Fitness',
      frequency: 'Daily',
      current_streak: 12,
      longest_streak: 45,
      reminder_time: '06:00',
      created_at: new Date().toISOString(),
      is_active: true,
    },
    {
      id: 2,
      name: 'Reading',
      description: 'Read for at least 30 minutes',
      category: 'Personal',
      frequency: 'Daily',
      current_streak: 8,
      longest_streak: 30,
      reminder_time: '19:00',
      created_at: new Date().toISOString(),
      is_active: true,
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Personal',
    frequency: 'Daily',
    reminder_time: '08:00',
  });

  const handleAddHabit = () => {
    if (formData.name.trim()) {
      const newHabit: Habit = {
        id: Math.max(...habits.map((h) => h.id), 0) + 1,
        ...formData,
        current_streak: 0,
        longest_streak: 0,
        created_at: new Date().toISOString(),
        is_active: true,
      };
      setHabits([...habits, newHabit]);
      setFormData({
        name: '',
        description: '',
        category: 'Personal',
        frequency: 'Daily',
        reminder_time: '08:00',
      });
      setIsModalOpen(false);
    }
  };

  const handleDeleteHabit = (id: number) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Habits</h1>
            <p className="text-gray-400 mt-2">Track and manage your daily habits</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            ➕ Add Habit
          </Button>
        </div>

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit, idx) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <HabitCard
                habit={habit}
                onDelete={handleDeleteHabit}
                onEdit={(h) => console.log('Edit:', h)}
              />
            </motion.div>
          ))}
        </div>

        {habits.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">No habits yet</h3>
              <p className="text-gray-400 mb-4">Create your first habit to get started</p>
              <Button onClick={() => setIsModalOpen(true)}>Create Habit</Button>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Add Habit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Habit"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Habit Name"
            placeholder="e.g., Morning Meditation"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              rows={3}
              placeholder="Why is this habit important to you?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Category
              </label>
              <select
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option>Fitness</option>
                <option>Study</option>
                <option>Work</option>
                <option>Health</option>
                <option>Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Frequency
              </label>
              <select
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>

          <Input
            label="Reminder Time"
            type="time"
            value={formData.reminder_time}
            onChange={(e) =>
              setFormData({ ...formData, reminder_time: e.target.value })
            }
          />

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddHabit}
              className="flex-1"
            >
              Create Habit
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default HabitsPage;
