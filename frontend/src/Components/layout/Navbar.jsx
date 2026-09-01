// frontend/src/components/layout/Navbar.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, PanelLeft, LogOut, Sun, Moon, Bell } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useUserStore } from '../../store/userStore';
import { Avatar } from '../ui/Avatar';
import { NotificationDropdown } from '../ui/NotificationDropdown';
import { toast } from 'sonner';

export const Navbar = ({ onMobileMenuClick }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { user, fetchUser, reset } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('🔍 Navbar mounted, token exists:', !!token);
    
    if (token && !user) {
      fetchUser();
    }
  }, []);

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    reset();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-border dark:border-dark-border"
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={onMobileMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-background dark:hover:bg-dark-bg transition-colors border border-border dark:border-dark-border"
          >
            <PanelLeft className="h-5 w-5 text-muted dark:text-dark-muted" />
          </button>

          <div className="hidden sm:flex flex-1 max-w-md items-center gap-2 rounded-xl border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted dark:text-dark-muted" />
            <input
              placeholder="Search patients, doctors, appointments..."
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted dark:placeholder-dark-muted text-text dark:text-dark-text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate('/patients');
                }
              }}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-border dark:border-dark-border text-muted dark:text-dark-muted hover:text-text dark:hover:text-dark-text hover:bg-background dark:hover:bg-dark-bg transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl border border-border dark:border-dark-border text-muted dark:text-dark-muted hover:text-text dark:hover:text-dark-text hover:bg-background dark:hover:bg-dark-bg transition-colors relative"
            >
              <Bell className="h-4 w-4" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-surface dark:border-dark-surface" />
              )}
            </button>
            <NotificationDropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* User Profile with Avatar */}
          <div className="flex items-center gap-2 rounded-xl border border-border dark:border-dark-border bg-surface dark:bg-dark-surface py-1.5 pr-1.5 pl-2">
            <Avatar 
              user={user}
              name={user?.full_name || 'User'} 
              size="sm"
              className="h-7 w-7"
              email={user?.email}
            />
            <span className="hidden sm:block max-w-[9rem] truncate text-sm font-medium text-text dark:text-dark-text">
              {user?.full_name || 'User'}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-muted dark:text-dark-muted hover:bg-neutral-100 dark:hover:bg-dark-border hover:text-danger transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};