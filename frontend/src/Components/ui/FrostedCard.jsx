import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const FrostedCard = ({ children, className, hover = true, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay,
      }}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      className={clsx(
        'bg-white/70 dark:bg-dark-surface/70 backdrop-blur-md border border-white/30 dark:border-dark-border/30 rounded-2xl shadow-lg p-6',
        hover && 'transition-all duration-300 hover:shadow-xl',
        className
      )}
    >
      {children}
    </motion.div>
  );
};