import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, PanelLeft, LogOut, Sun, Moon, Bell } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { Avatar } from '../ui/Avatar';
import { NotificationDropdown } from '../ui/NotificationDropdown';

const easeOut = {
  duration: 0.25,
  ease: [0.22, 1, 0.36, 1],
};

export const Navbar = ({ onMobileMenuClick }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread] = useState(true);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('/patients');
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={easeOut}
      className="sticky top-0 z-30 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm border-b border-border dark:border-dark-border"
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onMobileMenuClick}
            aria-label="Open navigation"
            className="lg:hidden p-2 rounded-xl hover:bg-background dark:hover:bg-dark-bg transition-colors border border-border dark:border-dark-border"
          >
            <PanelLeft className="h-5 w-5 text-muted dark:text-dark-muted" />
          </button>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-md items-center gap-2 rounded-xl border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted dark:text-dark-muted" />
            <input
              placeholder="Search patients, doctors, appointments…"
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted dark:placeholder-dark-muted text-text dark:text-dark-text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-muted hover:text-text dark:text-dark-muted dark:hover:text-dark-text transition-colors"
              >
                <span className="sr-only">Clear search</span>
                <span className="text-lg leading-none">×</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl border border-border dark:border-dark-border text-muted dark:text-dark-muted hover:text-text dark:hover:text-dark-text hover:bg-background dark:hover:bg-dark-bg transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleNotifications}
              aria-label="Notifications"
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

          {/* User Profile */}
          <div className="flex items-center gap-2 rounded-xl border border-border dark:border-dark-border bg-surface dark:bg-dark-surface py-1.5 pr-1.5 pl-2">
            <Avatar name="Admin User" className="h-7 w-7 text-xs" />
            <span className="hidden sm:block max-w-[9rem] truncate text-sm font-medium text-text dark:text-dark-text">
              Admin User
            </span>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              aria-label="Sign out"
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