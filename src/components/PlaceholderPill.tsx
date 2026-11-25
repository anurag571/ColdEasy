import React from 'react';

interface PlaceholderPillProps {
  type?: 'metric' | 'text';
  text?: string;
  className?: string;
}

export const PlaceholderPill: React.FC<PlaceholderPillProps> = ({
  text,
  className = '',
}) => {
  const label = text && !text.includes('[TBC]') && !text.includes('[CONFIRM]') ? text : 'Coming soon';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full bg-sand/80 text-ink text-xs font-heading font-semibold tracking-tight border border-ink/10 ${className}`}
    >
      {label}
    </span>
  );
};
