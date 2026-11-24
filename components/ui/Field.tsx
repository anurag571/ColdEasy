'use client';

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from './cn';

/**
 * Form fields (docs/04 §5): 48 px tall, 12 px radius, label above (never placeholder-only),
 * hint and error tied to the input with aria-describedby. Mobile numbers have a fixed +91
 * prefix and a numeric keypad.
 */

const inputBase = cn(
  'block w-full min-h-12 rounded-[var(--radius-field)] border-2 border-line-strong bg-surface-raised px-4',
  'text-base text-fg placeholder:text-fg-muted/80',
  'focus-visible:border-leaf focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-focus',
  'aria-invalid:border-chilli disabled:opacity-60',
);

type FieldShellProps = {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  optional?: string;
  children: ReactNode;
};

function FieldShell({ id, label, hint, error, optional, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-heading text-sm font-semibold text-fg">
        {label}
        {optional ? (
          <span className="ml-1 font-body font-normal text-fg-muted">{optional}</span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-[13px] text-fg-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-fg">
          <span aria-hidden="true" className="mr-1.5 inline-block size-2 rounded-full bg-chilli" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: ReactNode, error?: ReactNode) {
  return (
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') ||
    undefined
  );
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  optional?: string;
};

export function TextField({ label, hint, error, optional, className, ...rest }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        className={cn(inputBase, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldShell>
  );
}

export function MobileField({ label, hint, error, optional, className, ...rest }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className="flex items-stretch">
        <span
          aria-hidden="true"
          className="inline-flex items-center rounded-l-[var(--radius-field)] border-2 border-r-0 border-line-strong bg-surface-alt px-3 font-medium text-fg"
        >
          +91
        </span>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={14}
          className={cn(inputBase, 'rounded-l-none', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          {...rest}
        />
      </div>
    </FieldShell>
  );
}

type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  optional?: string;
};

export function TextArea({ label, hint, error, optional, className, ...rest }: TextAreaProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        id={id}
        className={cn(inputBase, 'min-h-32 py-3', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldShell>
  );
}

/** Consent checkbox. Never pre-ticked (docs/04 §7 rule 6, docs/07 §10). */
export function Checkbox({
  label,
  error,
  className,
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type' | 'defaultChecked'> & {
  label: ReactNode;
  error?: ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className={cn('mt-0.5 size-6 shrink-0 accent-leaf', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        <label htmlFor={id} className="text-sm text-fg">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-fg">
          <span aria-hidden="true" className="mr-1.5 inline-block size-2 rounded-full bg-chilli" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
