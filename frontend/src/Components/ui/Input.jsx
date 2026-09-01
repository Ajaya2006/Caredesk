// frontend/src/components/ui/Input.jsx

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const Input = forwardRef(({ icon, className, error, label, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text dark:text-dark-text mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted dark:text-dark-muted">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full h-12 rounded-input border bg-surface dark:bg-dark-surface',
            'text-text dark:text-dark-text placeholder-muted dark:placeholder-dark-muted',
            'focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all',
            'hover:border-primary-300 dark:hover:border-primary-700 transition-colors',
            icon ? 'pl-10' : 'pl-4',
            'pr-4',
            error ? 'border-danger-500 focus:ring-danger-500/50' : 'border-border dark:border-dark-border',
            className
          )}
          {...props}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-danger-500 mt-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';