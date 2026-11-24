import type { ReactNode } from 'react';
import { cn } from './cn';

/** H2 with the brand accent bar (docs/04 §5). Uppercase, +2% tracking. */
export function SectionHeading({
  id,
  children,
  description,
  as: Tag = 'h2',
  className,
}: {
  id?: string;
  children: ReactNode;
  description?: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  return (
    <div className={cn('flex gap-4', className)}>
      <span aria-hidden="true" className="accent-bar shrink-0 self-stretch" />
      <div className="min-w-0">
        <Tag
          id={id}
          className="font-heading text-2xl font-bold uppercase tracking-[0.02em] text-fg md:text-4xl"
        >
          {children}
        </Tag>
        {description ? <p className="mt-2 max-w-[70ch] text-fg-muted">{description}</p> : null}
      </div>
    </div>
  );
}
