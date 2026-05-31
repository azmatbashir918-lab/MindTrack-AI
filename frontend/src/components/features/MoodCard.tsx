import React from 'react';
import { MoodEntry } from '@/types';
import Card from '../common/Card';
import Button from '../common/Button';

interface MoodCardProps {
  mood: MoodEntry;
  onEdit?: (mood: MoodEntry) => void;
  onDelete?: (moodId: MoodEntry['id']) => void;
}

const moodConfig = {
  excellent: { icon: '😄', color: 'text-green-400', bg: 'bg-green-500/20' },
  good: { icon: '🙂', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  neutral: { icon: '😐', color: 'text-gray-400', bg: 'bg-gray-500/20' },
  bad: { icon: '😟', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  very_bad: { icon: '😢', color: 'text-red-400', bg: 'bg-red-500/20' },
};

const MoodCard: React.FC<MoodCardProps> = ({ mood, onEdit, onDelete }) => {
  const config = moodConfig[mood.mood_level as keyof typeof moodConfig] || moodConfig.neutral;
  const date = new Date(mood.created_at).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card interactive gradient>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className={`text-4xl`}>{config.icon}</span>
              <div>
                <p className={`text-lg font-semibold ${config.color}`}>
                  {mood.mood_level.charAt(0).toUpperCase() + mood.mood_level.slice(1).replace('_', ' ')}
                </p>
                <p className="text-xs text-gray-400">{date}</p>
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
            {mood.mood_score}/10
          </span>
        </div>

        {mood.notes && (
          <div className="bg-gray-900/50 rounded-lg p-3">
            <p className="text-sm text-gray-300">{mood.notes}</p>
          </div>
        )}

        {mood.activities && mood.activities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {mood.activities.map((activity, idx) => (
              <span key={idx} className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                {activity}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(mood)}
            className="flex-1"
          >
            ✏️ Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(mood.id)}
            className="flex-1"
          >
            🗑️ Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MoodCard;
