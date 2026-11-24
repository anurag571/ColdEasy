import Image from 'next/image';
import { cn } from './cn';

/**
 * The ColdEasy logo, always from the supplied file (docs/04 §3: never retype, recolour,
 * stretch or add effects). Horizontal logo minimum 36 px tall; symbol minimum 45 px.
 * 32 px is the agreed exception for the scrolled header only [TBC: ColdEasy confirmation].
 */
const FILES = {
  color: { src: '/brand/coldeasy-logo-horizontal-color.png', w: 1155, h: 337 },
  reversed: { src: '/brand/coldeasy-logo-horizontal-reversed-for-dark-bg.png', w: 1155, h: 337 },
  symbol: { src: '/brand/coldeasy-symbol-color.png', w: 342, h: 337 },
} as const;

export type LogoVariant = keyof typeof FILES;

export function Logo({
  variant = 'color',
  height = 44,
  alt,
  priority,
  className,
}: {
  variant?: LogoVariant;
  height?: number;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const file = FILES[variant];
  const min = variant === 'symbol' ? 45 : 32;
  const h = Math.max(height, min);
  const w = Math.round((file.w / file.h) * h);
  return (
    <Image
      src={file.src}
      alt={alt}
      width={w}
      height={h}
      priority={priority}
      className={cn('h-auto max-w-none', className)}
      style={{ height: h, width: w }}
    />
  );
}
