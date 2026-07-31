import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  isLoading,
  disabled,
  onClick,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 dark:shadow-primary-400/20',
    secondary: 'bg-surface text-text border border-border hover:bg-background dark:bg-dark-surface dark:text-dark-text dark:border-dark-border dark:hover:bg-dark-bg',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-lg shadow-danger/25',
    success: 'bg-success text-white hover:bg-success/90 shadow-lg shadow-success/25',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500/10 dark:border-primary-400 dark:text-primary-400',
    ghost: 'text-muted hover:bg-background dark:hover:bg-dark-bg',
    icon: 'p-2 rounded-lg hover:bg-background dark:hover:bg-dark-bg transition-colors',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-7 py-3.5 text-lg gap-2.5',
    icon: 'p-2 h-10 w-10',
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={clsx(base, variants[variant], sizes[size] || sizes.md, className)}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};