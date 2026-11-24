'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n/client';
import { PlayIcon } from '@/components/icons';

/**
 * Tomato decay time-lapse, ported from the prototype (Science page, docs/11 A2).
 *
 * Changes from the prototype, on purpose:
 * - Always labelled "Illustrative" and captioned as not a ColdEasy result, because the clip
 *   is generated, not a ColdEasy photo series (11:K1-01 decides option A or B).
 * - The prototype's "Day 1 of 8" counter is gone: it mapped video seconds to days, which is
 *   an unsourced shelf-life figure (docs/08 C-06, C-27).
 * - Plays once when scrolled into view, muted, never with sound. With reduced motion it does
 *   not autoplay; it shows the first frame and a play button (docs/04 §7 rule 7).
 * - Loads nothing heavy until near the viewport; 720p on phones, 1080p from 768 px.
 *
 * When 11:K1-02 photos arrive, a photo-series variant (Day 0, 2, 4, 6, 8) replaces this clip.
 */
export function TomatoTimelapse() {
  const { t } = useI18n();
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setLoad(true);
        if (!reduced) {
          video.muted = true;
          video.play().then(
            () => setState('playing'),
            () => setState('idle'),
          );
        }
        io.disconnect();
      },
      { rootMargin: '200px 0px', threshold: 0.4 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const play = () => {
    const video = ref.current;
    if (!video) return;
    setLoad(true);
    video.currentTime = 0;
    video.muted = true;
    video.play().then(
      () => setState('playing'),
      () => setState('idle'),
    );
  };

  return (
    <figure className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-white">
        <video
          ref={ref}
          className="block aspect-video h-auto w-full"
          poster="/video/tomato-decay-poster.jpg"
          muted
          playsInline
          preload={load ? 'auto' : 'none'}
          aria-label={t('science.tomato.video_label')}
          onEnded={() => setState('ended')}
        >
          <source src="/video/tomato-decay-1080.mp4" type="video/mp4" media="(min-width: 768px)" />
          <source src="/video/tomato-decay-720.mp4" type="video/mp4" />
        </video>
        <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 font-heading text-[13px] font-bold uppercase tracking-wide text-white">
          {t('science.tomato.label')}
        </span>
        {state !== 'playing' ? (
          <button
            type="button"
            onClick={play}
            className="absolute bottom-3 right-3 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 font-heading text-sm font-bold text-white hover:bg-ink/90"
          >
            <PlayIcon width={18} height={18} />
            {state === 'ended' ? t('science.tomato.replay') : t('science.tomato.play')}
          </button>
        ) : null}
      </div>
      <figcaption className="text-sm text-fg-muted">{t('science.tomato.caption')}</figcaption>
    </figure>
  );
}
