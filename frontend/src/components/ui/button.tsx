import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'pill';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'lg', fullWidth = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-all select-none disabled:opacity-50 disabled:pointer-events-none btn-tactile';

    const variants = {
      primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-level-2 active:bg-primary',
      secondary: 'bg-secondary-container text-on-secondary-container hover:opacity-90 shadow-level-1',
      outline: 'border-2 border-primary text-primary bg-transparent hover:bg-surface-container-low',
      ghost: 'bg-transparent text-on-surface hover:bg-surface-container active:scale-95',
      destructive: 'bg-error text-on-error hover:opacity-90 shadow-level-1',
      pill: 'bg-primary-container/15 text-primary border border-primary/20 hover:bg-primary-container/25 rounded-full',
    };

    const sizes = {
      sm: 'h-10 px-3 text-sm rounded-lg min-h-[40px]',
      md: 'h-12 px-4 text-base rounded-xl min-h-[48px]',
      lg: 'h-14 px-6 text-[18px] rounded-xl min-h-[56px]',
      icon: 'h-12 w-12 rounded-full min-h-[48px] min-w-[48px] p-0 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
