import React from 'react';
import { TESTIMONIAL_STORIES } from '../data/mock';
import { useLanguage } from '../context/LanguageContext';
import { FeaturedStoryCard } from './testimonials/FeaturedStoryCard';
import { StoryLinks } from './testimonials/StoryLinks';
import { VideoRail } from './testimonials/VideoRail';

const featuredStories = TESTIMONIAL_STORIES.filter((story) => story.image && !story.photoPlaceholder);

export const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="home-fade home-fade-sand relative w-full bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <header className="mb-10 text-center md:mb-14">
          <div className="mx-auto mb-4 flex h-1 w-12 overflow-hidden rounded-full" aria-hidden="true">
            <span className="h-full flex-1 bg-sky" />
            <span className="h-full flex-1 bg-marigold" />
            <span className="h-full flex-1 bg-chilli" />
            <span className="h-full flex-1 bg-leaf" />
          </div>
          <h2 className="font-heading text-2xl font-extrabold uppercase tracking-wider text-ink sm:text-3xl md:text-4xl">
            {t('testimonials.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-base text-ink-60 md:text-lg">
            {t('testimonials.subtitle')}
          </p>
        </header>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-12 lg:gap-8">
          <div className="md:col-span-5 lg:col-span-4">
            <FeaturedStoryCard stories={featuredStories} />
          </div>
          <div className="flex flex-col gap-6 md:col-span-7 lg:col-span-8">
            <VideoRail />
            <StoryLinks stories={TESTIMONIAL_STORIES} />
          </div>
        </div>
      </div>
    </section>
  );
};
