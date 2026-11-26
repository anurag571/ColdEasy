import React from 'react';

interface WaveDividerProps {
  variant: 'soft' | 'layered';
  flip?: boolean;
  className?: string;
}

const softPath = 'M0 48c180 18 300 18 480 0s300-18 480 0 300 18 480 0V80H0Z';
const backPath = 'M0 56c220 14 340 14 520 0s300-14 480 0 260 12 440 0V80H0Z';
const frontPath = 'M0 62c160 12 280 12 440 0s280-12 440 0 280 12 440 0 80-6 120 0V80H0Z';

export const WaveDivider: React.FC<WaveDividerProps> = ({ variant, flip = false, className = '' }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 1440 80"
    preserveAspectRatio="none"
    className={`-mb-px block h-10 w-full md:h-[72px] ${flip ? '-scale-y-100' : ''} ${className}`}
  >
    {variant === 'layered' && <path fill="currentColor" opacity="0.4" d={backPath} />}
    <path fill="currentColor" d={variant === 'soft' ? softPath : frontPath} />
  </svg>
);
