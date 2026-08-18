import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  selected?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevated = false, selected = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border transition-all',
          elevated
            ? 'bg-surface-container-lowest border-outline-variant/60 shadow-level-2'
            : 'bg-surface-container-lowest border-outline-variant/40 shadow-level-1',
          selected && 'border-primary border-2 bg-primary-container/5 ring-2 ring-primary/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
