// frontend/src/components/ui/Avatar.jsx

import { clsx } from 'clsx';
import { useState } from 'react';

export const Avatar = ({ 
  name, 
  className, 
  size = 'md', 
  image = null,
  fallbackImage = null,
  email = null,
  user = null,
}) => {
  const [imageError, setImageError] = useState(false);

  // Get user's profile image from Google if available
  const getProfileImage = () => {
    if (image) return image;
    if (user?.profile_image) return user.profile_image;
    if (user?.picture) return user.picture;
    return null;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg',
    '2xl': 'w-16 h-16 text-xl',
  };

  const colors = [
    'bg-blue-500/20 text-blue-600 dark:bg-blue-500/30 dark:text-blue-400',
    'bg-purple-500/20 text-purple-600 dark:bg-purple-500/30 dark:text-purple-400',
    'bg-emerald-500/20 text-emerald-600 dark:bg-emerald-500/30 dark:text-emerald-400',
    'bg-amber-500/20 text-amber-600 dark:bg-amber-500/30 dark:text-amber-400',
    'bg-rose-500/20 text-rose-600 dark:bg-rose-500/30 dark:text-rose-400',
    'bg-cyan-500/20 text-cyan-600 dark:bg-cyan-500/30 dark:text-cyan-400',
    'bg-indigo-500/20 text-indigo-600 dark:bg-indigo-500/30 dark:text-indigo-400',
    'bg-pink-500/20 text-pink-600 dark:bg-pink-500/30 dark:text-pink-400',
  ];

  const profileImage = getProfileImage();
  const displayName = name || 'User';
  const initials = getInitials(displayName);
  
  // Determine color index based on name or email
  const colorIndex = displayName ? displayName.length % colors.length : 0;

  // If there's a profile image and no error, show it
  if (profileImage && !imageError) {
    return (
      <img
        src={profileImage}
        alt={displayName}
        className={clsx(
          'rounded-full object-cover shrink-0 border-2 border-white/20 dark:border-dark-border/20',
          sizes[size],
          className
        )}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  }

  // If there's a fallback image, show it
  if (fallbackImage && !imageError) {
    return (
      <img
        src={fallbackImage}
        alt={displayName}
        className={clsx(
          'rounded-full object-cover shrink-0 border-2 border-white/20 dark:border-dark-border/20',
          sizes[size],
          className
        )}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  }

  // Otherwise show initials with fallback color
  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-semibold shrink-0',
        'border-2 border-white/20 dark:border-dark-border/20',
        sizes[size],
        colors[colorIndex],
        className
      )}
    >
      {initials}
    </div>
  );
};