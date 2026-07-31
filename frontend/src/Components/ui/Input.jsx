import { forwardRef } from 'react';
import { clsx } from 'clsx';

export const Input = forwardRef(({ icon, className, error, ...props }, ref) => {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted dark:text-dark-muted">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full h-12 rounded-xl border bg-surface dark:bg-dark-surface text-text dark:text-dark-text placeholder-muted dark:placeholder-dark-muted',
          'focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all',
          icon ? 'pl-10' : 'pl-4',
          'pr-4',
          error ? 'border-danger focus:ring-danger/50' : 'border-border dark:border-dark-border',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-danger mt-1">{error}</p>}
    </div>
  );
});