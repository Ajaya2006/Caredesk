import { Button } from './Button';

export const EmptyState = ({ title, description, actionLabel, onAction, illustration }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <img
        src={`${import.meta.env.BASE_URL}illustrations/${illustration || 'empty-default'}.png`}
        alt={title}
        className="w-48 h-48 mb-6 opacity-50 dark:opacity-30"
      />
      <h3 className="text-xl font-heading font-bold text-text dark:text-dark-text">{title}</h3>
      <p className="text-muted dark:text-dark-muted mt-2 max-w-sm">{description}</p>
      {actionLabel && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};