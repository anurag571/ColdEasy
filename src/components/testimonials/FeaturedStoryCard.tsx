import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TestimonialStory } from '../../data/mock';
import { useLanguage } from '../../context/LanguageContext';
import { PlaceholderPill } from '../PlaceholderPill';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-sand';

function stripEdgeQuotes(text: string) {
  return text.replace(/^["“]+|["”]+$/g, '');
}

export const FeaturedStoryCard: React.FC<{ stories: TestimonialStory[] }> = ({ stories }) => {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [animate, setAnimate] = useState(false);
  const pointerStart = React.useRef<{ x: number; y: number } | null>(null);

  if (stories.length === 0) return null;

  const story = stories[index] ?? stories[0];
  const quote = stripEdgeQuotes(t(`story.${story.id}.quote`));
  const role = t(`story.${story.id}.role`);
  const showConsent = story.photoStatus === 'pending' && !import.meta.env.PROD;
  const verbatim = story.quoteStatus === 'verbatim-consented';

  const go = (nextDirection: 'next' | 'prev') => {
    if (stories.length < 2) return;
    setDirection(nextDirection);
    setAnimate(true);
    setIndex((current) => {
      if (nextDirection === 'next') return (current + 1) % stories.length;
      return current === 0 ? stories.length - 1 : current - 1;
    });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 'next' : 'prev');
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go('next');
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go('prev');
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t('testimonials.carousel_label')}
      onKeyDown={onKeyDown}
      className="h-full"
    >
      <article className="testimonial-featured flex h-full flex-col rounded-[28px] border border-ink/10 bg-sand p-3 sm:p-4">
        <div aria-live="polite">
          <div
            key={story.id}
            aria-label={t('testimonials.slide_label', {
              n: index + 1,
              total: stories.length,
              name: story.customerName,
            })}
            className={animate ? `testimonial-slide-${direction}` : undefined}
          >
            <div
              className="touch-pan-y"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-studio">
                <img
                  src={story.image}
                  alt={t(`story.${story.id}.photo_alt`)}
                  className="h-full w-full object-cover object-[center_30%]"
                  loading="lazy"
                  decoding="async"
                />
                {showConsent ? (
                  <span className="absolute left-3 top-3 z-10">
                    <PlaceholderPill text={t('testimonials.consent_pending')} />
                  </span>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 flex h-1/3 items-end bg-gradient-to-t from-black/70 to-transparent p-4">
                  <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-white">
                    {role} · {story.location}
                  </span>
                </div>
              </div>

              <div className="flex flex-col px-2 pb-2 pt-5">
                {verbatim ? (
                  <>
                    <Quote className="h-9 w-9 fill-marigold text-marigold" aria-hidden="true" />
                    <blockquote className="mt-3 line-clamp-4 font-heading text-lg font-semibold leading-snug text-ink md:text-xl">
                      {quote}
                    </blockquote>
                  </>
                ) : (
                  <>
                    <p className="line-clamp-4 font-body text-base leading-relaxed text-ink-60">{quote}</p>
                    {!import.meta.env.PROD ? (
                      <span className="mt-3">
                        <PlaceholderPill text={t('testimonials.quote_pending')} />
                      </span>
                    ) : null}
                  </>
                )}
                <p className="mt-4 font-heading text-[15px] font-extrabold text-ink">{story.customerName}</p>
                <p className="text-[13px] text-ink-60">
                  {role} · {story.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between px-2 pb-2 pt-5 max-sm:pb-20">
          <a
            href={`#/story/${story.id}`}
            className={`testimonial-more inline-flex min-h-11 items-center font-heading text-sm font-bold uppercase tracking-wider text-leaf underline-offset-4 ${focusRing}`}
          >
            {t('testimonials.know_more')} →
          </a>
          {stories.length > 1 ? (
            <div className="flex items-center gap-2">
              <span className="text-sm tabular-nums text-ink-60">
                {index + 1} / {stories.length}
              </span>
              <button
                type="button"
                onClick={() => go('prev')}
                className={`testimonial-icon-btn flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink ${focusRing}`}
                aria-label={t('testimonials.prev')}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go('next')}
                className={`testimonial-icon-btn flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink ${focusRing}`}
                aria-label={t('testimonials.next')}
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </article>
    </div>
  );
};
