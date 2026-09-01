// frontend/src/components/ui/StatusChip.jsx

import { clsx } from 'clsx';

const statusMap = {
  'Scheduled': 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  'Confirmed': 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
  'Completed': 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
  'Pending': 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  'Cancelled': 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
  'Active': 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
  'Inactive': 'bg-muted/20 text-muted dark:bg-muted/20 dark:text-dark-muted',
};

export const StatusChip = ({ status, className }) => {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-chip text-xs font-medium',
      statusMap[status] || 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800/30 dark:text-neutral-400',
      className
    )}>
      {status}
    </span>
  );
};