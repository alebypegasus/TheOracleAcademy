import React, { forwardRef } from 'react';

export interface PageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noHover?: boolean;
}

export const PageCard = forwardRef<HTMLDivElement, PageCardProps>(
  ({ children, className = '', noHover = false, ...props }, ref) => {
    const cardBaseStyle = `bg-black/40 backdrop-blur-xl border border-[#1e1b4b] rounded-[2rem] relative overflow-hidden shadow-2xl transition-all duration-300 ${noHover ? '' : 'hover:border-[#312e81]'}`;

    return (
      <div ref={ref} className={`${cardBaseStyle} ${className}`} {...props}>
        {!noHover && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
        {children}
      </div>
    );
  }
);

PageCard.displayName = 'PageCard';
