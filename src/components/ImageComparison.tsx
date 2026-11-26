import React, { useEffect, useRef } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { useLanguage } from '../context/LanguageContext';

interface ImageComparisonProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
  badge: string;
  className?: string;
  /** 0 shows the before image. 100 shows the after image. */
  position?: number;
}

function clamp(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  alt,
  badge,
  className = '',
  position = 50,
}) => {
  const { t } = useLanguage();
  const frameRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apply = (value: number) => {
    const next = clamp(value);
    frameRef.current?.style.setProperty('--pos', `${next}%`);
    const input = inputRef.current;
    if (!input) return;
    input.value = String(next);
    input.setAttribute('aria-valuenow', String(next));
    input.setAttribute('aria-valuetext', `${next}% ${afterLabel}`);
  };

  useEffect(() => {
    const next = clamp(position);
    frameRef.current?.style.setProperty('--pos', `${next}%`);
    const input = inputRef.current;
    if (!input) return;
    input.value = String(next);
    input.setAttribute('aria-valuenow', String(next));
    input.setAttribute('aria-valuetext', `${next}% ${afterLabel}`);
  }, [position, afterLabel]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const current = Number(event.currentTarget.value);
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = current + 5;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = current - 5;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;
    if (next === null) return;
    event.preventDefault();
    apply(next);
  };

  return (
    <div
      ref={frameRef}
      className={`compare-slider relative aspect-square w-full max-w-md overflow-hidden rounded-[28px] bg-black/40 ${className}`}
      style={{ ['--pos' as string]: '50%' }}
    >
      <OptimizedImage
        src={beforeSrc}
        alt=""
        width={640}
        height={640}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="compare-after absolute inset-0">
        <OptimizedImage
          src={afterSrc}
          alt={alt}
          width={640}
          height={640}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <span className="pointer-events-none absolute left-3 bottom-3 z-10 rounded-full bg-black/55 px-2.5 py-1 font-heading text-[11px] font-bold uppercase tracking-wide text-white">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 bottom-3 z-10 rounded-full bg-black/55 px-2.5 py-1 font-heading text-[11px] font-bold uppercase tracking-wide text-white">
        {afterLabel}
      </span>
      <span className="pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wide text-white">
        {badge}
      </span>
      <input
        ref={inputRef}
        type="range"
        className="compare-range"
        min={0}
        max={100}
        step={1}
        defaultValue={position}
        aria-label={t('sci.compare_label')}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${clamp(position)}% ${afterLabel}`}
        onInput={(event) => apply(Number(event.currentTarget.value))}
        onKeyDown={onKeyDown}
      />
      <div className="compare-grip pointer-events-none absolute inset-y-0 z-20" aria-hidden="true">
        <span className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-white" />
        <span className="absolute top-1/2 left-0 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white">
          <ChevronsLeftRight className="h-5 w-5 text-ink" />
        </span>
      </div>
    </div>
  );
};
