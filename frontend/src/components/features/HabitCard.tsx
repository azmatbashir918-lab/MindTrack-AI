import React from 'react';
import { motion } from 'framer-motion';
import { Habit } from '@/types';
import Card from '../common/Card';
import Button from '../common/Button';

interface HabitCardProps {
  habit: Habit;
  onComplete?: (habitId: Habit['id']) => void;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habitId: Habit['id']) => void;
  isCompleted?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onComplete,
  onEdit,
  onDelete,
  isCompleted = false,
}) => {
  const categoryColors: Record<string, string> = {
    fitness: 'bg-orange-500/20 text-orange-400',
    study: 'bg-blue-500/20 text-blue-400',
    work: 'bg-purple-500/20 text-purple-400',
    health: 'bg-green-500/20 text-green-400',
    personal: 'bg-pink-500/20 text-pink-400',
  };

  const currentStreak = habit.current_streak ?? 0;
  const longestStreak = habit.longest_streak ?? 0;
  const streakColor = currentStreak > 7 ? 'text-green-400' : 'text-orange-400';

  return (
    <Card interactive gradient>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{habit.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{habit.description}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              categoryColors[habit.category.toLowerCase()] || categoryColors.personal
            }`}
          >
            {habit.category}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Current</p>
            <p className={`text-2xl font-bold ${streakColor}`}>{currentStreak}</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Longest</p>
            <p className="text-2xl font-bold text-cyan-400">{longestStreak}</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Frequency</p>
            <p className="text-sm font-bold text-white">{habit.frequency}</p>
          </div>
        </div>

        <div className="space-y-2">
          {habit.reminder_time && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>⏰</span>
              <span>Reminder at {habit.reminder_time}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete?.(habit.id)}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              isCompleted
                ? 'bg-green-500/20 text-green-400'
                : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
            }`}
          >
            {isCompleted ? '✓ Completed' : 'Mark Done'}
          </motion.button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(habit)}
            className="!px-3"
          >
            ✏️
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(habit.id)}
            className="!px-3"
          >
            🗑️
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HabitCard;
