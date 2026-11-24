import { cn } from './cn';

/**
 * Sold Out. docs/04 §5 asks for white 14 px bold on chilli, but that pair is 4.30:1 and fails
 * WCAG AA (docs/04 §4 itself says white on chilli only at large sizes). Built as a chilli
 * outline with ink text (16:1) until ColdEasy picks a compliant version. Flagged in the PR.
 */
export function SoldOutBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border-2 border-chilli bg-white px-3 py-1 font-heading text-sm font-bold uppercase text-ink',
        className,
      )}
    >
      <span aria-hidden="true" className="size-2 rounded-full bg-chilli" />
      {label}
    </span>
  );
}

export function Tag({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-olive px-3 py-1 text-[13px] font-medium text-ink',
        className,
      )}
    >
      {label}
    </span>
  );
}
