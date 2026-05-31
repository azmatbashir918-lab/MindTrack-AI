import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/common/Layout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import ChatMessage from '@/components/features/ChatMessage';
import { ChatMessage as ChatMessageType } from '@/types';
import { buildCoachReply, localData } from '@/utils/localData';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>(() => localData.getMessages());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const saveMessages = (nextMessages: ChatMessageType[]) => {
    setMessages(nextMessages);
    localData.saveMessages(nextMessages);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: Math.max(...messages.map((m) => Number(m.id)), 0) + 1,
      role: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    saveMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: ChatMessageType = {
        id: Math.max(...nextMessages.map((m) => Number(m.id)), 0) + 1,
        role: 'assistant',
        content: buildCoachReply(userMessage.content),
        created_at: new Date().toISOString(),
      };
      saveMessages([...nextMessages, aiMessage]);
      setIsLoading(false);
    }, 700);
  };

  const quickPrompts = [
    'Analyze my mood trends',
    'How are my habits going?',
    'Give me a daily focus plan',
    "What's my current streak?",
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 max-w-3xl"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">AI Assistant</h1>
          <p className="text-gray-400 mt-2">Chat with your personal wellness coach</p>
        </div>

        <Card className="flex flex-col h-96 md:h-[500px]">
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
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-sm text-gray-300">
                  Thinking...
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-700">
            <Input
              placeholder="Ask me anything about your habits or mood..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
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

        <Card>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
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
