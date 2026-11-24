import React from 'react';

interface BrandPatternProps {
  className?: string;
  variant?: 'subtle' | 'corner-tile';
}

export const BrandPattern: React.FC<BrandPatternProps> = ({
  className = '',
  variant = 'subtle',
}) => {
  if (variant === 'corner-tile') {
    // A bolder version, made of quarter circles and leaf shapes in sky, marigold, chilli, olive, leaf and pale yellow (about 120px)
    return (
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`select-none pointer-events-none rounded-tr-[24px] overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <rect width="120" height="120" fill="transparent" />
        {/* Quarter circle top-left: sky */}
        <path d="M0 0H60C60 33.1371 33.1371 60 0 60V0Z" fill="#6FCCDD" />
        {/* Petal leaf shape top-right: marigold */}
        <path d="M60 0H120V60C86.8629 60 60 33.1371 60 0Z" fill="#F0A023" />
        {/* Leaf bottom-left: chilli */}
        <path d="M0 60C33.1371 60 60 86.8629 60 120H0V60Z" fill="#EC2727" />
        {/* Quarter circle bottom-right: olive with leaf inset */}
        <path d="M60 120C60 86.8629 86.8629 60 120 60V120H60Z" fill="#9FA738" />
        <circle cx="90" cy="90" r="15" fill="#487537" />
        <circle cx="30" cy="30" r="10" fill="#FFEBB6" />
      </svg>
    );
  }

  // Subtle grid of soft, rounded leaf or seed shapes (a half-rounded square, like a petal)
  return (
    <svg
      width="240"
      height="240"
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern id="petal-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          {/* Half-rounded square: top-left & bottom-right curved, top-right & bottom-left right-angled or softly rounded */}
          <path d="M8 8 C8 8, 32 8, 32 20 C32 32, 20 32, 8 32 Z" fill="currentColor" />
          <path
            d="M32 32 C32 32, 8 32, 8 44 C8 56, 20 56, 32 56 Z"
            fill="currentColor"
            transform="rotate(90 32 32)"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#petal-grid)" />
    </svg>
  );
};
