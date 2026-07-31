import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const Card = ({ className, children, hover = true, delay = 0 }) => {
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
      whileHover={hover ? { y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' } : {}}
      className={clsx(
        'bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border shadow-card p-6 transition-all duration-300',
        hover && 'hover:shadow-card-hover',
        className
      )}
    >
      {children}
    </motion.div>
  );
};