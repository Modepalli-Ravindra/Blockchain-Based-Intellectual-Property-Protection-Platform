import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import Logo from './Logo';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo size="md" showText={true} />
          <div className="flex items-center space-x-4">
            <span className="text-slate-600 dark:text-slate-300 hidden sm:block">
              {user?.email}
            </span>
            <ThemeToggle />
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;