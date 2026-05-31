import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/common/Layout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import Alert from '@/components/common/Alert';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
  });

  const handleSaveProfile = () => {
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔐' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  ];

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account and preferences</p>
        </div>

        {successMsg && (
          <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-white mb-6">Profile Information</h2>
              <div className="space-y-4">
                <Input
                  label="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                <Button onClick={handleSaveProfile} variant="primary">
                  Save Changes
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                />
                <Button variant="primary">Update Password</Button>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h2>
              <p className="text-gray-400 mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </Card>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-white mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'Habit Reminders', description: 'Get notified about habit reminders' },
                  { label: 'Daily Summary', description: 'Receive daily habit completion summary' },
                  { label: 'Streak Alerts', description: 'Alert when streaks are at risk' },
                  { label: 'Insights', description: 'AI-generated insights and recommendations' },
                  { label: 'Mood Reminders', description: 'Reminder to log your mood' },
                ].map((notification, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{notification.label}</p>
                      <p className="text-sm text-gray-400">{notification.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded accent-cyan-500"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'preferences' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-white mb-6">App Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Theme
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500">
                    <option>Dark Mode (Current)</option>
                    <option>Light Mode</option>
                    <option>Auto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Default View
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500">
                    <option>Dashboard</option>
                    <option>Habits</option>
                    <option>Mood</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Language
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                <Button variant="primary">Save Preferences</Button>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Data Management</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  📥 Download My Data
                </Button>
                <Button variant="danger" className="w-full justify-start">
                  🗑️ Delete Account
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Settings;
