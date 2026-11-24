import type { HTMLAttributes } from 'react';
import { cn } from './cn';

/** White card, 24 px radius, the one soft shadow (docs/04 §4). Raised surface in dark mode. */
export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-[var(--radius-card)] bg-surface-raised p-6 shadow-soft', className)}
      {...rest}
    />
  );
}
