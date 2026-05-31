import React from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from '@/types';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';

interface ChatMessageProps {
  message: ChatMessage;
  isLoading?: boolean;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <Card
        className={`max-w-xs lg:max-w-md ${
          isUser ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-purple-500/10 border-purple-500/20'
        }`}
      >
        <div className="flex gap-3">
          {!isUser && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
          )}
          <div className="flex-1">
            <p className={`text-sm ${isUser ? 'text-cyan-200' : 'text-gray-200'}`}>
              {isLoading ? <LoadingSpinner size="sm" /> : message.content}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(message.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ChatMessageComponent;
