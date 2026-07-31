import { forwardRef } from 'react';
import { clsx } from 'clsx';

export const Select = forwardRef(({ className, options, error, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={clsx(
          'w-full h-12 rounded-xl border bg-surface dark:bg-dark-surface text-text dark:text-dark-text',
          'focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all',
          error ? 'border-danger focus:ring-danger/50' : 'border-border dark:border-dark-border',
          'px-4 appearance-none',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-muted dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && <p className="text-sm text-danger mt-1">{error}</p>}
    </div>
  );
});