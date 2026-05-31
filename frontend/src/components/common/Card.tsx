import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  gradient?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, interactive = false, gradient = false, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl ${
        gradient ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50' : 'bg-gray-800/50'
      } border border-gray-700 p-6 backdrop-blur-sm ${
        interactive
          ? 'hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer transition-all'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';

export default Card;
