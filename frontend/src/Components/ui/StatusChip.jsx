import { clsx } from 'clsx';

const statusMap = {
  'Scheduled': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Confirmed': 'bg-success/20 text-success-700 dark:bg-success/20 dark:text-success-300',
  'Completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Pending': 'bg-warning/20 text-warning-700 dark:bg-warning/20 dark:text-warning-300',
  'Cancelled': 'bg-danger/20 text-danger-700 dark:bg-danger/20 dark:text-danger-300',
  'Active': 'bg-success/20 text-success-700 dark:bg-success/20 dark:text-success-300',
  'Inactive': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800/30 dark:text-neutral-400',
};

export const StatusChip = ({ status, className }) => {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      statusMap[status] || 'bg-neutral-100 text-neutral-700',
      className
    )}>
      {status}
    </span>
  );
};