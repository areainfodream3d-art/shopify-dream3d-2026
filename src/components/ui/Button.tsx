import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
          {
            // Modificato per usare il tema Arancione/Fuoco
            'bg-gradient-to-r from-neon-orange to-neon-fire text-black hover:shadow-[0_0_20px_rgba(255,140,0,0.6)] hover:scale-105': variant === 'primary',
            'bg-dark-surface border border-neon-orange text-neon-orange hover:bg-neon-orange/10': variant === 'secondary',
            'border-2 border-current text-white hover:bg-white/10': variant === 'outline',
            'text-gray-400 hover:text-white hover:bg-white/5': variant === 'ghost',
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
            'px-10 py-5 text-xl': size === 'xl',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
