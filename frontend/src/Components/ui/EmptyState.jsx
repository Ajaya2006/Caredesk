import { Button } from './Button';  // ← Added import

export const EmptyState = ({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  illustration 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <img
        src={`/illustrations/${illustration || 'empty-default'}.png`}
        alt={title}
        className="w-48 h-48 mb-6 opacity-50 dark:opacity-30"
        onError={(e) => {
          // Fallback if image doesn't exist
          e.target.style.display = 'none';
        }}
      />
      <h3 className="text-xl font-heading font-bold text-text dark:text-dark-text">
        {title}
      </h3>
      <p className="text-muted dark:text-dark-muted mt-2 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};