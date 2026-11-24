import { showStagingAids } from '@/lib/env';
import { cn } from './cn';

/**
 * Marks content that is not confirmed yet (docs/04 §5, docs/11 rule 3). Staging only:
 * in production it renders nothing, and the placeholder gate fails the build if a [TBC]
 * string is still in published content.
 */
export function PlaceholderPill({ children, className }: { children: string; className?: string }) {
  if (!showStagingAids) return null;
  return (
    <span
      data-placeholder="true"
      className={cn(
        'inline-flex max-w-full items-center rounded-full border-2 border-dashed border-ink-40',
        'bg-marigold-light px-3 py-1 text-[13px] leading-snug font-medium text-ink',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Text that may hold a [TBC: ...] marker: shows the pill on staging, hides it in production. */
export function MaybePlaceholder({ text, className }: { text: string; className?: string }) {
  if (/\[(TBC|CONFIRM)/.test(text))
    return <PlaceholderPill className={className}>{text}</PlaceholderPill>;
  return <span className={className}>{text}</span>;
}
