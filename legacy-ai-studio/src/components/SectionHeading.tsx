import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  isCentered?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  rightAction,
  className = '',
  titleClassName = '',
  isCentered = false,
}) => {
  return (
    <div
      className={`mb-8 md:mb-12 ${
        isCentered ? 'text-center' : 'flex flex-col md:flex-row md:items-end md:justify-between'
      } ${className}`}
    >
      <div className={isCentered ? 'inline-block text-left' : ''}>
        <div className="flex items-center gap-3">
          {/* Brand Signature 4px Accent Bar: rounded strip split into stacked segments of sky, marigold, chilli, and leaf */}
          <div
            className="w-1 h-7 sm:h-8 rounded-full overflow-hidden flex flex-col shrink-0"
            aria-hidden="true"
          >
            <span className="w-full h-1/4 bg-sky" />
            <span className="w-full h-1/4 bg-marigold" />
            <span className="w-full h-1/4 bg-chilli" />
            <span className="w-full h-1/4 bg-leaf" />
          </div>

          <h2
            className={`font-heading font-bold text-xl sm:text-2xl md:text-3xl text-ink uppercase tracking-wider ${titleClassName}`}
          >
            {title}
          </h2>
        </div>

        {subtitle && (
          <p className="mt-2 text-ink-60 text-sm sm:text-base font-normal max-w-2xl pl-4">
            {subtitle}
          </p>
        )}
      </div>

      {rightAction && <div className="mt-4 md:mt-0">{rightAction}</div>}
    </div>
  );
};
