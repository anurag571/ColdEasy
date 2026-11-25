import React, { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
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
  .filter((item) => !item.headline.includes('[CONFIRM]') && !item.headline.includes('[TBC]'))
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
      className="group flex w-[260px] shrink-0 flex-col sm:w-[300px]"
    >
      {item.image ? (
        <div className="aspect-[4/3] overflow-hidden rounded-[28px] bg-studio-deep">
          <img
            src={item.image}
            alt=""
            className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
              item.id === 'ahmedabad-mirror' ? 'object-[center_68%]' : 'object-center'
            }`}
          />
        </div>
      ) : (
        <div
          className="flex aspect-[4/3] items-center justify-center rounded-[28px] bg-studio-deep px-6 text-center"
          aria-hidden="true"
        >
          <span className="font-heading text-lg font-bold text-ink">{item.outlet}</span>
        </div>
      )}

      <div className="mt-4">
        <OutletMark logo={item.logo} outlet={item.outlet} />
      </div>

      <h3 className="mt-3 font-heading text-base font-bold leading-snug text-ink transition-colors duration-500 group-hover:text-leaf">
        {item.headline}
      </h3>

      {item.published_date ? (
        <p className="mt-2 font-body text-xs text-ink-40">
          <time dateTime={item.published_date}>{formatPublishedDate(item.published_date)}</time>
        </p>
      ) : null}

      <span className="mt-3 font-heading text-sm font-semibold text-leaf transition-opacity duration-500 group-hover:opacity-70">
        {isSocial ? instagramLabel : readLabel}
      </span>
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
    <section className="home-fade home-fade-cream relative w-full bg-studio py-16 md:py-24">
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
          <button
            type="button"
            onClick={() => {
              if (reducedMotion) return;
              setIsPaused((paused) => !paused);
            }}
            aria-pressed={isPaused || reducedMotion}
            className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-ink"
          >
            {isPaused || reducedMotion ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            {isPaused || reducedMotion ? t('media.play') : t('media.pause')}
          </button>
        </div>
      </div>

      <div
        className={`media-marquee relative w-full overflow-hidden ${reducedMotion ? 'overflow-x-auto snap-x snap-mandatory' : ''}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          className={`flex w-max gap-6 px-4 sm:gap-8 sm:px-6 ${
            reducedMotion || isPaused ? '' : `media-marquee-track ${isPaused ? 'is-paused' : ''}`
          }`}
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
