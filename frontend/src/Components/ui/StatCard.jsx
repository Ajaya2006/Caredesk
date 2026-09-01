import { motion } from 'framer-motion';
import { Card } from './Card';
import { Button } from './Button';  // If used

export const StatCard = ({ label, value, icon: Icon, color, loading, delay = 0 }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-20 animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded" />
      </Card>
    );
  }

  const colorMap = {
    primary: 'bg-[#234EC8]/10 text-[#234EC8] dark:bg-[#234EC8]/20 dark:text-[#234EC8]',
    secondary: 'bg-secondary-500/10 text-secondary-500 dark:bg-secondary-400/20 dark:text-secondary-400',
    success: 'bg-success/10 text-success dark:bg-success/20 dark:text-success',
    warning: 'bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning',
    danger: 'bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger',
    info: 'bg-info/10 text-info dark:bg-info/20 dark:text-info',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay }}
    >
      <Card className="bg-white/70 dark:bg-dark-surface/70 backdrop-blur-md border border-white/30 dark:border-dark-border/30 shadow-lg hover:shadow-xl transition">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted dark:text-dark-muted font-medium">{label}</p>
            <p className="text-3xl font-numbers font-bold text-text dark:text-dark-text mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${colorMap[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};