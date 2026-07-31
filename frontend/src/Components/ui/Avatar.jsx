import { clsx } from 'clsx';

export const Avatar = ({ name, className, size = 'md', image = null }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg',
  };

  const colors = [
    'bg-blue-500/20 text-blue-500 dark:bg-blue-500/30 dark:text-blue-400',
    'bg-purple-500/20 text-purple-500 dark:bg-purple-500/30 dark:text-purple-400',
    'bg-emerald-500/20 text-emerald-500 dark:bg-emerald-500/30 dark:text-emerald-400',
    'bg-amber-500/20 text-amber-500 dark:bg-amber-500/30 dark:text-amber-400',
    'bg-rose-500/20 text-rose-500 dark:bg-rose-500/30 dark:text-rose-400',
    'bg-cyan-500/20 text-cyan-500 dark:bg-cyan-500/30 dark:text-cyan-400',
  ];

  const colorIndex = name ? name.length % colors.length : 0;

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={clsx('rounded-full object-cover shrink-0', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-semibold shrink-0',
        sizes[size],
        colors[colorIndex],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};