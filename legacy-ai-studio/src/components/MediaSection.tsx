import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import mediaData from '../content/media.json';

type MediaMention = {
  id: string;
  outlet: string;
  url: string;
  headline: string;
  published_date: string | null;
  type: 'article' | 'social';
  logo: string;
  image: string;
  excerpt: string;
  order: number;
  is_published: boolean;
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const mentions = (mediaData as MediaMention[])
  .filter((item) => item.is_published)
  .sort((a, b) => a.order - b.order);

function formatPublishedDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

const OutletMark: React.FC<{ logo: string; outlet: string }> = ({ logo, outlet }) => {
  const [failed, setFailed] = useState(!logo);

  if (failed) {
    return (
      <span className="font-heading font-bold text-sm uppercase tracking-wider text-ink">
        {outlet}
      </span>
    );
  }

  return (
    <img
      src={logo}
      alt={outlet}
      className="media-logo h-8 w-auto max-w-[160px] object-contain object-left"
      onError={() => setFailed(true)}
    />
  );
};

const MediaCard: React.FC<{
  item: MediaMention;
  copy: number;
  readLabel: string;
  instagramLabel: string;
}> = ({ item, copy, readLabel, instagramLabel }) => {
  const isSocial = item.type === 'social';
  const hiddenCopy = copy > 0;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={hiddenCopy || undefined}
      tabIndex={hiddenCopy ? -1 : undefined}
      className="group shrink-0 w-[280px] sm:w-[320px] bg-white rounded-[24px] p-5 border border-ink/5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
    >
      <div>
        <OutletMark logo={item.logo} outlet={item.outlet} />

        {item.image ? (
          <div className="relative mt-4 aspect-video overflow-hidden rounded-[18px] bg-sand border border-ink/10">
            <img
              src={item.image}
              alt=""
              className={`h-full w-full object-cover ${
                item.id === 'ahmedabad-mirror' ? 'object-[center_68%]' : 'object-center'
              }`}
            />
          </div>
        ) : isSocial ? (
          <div
            className="mt-4 aspect-video rounded-[18px] bg-sand border border-ink/10 flex items-center justify-center"
            aria-hidden="true"
          >
            <svg viewBox="0 0 48 48" className="w-10 h-10 text-ink-40" fill="none">
              <rect x="8" y="8" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="2" />
              <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="2" />
              <circle cx="33" cy="15" r="1.5" fill="currentColor" />
            </svg>
          </div>
        ) : null}

        <h3 className="mt-4 font-heading font-bold text-base text-ink leading-snug group-hover:text-leaf transition-colors">
          {item.headline}
        </h3>

        {item.published_date ? (
          <p className="mt-2 text-xs text-ink-40 font-body">
            <time dateTime={item.published_date}>{formatPublishedDate(item.published_date)}</time>
          </p>
        ) : null}
      </div>

      <div className="mt-5 pt-3 border-t border-ink/5 text-xs font-heading font-semibold text-leaf">
        <span>{isSocial ? instagramLabel : readLabel}</span>
      </div>
    </a>
  );
};

export const MediaSection: React.FC = () => {
  const { t } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  const loop = reducedMotion ? mentions.map((item) => ({ item, copy: 0 })) : [...mentions, ...mentions].map((item, index) => ({
    item,
    copy: index < mentions.length ? 0 : 1,
  }));

  return (
    <section className="w-full bg-sand py-16 md:py-24 border-y border-ink/5">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mb-8 md:mb-12 flex items-center gap-3">
          <div
            className="w-1 h-7 sm:h-8 rounded-full overflow-hidden flex flex-col shrink-0"
            aria-hidden="true"
          >
            <span className="w-full h-1/4 bg-sky" />
            <span className="w-full h-1/4 bg-marigold" />
            <span className="w-full h-1/4 bg-chilli" />
            <span className="w-full h-1/4 bg-leaf" />
          </div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl uppercase tracking-wider text-ink">
            {t('media.featured')}
          </h2>
        </div>
      </div>

      <div
        className={`relative w-full overflow-hidden ${reducedMotion ? 'overflow-x-auto snap-x snap-mandatory' : ''}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          className={`flex gap-4 sm:gap-5 w-max ${
            reducedMotion ? '' : isPaused ? 'animate-none' : 'animate-[marquee_25s_linear_infinite]'
          }`}
          style={{ animationPlayState: reducedMotion || isPaused ? 'paused' : 'running' }}
        >
          {loop.map(({ item, copy }) => (
            <div key={`${item.id}-${copy}`} className={reducedMotion ? 'snap-start' : undefined}>
              <MediaCard
                item={item}
                copy={copy}
                readLabel={t('media.read')}
                instagramLabel={t('media.view_instagram')}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
