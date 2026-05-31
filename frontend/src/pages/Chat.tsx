import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/common/Layout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import ChatMessage from '@/components/features/ChatMessage';
import { ChatMessage as ChatMessageType } from '@/types';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 1,
      role: 'assistant',
      content:
        'Hello! 👋 I\'m your AI wellness coach. I\'m here to help you track habits, understand your mood patterns, and provide personalized insights. What would you like to talk about today?',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessageType = {
      id: Math.max(...messages.map((m) => m.id), 0) + 1,
      role: 'user',
      content: input,
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: ChatMessageType = {
        id: Math.max(...messages.map((m) => m.id), 0) + 2,
        role: 'assistant',
        content: `That's great! Keep up the good work with your habits. Remember, consistency is more important than perfection. Would you like me to analyze your recent patterns or suggest some improvements?`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 max-w-3xl"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">AI Assistant</h1>
          <p className="text-gray-400 mt-2">Chat with your personal wellness coach</p>
        </div>

        {/* Chat Box */}
        <Card className="flex flex-col h-96 md:h-[500px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pb-4 custom-scrollbar">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-100"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2 pt-4 border-t border-gray-700">
            <Input
              placeholder="Ask me anything about your habits or mood..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleSendMessage();
                }
              }}
              className="flex-1 m-0"
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="!px-6"
            >
              Send
            </Button>
          </div>
        </Card>

        {/* Quick Prompts */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              '📊 Analyze my mood trends',
              '🎯 How are my habits going?',
              '💡 Give me a daily tip',
              '🔥 What\'s my current streak?',
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(prompt);
                }}
                className="text-left px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-sm text-gray-300 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default ChatPage;
