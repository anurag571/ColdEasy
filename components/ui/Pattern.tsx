import { cn } from './cn';

/**
 * The brand's minimal rounded-seed grid (docs/04 §3), decorative only. Never behind a
 * product image (docs/04 §6). The bold quarter-circle and leaf pattern needs the vector
 * from the brand book (11:B-02) and is added when those files arrive.
 */
export function SeedGrid({
  className,
  opacity = 0.08,
  id = 'seed-grid',
}: {
  className?: string;
  opacity?: number;
  /** Unique per page if the pattern is used more than once. */
  id?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={cn('pointer-events-none absolute inset-0 h-full w-full text-fg', className)}
    >
      <defs>
        <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
          <rect x="11" y="8" width="6" height="12" rx="3" fill="currentColor" opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
