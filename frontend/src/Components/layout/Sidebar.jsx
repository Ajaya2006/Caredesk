// frontend/src/components/layout/Sidebar.jsx

import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  CalendarPlus,
  LogOut,
  Sun,
  Moon,
  PanelLeft,
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays, exact: true },
  { to: '/patients', label: 'Patients', icon: Users, exact: true },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope, exact: true },
  { to: '/appointments/book', label: 'Schedule', icon: CalendarPlus, exact: true },
];

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const Sidebar = ({ mobileOpen = false, onMobileClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = location.pathname;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigate = () => {
    if (isMobile && onMobileClose) onMobileClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const NavList = ({ collapsed }) => {
    return (
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 no-scrollbar">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.to 
            : pathname.startsWith(item.to);
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavigate}
              className={cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-100/80 dark:bg-primary-600/20 text-primary-700 dark:text-primary-400'
                  : 'text-muted dark:text-dark-muted hover:bg-background dark:hover:bg-dark-surface hover:text-text dark:hover:text-dark-text'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-primary-100/80 dark:bg-primary-600/20"
                />
              )}
              <item.icon className={cn(
                'relative z-10 h-[1.05rem] w-[1.05rem] shrink-0 transition-colors duration-200',
                isActive ? 'text-primary-600 dark:text-primary-400' : 'text-muted dark:text-dark-muted'
              )} />
              <motion.span
                initial={false}
                animate={{
                  opacity: collapsed ? 0 : 1,
                  width: collapsed ? 0 : 'auto',
                  display: collapsed ? 'none' : 'inline',
                }}
                transition={{ duration: 0.3 }}
                className="relative z-10 truncate"
              >
                {item.label}
              </motion.span>
            </NavLink>
          );
        })}
      </nav>
    );
  };

  const Brand = ({ collapsed }) => (
    <div className="flex items-center gap-3 px-5 py-6 overflow-hidden">
      <div className="relative shrink-0">
        <img 
          src="/logo.png" 
          alt="CareDesk" 
          className="h-12 w-12 object-contain rounded-xl bg-primary-50 dark:bg-primary-900/30 p-1.5 shadow-sm" 
        />
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl rounded-full -z-10" />
      </div>
      <div className="min-w-0 overflow-hidden">
        <p className="truncate text-base font-semibold text-text dark:text-dark-text">CareDesk</p>
        <p className="truncate text-[0.65rem] text-muted dark:text-dark-muted">Clinic operations</p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative flex h-full w-[280px] flex-col bg-surface dark:bg-dark-surface py-2 shadow-lg"
            >
              <Brand collapsed={false} />
              <NavList collapsed={false} />
              <div className="px-3 pt-4 pb-5 border-t border-border dark:border-dark-border mt-auto">
                <button
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted dark:text-dark-muted hover:bg-background dark:hover:bg-dark-bg hover:text-text dark:hover:text-dark-text transition-all"
                >
                  {theme === 'dark' ? <Sun className="h-[1.05rem] w-[1.05rem]" /> : <Moon className="h-[1.05rem] w-[1.05rem]" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted dark:text-dark-muted hover:bg-background dark:hover:bg-dark-bg hover:text-danger dark:hover:text-danger transition-all mt-1"
                >
                  <LogOut className="h-[1.05rem] w-[1.05rem]" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 264 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden bg-surface dark:bg-dark-surface py-2 lg:flex shadow-lg border-r border-border dark:border-dark-border"
    >
      <Brand collapsed={collapsed} />
      <NavList collapsed={collapsed} />
      <div className="px-3 pt-4 pb-5 border-t border-border dark:border-dark-border mt-auto">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted dark:text-dark-muted hover:bg-background dark:hover:bg-dark-bg hover:text-text dark:hover:text-dark-text transition-all duration-200"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <PanelLeft className="h-[1.05rem] w-[1.05rem] shrink-0" />
          </motion.div>
          <motion.span
            initial={false}
            animate={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
              display: collapsed ? 'none' : 'inline',
            }}
            transition={{ duration: 0.3 }}
          >
            Collapse
          </motion.span>
        </button>
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted dark:text-dark-muted hover:bg-background dark:hover:bg-dark-bg hover:text-text dark:hover:text-dark-text transition-all duration-200 mt-1"
        >
          {theme === 'dark' ? <Sun className="h-[1.05rem] w-[1.05rem]" /> : <Moon className="h-[1.05rem] w-[1.05rem]" />}
          <motion.span
            initial={false}
            animate={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
              display: collapsed ? 'none' : 'inline',
            }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </motion.span>
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted dark:text-dark-muted hover:bg-danger/10 hover:text-danger dark:hover:bg-danger/10 dark:hover:text-danger transition-all duration-200 mt-1"
        >
          <LogOut className="h-[1.05rem] w-[1.05rem] shrink-0" />
          <motion.span
            initial={false}
            animate={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
              display: collapsed ? 'none' : 'inline',
            }}
            transition={{ duration: 0.3 }}
          >
            Logout
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
};