import { clsx } from 'clsx';

export const Table = ({ children, className }) => {
  return (
    <div className={clsx(
      'overflow-x-auto bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border shadow-card',
      className
    )}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
};

export const TableHeader = ({ children }) => (
  <thead className="bg-background dark:bg-dark-bg border-b border-border dark:border-dark-border">
    <tr className="text-left">{children}</tr>
  </thead>
);

export const TableRow = ({ children, className }) => (
  <tr className={clsx('hover:bg-background dark:hover:bg-dark-bg transition-colors', className)}>{children}</tr>
);

export const TableCell = ({ children, className }) => (
  <td className={clsx('px-4 py-3', className)}>{children}</td>
);