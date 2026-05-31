import React from 'react';
import { motion } from 'framer-motion';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const typeClasses = {
    success: 'bg-green-500/10 border-green-500/50 text-green-400',
    error: 'bg-red-500/10 border-red-500/50 text-red-400',
    warning: 'bg-orange-500/10 border-orange-500/50 text-orange-400',
    info: 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`border rounded-lg p-4 flex items-start justify-between ${typeClasses[type]}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">{icons[type]}</span>
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-xl leading-none">
          ✕
        </button>
      )}
    </motion.div>
  );
};

export default Alert;
