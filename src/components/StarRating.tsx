import React from 'react';
import { Star } from 'lucide-react';

export const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const label = Number.isInteger(rating) ? rating.toFixed(1) : String(rating);

  return (
    <p className="inline-flex items-center gap-2" aria-label={`Rated ${label} out of 5`}>
      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => {
          const fill = Math.min(1, Math.max(0, rating - index));
          return (
            <span key={index} className="relative inline-block h-3.5 w-3.5">
              <Star className="h-3.5 w-3.5 text-ink/15" strokeWidth={1.75} />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className="h-3.5 w-3.5 fill-marigold text-marigold" strokeWidth={1.75} />
              </span>
            </span>
          );
        })}
      </span>
      <span className="font-heading text-xs font-semibold text-ink-60">{label} / 5</span>
    </p>
  );
};
