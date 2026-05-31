import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  userName?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout, userName }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <Sidebar />
      <Navbar onLogout={onLogout} userName={userName} />
      <main className="ml-64 mt-16 p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
