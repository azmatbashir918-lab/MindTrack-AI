import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/common/Layout';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import MoodCard from '@/components/features/MoodCard';
import { MoodEntry, MoodLevel } from '@/types';
import { localData } from '@/utils/localData';

const moodOptions = [
  { value: MoodLevel.VERY_BAD, label: 'Very Bad', color: 'bg-red-500/20' },
  { value: MoodLevel.BAD, label: 'Bad', color: 'bg-orange-500/20' },
  { value: MoodLevel.NEUTRAL, label: 'Neutral', color: 'bg-gray-500/20' },
  { value: MoodLevel.GOOD, label: 'Good', color: 'bg-cyan-500/20' },
  { value: MoodLevel.EXCELLENT, label: 'Excellent', color: 'bg-green-500/20' },
];

const MoodPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moods, setMoods] = useState<MoodEntry[]>(() => localData.getMoods());
  const [formData, setFormData] = useState({
    mood_level: MoodLevel.NEUTRAL,
    mood_score: 5,
    notes: '',
  });

  const saveMoods = (nextMoods: MoodEntry[]) => {
    setMoods(nextMoods);
    localData.saveMoods(nextMoods);
  };

  const handleLogMood = () => {
    const newMood: MoodEntry = {
      id: Math.max(...moods.map((m) => Number(m.id)), 0) + 1,
      mood_level: formData.mood_level,
      mood_score: formData.mood_score,
      notes: formData.notes.trim() || null,
      activities: [],
      tags: [],
      created_at: new Date().toISOString(),
      is_private: false,
    };

    saveMoods([newMood, ...moods]);
    setFormData({ mood_level: MoodLevel.NEUTRAL, mood_score: 5, notes: '' });
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Mood Tracking</h1>
            <p className="text-gray-400 mt-2">Monitor your emotional well-being</p>
          </div>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Log Mood
          </Button>
        </div>

        <div className="space-y-4">
          {moods.map((mood, idx) => (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <MoodCard
                mood={mood}
                onDelete={(id) => saveMoods(moods.filter((entry) => entry.id !== id))}
              />
            </motion.div>
          ))}
        </div>

        {moods.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-white mb-2">No mood entries yet</h3>
              <p className="text-gray-400 mb-4">Start tracking your mood for insights</p>
              <Button onClick={() => setIsModalOpen(true)}>Log Your Mood</Button>
            </div>
          </Card>
        )}
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Your Mood"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              How are you feeling?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, mood_level: option.value })}
                  className={`p-3 rounded-lg text-xs transition-all ${
                    formData.mood_level === option.value
                      ? `ring-2 ring-cyan-500 ${option.color}`
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Mood Score: {formData.mood_score}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.mood_score}
              onChange={(e) =>
                setFormData({ ...formData, mood_score: parseInt(e.target.value, 10) })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Notes</label>
            <textarea
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              rows={4}
              placeholder="What's on your mind?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleLogMood} className="flex-1">
              Save Mood
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default MoodPage;
