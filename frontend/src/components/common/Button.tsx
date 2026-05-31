import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary: 'bg-cyan-500 text-white hover:bg-cyan-600 active:scale-95',
      secondary: 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95',
      ghost: 'text-cyan-400 hover:bg-cyan-500/10 active:scale-95',
      danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
      outline: 'border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? '⏳' : props.children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
