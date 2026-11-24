import React from 'react';
import { Star } from 'lucide-react';
import { SHOW_RATINGS, DEFAULT_REVIEW_COUNT } from '../data/mock';

interface PlaceholderPillProps {
  type?: 'rating' | 'metric' | 'text';
  text?: string;
  rating?: number;
  reviewCount?: string;
  className?: string;
}

export const PlaceholderPill: React.FC<PlaceholderPillProps> = ({
  type = 'text',
  text,
  rating = 4.9,
  reviewCount = DEFAULT_REVIEW_COUNT,
  className = '',
}) => {
  if (type === 'rating') {
    if (!SHOW_RATINGS) return null;

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50/90 text-xs text-amber-900 border border-amber-200/80 shadow-2xs select-none ${className}`}
        aria-label={`Rating: ${rating} out of 5 stars`}
      >
        <div className="flex items-center gap-0.5 text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 stroke-amber-500" />
          ))}
        </div>
        <span className="font-heading font-bold text-[11px] tracking-wide">
          {rating} <span className="text-amber-800/70 font-normal">{reviewCount}</span>
        </span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full bg-sand/80 text-ink text-xs font-heading font-semibold tracking-tight border border-ink/10 ${className}`}
    >
      {text || 'ColdEasy'}
    </span>
  );
};
