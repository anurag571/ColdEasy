import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import { cn } from './cn';

/**
 * Buttons (docs/04 §5). Primary: leaf pill, white Montserrat 700, 52 px on mobile, 3 px sky
 * focus ring. Secondary: 2 px outline in the current text colour. WhatsApp: leaf with glyph.
 * Every variant has hover, focus, active and disabled states (docs/04 §10).
 */
export type ButtonVariant = 'primary' | 'secondary' | 'whatsapp' | 'ghost';
export type ButtonSize = 'md' | 'sm';

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md') {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-heading font-bold text-center',
    'transition-colors duration-150 select-none',
    'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
    'disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
    size === 'md' ? 'min-h-[52px] px-7 text-base md:min-h-12' : 'min-h-12 px-5 text-sm',
    variant === 'primary' &&
      'bg-leaf text-white uppercase tracking-wide hover:bg-leaf-dark active:bg-leaf-dark',
    variant === 'whatsapp' && 'bg-leaf text-white hover:bg-leaf-dark active:bg-leaf-dark',
    variant === 'secondary' && 'border-2 border-current text-fg hover:bg-fg/5 active:bg-fg/10',
    variant === 'ghost' && 'text-fg underline-offset-4 hover:underline',
  );
}

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant,
  size,
  className,
  children,
  type = 'button',
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cn(buttonClasses(variant, size), className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  external,
  ...rest
}: Common & ComponentProps<typeof Link> & { external?: boolean }) {
  const classes = cn(buttonClasses(variant, size), className);
  if (external) {
    return (
      <a
        className={classes}
        href={String(rest.href)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={rest['aria-label']}
        onClick={rest.onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <Link className={classes} {...rest}>
      {children}
    </Link>
  );
}
