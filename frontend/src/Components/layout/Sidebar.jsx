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
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    exact: true
  },
  {
    to: '/appointments',
    label: 'Appointments',
    icon: CalendarDays,
    exact: true
  },
  {
    to: '/patients',
    label: 'Patients',
    icon: Users,
    exact: true
  },
  {
    to: '/doctors',
    label: 'Doctors',
    icon: Stethoscope,
    exact: true
  },
  {
    to: '/appointments/book',
    label: 'Appointment Desk',
    icon: CalendarPlus,
    exact: true
  },
];

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function NavList({ onNavigate, collapsed }) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 no-scrollbar">
      {navItems.map((item) => {
        // Check if this specific route is active
        const isActive = item.exact
          ? pathname === item.to
          : pathname.startsWith(item.to);

        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out',
              isActive
                ? 'text-primary-500 dark:text-primary-400'
                : 'text-muted dark:text-dark-muted hover:text-text dark:hover:text-dark-text hover:bg-primary-500/10 dark:hover:bg-primary-400/10'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="rail-active-pill"
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 30,
                  mass: 0.8,
                }}
                className="absolute inset-0 rounded-xl bg-primary-500/10 dark:bg-primary-400/10"
              />
            )}
            <item.icon className="relative z-10 h-[1.05rem] w-[1.05rem] shrink-0 transition-all duration-300" />
            <motion.span
              initial={false}
              animate={{
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : 'auto',
                display: collapsed ? 'none' : 'inline',
              }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className="relative z-10 truncate"
            >
              {item.label}
            </motion.span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function RailBrand({ collapsed }) {
  return (
    <div className="flex items-center gap-3 px-5 py-6 overflow-hidden">
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08))',
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="CareDesk"
          className="h-12 w-12 object-contain rounded-xl bg-white/10 dark:bg-dark-surface/20 p-1.5"
        />
      </div>
      <div className="min-w-0 overflow-hidden flex flex-col justify-center">
        <p className="text-display truncate text-base font-semibold text-text dark:text-dark-text leading-tight">
          CareDesk
        </p>
        <p className="truncate text-[0.65rem] text-muted dark:text-dark-muted leading-tight">Clinic operations</p>
      </div>
    </div>
  );
}

export const Sidebar = ({ mobileOpen = false, onMobileClose = () => { } }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar on navigation
  const handleNavigate = () => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // If mobile, render mobile drawer
  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              className="relative flex h-full w-[280px] flex-col bg-surface dark:bg-dark-surface py-2 shadow-2xl"
            >
              <RailBrand collapsed={false} />
              <NavList collapsed={false} onNavigate={handleNavigate} />
              <div className="px-3 pt-4 pb-5 border-t border-border dark:border-dark-border mt-auto">
                <button
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted dark:text-dark-muted transition-all hover:text-text dark:hover:text-dark-text hover:bg-primary-500/10 dark:hover:bg-primary-400/10"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-[1.05rem] w-[1.05rem]" />
                  ) : (
                    <Moon className="h-[1.05rem] w-[1.05rem]" />
                  )}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted dark:text-dark-muted transition-all hover:text-danger hover:bg-danger/10 dark:hover:bg-danger/10 mt-1"
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

  // Desktop sidebar
  return (
    <motion.aside
      animate={{
        width: collapsed ? 80 : 264,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden bg-surface dark:bg-dark-surface border-r border-border dark:border-dark-border py-2 lg:flex shadow-xl"
    >
      <RailBrand collapsed={collapsed} />
      <NavList collapsed={collapsed} />
      <div className="px-3 pt-4 pb-5 border-t border-border dark:border-dark-border mt-auto">
        {/* Collapse Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCollapsed((v) => !v)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted dark:text-dark-muted transition-all duration-300 hover:text-text dark:hover:text-dark-text hover:bg-primary-500/10 dark:hover:bg-primary-400/10"
        >
          <motion.div
            animate={{
              rotate: collapsed ? 180 : 0,
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
          >
            <PanelLeft className="h-[1.05rem] w-[1.05rem] shrink-0" />
          </motion.div>
          <motion.span
            initial={false}
            animate={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
              display: collapsed ? 'none' : 'inline',
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
          >
            Collapse
          </motion.span>
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted dark:text-dark-muted transition-all duration-300 hover:text-text dark:hover:text-dark-text hover:bg-primary-500/10 dark:hover:bg-primary-400/10 mt-1"
        >
          {theme === 'dark' ? (
            <Sun className="h-[1.05rem] w-[1.05rem] shrink-0" />
          ) : (
            <Moon className="h-[1.05rem] w-[1.05rem] shrink-0" />
          )}
          <motion.span
            initial={false}
            animate={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
              display: collapsed ? 'none' : 'inline',
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </motion.span>
        </motion.button>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted dark:text-dark-muted transition-all duration-300 hover:text-danger hover:bg-danger/10 dark:hover:bg-danger/10 mt-1"
        >
          <LogOut className="h-[1.05rem] w-[1.05rem] shrink-0" />
          <motion.span
            initial={false}
            animate={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
              display: collapsed ? 'none' : 'inline',
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
          >
            Logout
          </motion.span>
        </motion.button>
      </div>
    </motion.aside>
  );
};