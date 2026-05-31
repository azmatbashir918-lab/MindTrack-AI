import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SidebarItem {
  label: string;
  path: string;
  icon: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Habits', path: '/habits', icon: '🎯' },
  { label: 'Mood', path: '/mood', icon: '😊' },
  { label: 'AI Assistant', path: '/chat', icon: '🤖' },
  { label: 'Analytics', path: '/analytics', icon: '📈' },
  { label: 'Reports', path: '/reports', icon: '📋' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col pt-8 z-50">
      <Link to="/dashboard" className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold">MT</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white">MindTrack</span>
          <span className="text-xs text-cyan-400">AI</span>
        </div>
      </Link>

      <nav className="flex-1 px-3 space-y-2">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={`relative px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                whileHover={{ x: 4 }}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 space-y-2">
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-lg p-4 border border-cyan-500/20">
          <p className="text-xs text-gray-400 mb-2">💡 Pro tip</p>
          <p className="text-sm text-gray-300">Track consistently for better AI insights!</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
