import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'tertiary';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'primary', children, ...props }) => {
  const variants = {
    primary: 'bg-primary-container text-on-primary-container font-bold',
    secondary: 'bg-secondary-container text-on-secondary-container font-bold',
    outline: 'border border-outline text-on-surface bg-surface-container-low font-medium',
    success: 'bg-primary/10 text-primary border border-primary/20 font-bold',
    warning: 'bg-amber-100 text-amber-950 border border-amber-300 font-bold',
    tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed font-bold',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm tracking-wide select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
