import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  variant?: 'horizontal-color' | 'horizontal-reversed' | 'symbol';
  className?: string;
  height?: number; // min 36 for horizontal, 45 for symbol, or 32 when scrolled
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal-color',
  className = '',
  height = 40,
  alt = 'ColdEasy',
}) => {
  const [hasError, setHasError] = useState(false);
  const { theme } = useTheme();

  let effectiveVariant = variant;
  if (variant === 'horizontal-color' && theme === 'dark') {
    effectiveVariant = 'horizontal-reversed';
  }

  let src = '/assets/aistudio/coldeasy-logo-horizontal-color_f1a990c5.png';
  if (effectiveVariant === 'horizontal-reversed') {
    src = '/assets/aistudio/coldeasy-logo-horizontal-reversed-for-dark-bg_ad32f466.png';
  } else if (effectiveVariant === 'symbol') {
    src = '/assets/aistudio/coldeasy-symbol-color_b8d6e0a0.png';
  }

  if (hasError) {
    return (
      <div
        className={`inline-flex items-center justify-center font-heading font-bold text-xs uppercase tracking-wider px-3 border border-current rounded-md ${className}`}
        style={{ height: `${height}px`, minWidth: variant === 'symbol' ? `${height}px` : '120px' }}
        aria-label={alt}
      >
        LOGO
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ height: `${height}px`, width: 'auto' }}
      className={`object-contain transition-all duration-250 select-none ${className}`}
      onError={() => setHasError(true)}
      loading="eager"
    />
  );
};
