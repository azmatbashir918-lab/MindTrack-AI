import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: number;
  color?: 'cyan' | 'purple' | 'green' | 'orange';
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon = '📊',
  trend,
  color = 'cyan',
}) => {
  const colorClasses = {
    cyan: 'text-cyan-400 bg-cyan-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    green: 'text-green-400 bg-green-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <motion.p
            className="text-3xl font-bold text-white mt-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {value}
          </motion.p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span className={trend >= 0 ? 'text-green-400' : 'text-red-400'}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="text-gray-500 text-xs">vs last week</span>
            </div>
          )}
        </div>
        <div className={`text-4xl p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
