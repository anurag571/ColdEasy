import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Pause, Play } from 'lucide-react';
import { TESTIMONIAL_VIDEOS, TestimonialVideo } from '../../data/mock';
import { useLanguage } from '../../context/LanguageContext';
import { BrandPattern } from '../BrandPattern';
import { PlaceholderPill } from '../PlaceholderPill';
import { VideoLightbox } from './VideoLightbox';

export const MARQUEE_MIN_VIDEOS = 5;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-sand';

const VideoTile: React.FC<{
  video: TestimonialVideo;
  onOpen: (video: TestimonialVideo, opener: HTMLElement) => void;
}> = ({ video, onOpen }) => {
  const { t } = useLanguage();
  const isInstagram = video.platform === 'instagram';
  const media = (
    <div className="relative aspect-[9/16] overflow-hidden rounded-[22px] bg-studio">
      {video.posterUrl ? (
        <img
          src={video.posterUrl}
          alt=""
          className="testimonial-video-media h-full w-full object-cover"
        />
      ) : (
        <div className="testimonial-video-media absolute inset-0 flex items-center justify-center text-ink/25">
          <BrandPattern variant="subtle" />
          {!import.meta.env.PROD ? (
            <span className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
              <PlaceholderPill text={t('testimonials.poster_pending')} />
            </span>
          ) : null}
        </div>
      )}
      <span className="absolute left-2 top-2 z-10 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-bold text-white">
        {t(
          video.platform === 'youtube'
            ? 'testimonials.platform_youtube'
            : 'testimonials.platform_instagram',
        )}
      </span>
      {video.durationLabel ? (
        <span className="absolute bottom-2 right-2 z-10 text-[11px] font-bold text-white">
          {video.durationLabel}
        </span>
      ) : null}
      <span className="absolute inset-0 z-10 flex items-center justify-center" aria-hidden="true">
        <span
          className="testimonial-video-play flex h-[52px] w-[52px] items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          <Play className="ml-0.5 h-5 w-5" style={{ color: '#251a10', fill: '#251a10' }} />
        </span>
      </span>
    </div>
  );

  const caption = (
    <>
      <span className="mt-3 flex items-center gap-1 font-heading text-[13px] font-bold text-ink">
        {video.personName}
        {isInstagram ? <ExternalLink className="h-3.5 w-3.5 text-ink-60" aria-hidden="true" /> : null}
      </span>
      <span className="text-xs text-ink-60">{video.location}</span>
      {isInstagram ? <span className="sr-only">{t('testimonials.opens_instagram')}</span> : null}
    </>
  );

  const className = `testimonial-video w-[62vw] shrink-0 snap-start text-left sm:w-[200px] lg:w-[180px] ${focusRing}`;

  if (isInstagram) {
    return (
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        data-video-tile
        className={className}
      >
        {media}
        {caption}
      </a>
    );
  }

  return (
    <button
      type="button"
      data-video-tile
      className={`cursor-pointer ${className}`}
      onClick={(event) => onOpen(video, event.currentTarget)}
    >
      {media}
      {caption}
    </button>
  );
};

export const VideoRail: React.FC<{ videos?: TestimonialVideo[] }> = ({
  videos = TESTIMONIAL_VIDEOS,
}) => {
  const { t } = useLanguage();
  const rowRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState<TestimonialVideo | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  const marquee = videos.length >= MARQUEE_MIN_VIDEOS && !reducedMotion;

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row || marquee) return;
    const check = () => setOverflow(row.scrollWidth > row.clientWidth + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(row);
    return () => observer.disconnect();
  }, [marquee, videos.length]);

  const scrollByTile = (direction: number) => {
    const row = rowRef.current;
    const tile = row?.querySelector<HTMLElement>('[data-video-tile]');
    if (!row || !tile) return;
    row.scrollBy({ left: direction * (tile.offsetWidth + 16), behavior: 'smooth' });
  };

  const closeLightbox = useCallback(() => {
    setActive(null);
    openerRef.current?.focus();
  }, []);

  const openVideo = (video: TestimonialVideo, opener: HTMLElement) => {
    if (!video.youtubeId) return;
    openerRef.current = opener;
    setActive(video);
  };

  if (videos.length === 0) return null;

  const tiles = (hidden: boolean) =>
    videos.map((video) => (
      <VideoTile key={`${hidden ? 'copy' : 'live'}-${video.id}`} video={video} onOpen={openVideo} />
    ));

  return (
    <div className="rounded-[28px] border border-ink/10 bg-sand p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-heading text-[13px] font-bold uppercase tracking-wider text-ink-60">
          {t('testimonials.videos_label')}
        </p>
        <div className="flex items-center gap-2">
          {!marquee && overflow ? (
            <>
              <button
                type="button"
                onClick={() => scrollByTile(-1)}
                className={`testimonial-icon-btn flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink ${focusRing}`}
                aria-label={t('testimonials.video_prev')}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByTile(1)}
                className={`testimonial-icon-btn flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink ${focusRing}`}
                aria-label={t('testimonials.video_next')}
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          ) : null}
          {marquee ? (
            <button
              type="button"
              onClick={() => setPaused((current) => !current)}
              aria-pressed={paused}
              className={`testimonial-icon-btn inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 font-heading text-xs font-bold uppercase tracking-wider text-ink ${focusRing}`}
            >
              {paused ? (
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {paused ? t('testimonials.rail_play') : t('testimonials.rail_pause')}
            </button>
          ) : null}
        </div>
      </div>

      {marquee ? (
        <div className={`testimonial-rail overflow-hidden ${paused ? 'is-paused' : ''}`}>
          <div
            className="testimonial-rail-track flex w-max"
            style={{ animationDuration: `${videos.length * 6}s` }}
          >
            <div className="flex gap-4 pr-4">{tiles(false)}</div>
            <div className="flex gap-4 pr-4" aria-hidden="true" inert>
              {tiles(true)}
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={rowRef}
          className="testimonial-rail-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth"
        >
          {tiles(false)}
        </div>
      )}

      {active ? <VideoLightbox video={active} onClose={closeLightbox} /> : null}
    </div>
  );
};
