import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import Modal from './Modal';

interface NavbarProps {
  onLogout?: () => void;
  userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, userName = 'User' }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 right-0 left-64 h-16 bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-4 flex-1">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all w-64"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
          </button>

          <div className="w-px h-6 bg-gray-700"></div>

          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600"></div>
            <span className="text-sm text-gray-300">{userName}</span>
          </button>
        </div>
      </nav>

      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Profile Menu"
      >
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm">Logged in as</p>
            <p className="text-white font-medium">{userName}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/settings">
              <Button variant="ghost" className="w-full justify-start">
                ⚙️ Settings
              </Button>
            </Link>
            <Button variant="danger" onClick={onLogout} className="w-full justify-start">
              🚪 Logout
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
