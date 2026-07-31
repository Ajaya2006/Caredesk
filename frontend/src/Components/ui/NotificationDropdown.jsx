import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, Clock, AlertCircle, Calendar, User, Stethoscope } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'appointment',
    title: 'New Appointment Booked',
    description: 'Dr. Sarah Johnson has a new appointment with John Doe at 2:30 PM',
    time: '5 minutes ago',
    read: false,
    icon: Calendar,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    id: 2,
    type: 'patient',
    title: 'Patient Registered',
    description: 'Emily Wilson has been registered as a new patient',
    time: '1 hour ago',
    read: false,
    icon: User,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    id: 3,
    type: 'doctor',
    title: 'Doctor Added',
    description: 'Dr. Michael Chen has joined the clinic',
    time: '3 hours ago',
    read: true,
    icon: Stethoscope,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    id: 4,
    type: 'appointment',
    title: 'Appointment Completed',
    description: 'Checkup for Marcus Johnson completed successfully',
    time: '5 hours ago',
    read: true,
    icon: CheckCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
];

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifs, setNotifs] = useState(notifications);
  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={onClose} />
          
          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-surface dark:bg-dark-surface rounded-2xl shadow-2xl border border-border dark:border-dark-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-dark-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted dark:text-dark-muted" />
                <span className="text-sm font-semibold text-text dark:text-dark-text">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {notifs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="w-12 h-12 text-muted/30 dark:text-dark-muted/30 mb-3" />
                  <p className="text-sm text-muted dark:text-dark-muted">No notifications</p>
                  <p className="text-xs text-muted/70 dark:text-dark-muted/70">You're all caught up!</p>
                </div>
              ) : (
                notifs.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`px-4 py-3 border-b border-border/50 dark:border-dark-border/50 hover:bg-background/50 dark:hover:bg-dark-bg/50 transition-colors cursor-pointer ${
                      !notif.read ? 'bg-primary-500/5 dark:bg-primary-400/5' : ''
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${notif.bg} ${notif.color} shrink-0`}>
                        <notif.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-text dark:text-dark-text">
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted dark:text-dark-muted mt-0.5 line-clamp-2">
                          {notif.description}
                        </p>
                        <p className="text-xs text-muted/60 dark:text-dark-muted/60 mt-1">
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border dark:border-dark-border">
              <button
                onClick={() => {
                  onClose();
                  // Navigate to notifications page (future)
                }}
                className="w-full text-center text-xs text-primary-500 hover:text-primary-600 transition-colors py-1"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};