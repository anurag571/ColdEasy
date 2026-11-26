import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TestimonialStory } from '../../data/mock';
import { useLanguage } from '../../context/LanguageContext';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-cream';

export const StoryLinks: React.FC<{ stories: TestimonialStory[] }> = ({ stories }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-1 flex-col rounded-[28px] border border-ink/10 bg-sand p-4 sm:p-5">
      <p className="mb-4 font-heading text-[13px] font-bold uppercase tracking-wider text-ink-60">
        {t('testimonials.stories_label')}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stories.map((story) => {
          const key = `story.${story.id}.description`;
          const translated = t(key);
          const title = translated === key ? story.description : translated;
          return (
            <a
              key={story.id}
              href={`#/story/${story.id}`}
              className={`testimonial-story-link flex items-start gap-3 rounded-2xl border border-ink/10 bg-cream p-4 ${focusRing}`}
            >
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-leaf" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 block font-heading text-sm font-bold text-ink">{title}</span>
                <span className="mt-1 block text-xs text-ink-60">
                  {story.customerName} · {story.location}
                </span>
              </span>
              <ArrowRight className="testimonial-story-arrow mt-0.5 h-4 w-4 shrink-0 text-ink-60" aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </div>
  );
};
