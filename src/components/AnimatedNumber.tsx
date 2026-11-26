import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

const formatInr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 450,
  className = '',
}) => {
  const [shown, setShown] = useState(value);
  const shownRef = useRef(value);
  const [announced, setAnnounced] = useState(() => formatInr.format(value));

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let timer = 0;
    const from = shownRef.current;

    const publish = (next: number) => {
      shownRef.current = next;
      setShown(next);
    };

    const armAnnouncement = () => {
      timer = window.setTimeout(() => setAnnounced(formatInr.format(value)), 600);
    };

    if (media.matches || from === value) {
      publish(value);
      armAnnouncement();
    } else {
      const started = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - (1 - progress) ** 3;
        publish(Math.round(from + (value - from) * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      armAnnouncement();
    }

    const onMotion = () => {
      if (!media.matches) return;
      cancelAnimationFrame(frame);
      publish(value);
    };
    media.addEventListener('change', onMotion);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      media.removeEventListener('change', onMotion);
    };
  }, [value, duration]);

  const finalText = `${prefix}${announced}${suffix}`;

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      <span aria-hidden="true">
        {prefix}
        {formatInr.format(shown)}
        {suffix}
      </span>
      <span className="sr-only" aria-live="polite">
        {finalText}
      </span>
    </span>
  );
};
