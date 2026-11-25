import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Quote } from 'lucide-react';
import { TESTIMONIAL_STORIES, TestimonialStory } from '../data/mock';
import { useLanguage } from '../context/LanguageContext';

interface VideoTile {
  id: string;
  customerName: string;
  location: string;
  videoUrl: string;
  posterUrl: string;
  posterPosition?: string;
}

const VIDEO_TILES: VideoTile[] = [
  {
    id: 'vid-1',
    customerName: 'Gunja Devi',
    location: 'Patna, Bihar',
    videoUrl: 'https://www.instagram.com/coldeasyglobal',
    posterUrl: '/stories/gunja-devi.webp',
    posterPosition: 'center 18%',
  },
  {
    id: 'vid-2',
    customerName: 'Sobha Devi',
    location: 'Bihar',
    videoUrl: 'https://www.instagram.com/coldeasyglobal',
    posterUrl: '/assets/aistudio/test_graded.jpg',
  },
  {
    id: 'vid-3',
    customerName: 'Lathabhai Jadhav',
    location: 'Maharashtra',
    videoUrl: 'https://www.instagram.com/coldeasyglobal',
    posterUrl: '/assets/aistudio/test_autobox2_graded.jpg',
  },
];

export const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const activeStory: TestimonialStory =
    TESTIMONIAL_STORIES[activeStoryIndex] || TESTIMONIAL_STORIES[0];

  const handleNextStory = () => {
    setActiveStoryIndex((prev) => (prev + 1) % TESTIMONIAL_STORIES.length);
  };

  const handlePrevStory = () => {
    setActiveStoryIndex((prev) => (prev === 0 ? TESTIMONIAL_STORIES.length - 1 : prev - 1));
  };

  return (
    <section className="home-fade home-fade-sand relative w-full overflow-hidden bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mb-8 flex items-center gap-3 sm:mb-10">
          <div className="flex h-7 w-1 shrink-0 flex-col overflow-hidden rounded-full">
            <span className="h-1/4 w-full bg-sky" />
            <span className="h-1/4 w-full bg-marigold" />
            <span className="h-1/4 w-full bg-chilli" />
            <span className="h-1/4 w-full bg-leaf" />
          </div>
          <h2 className="font-heading text-2xl font-extrabold uppercase tracking-wider text-ink sm:text-3xl md:text-4xl">
            {t('testimonials.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
          <article className="relative overflow-hidden rounded-[28px] lg:col-span-5">
            {activeStory.image ? (
              <img
                src={activeStory.image}
                alt={activeStory.customerName}
                className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
              />
            ) : (
              <div className="absolute inset-0 bg-[#E7DFD0]" />
            )}
            <div className="relative flex min-h-[460px] flex-col justify-end bg-gradient-to-t from-ink/80 via-ink/25 to-transparent p-5 sm:min-h-[520px] sm:p-6">
              <Quote className="mb-3 h-7 w-7 fill-marigold text-marigold" />
              <blockquote className="font-body text-base font-medium leading-relaxed text-white sm:text-lg">
                {t(`story.${activeStory.id}.quote`)}
              </blockquote>
              <p className="mt-4 font-heading text-sm font-extrabold text-white">
                {activeStory.customerName}
              </p>
              <p className="mt-0.5 text-xs text-white/80">
                {t(`story.${activeStory.id}.role`)} · {activeStory.location}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <a
                  href={`#/story/${activeStory.id}`}
                  className="text-xs font-heading font-bold uppercase tracking-wider text-white hover:underline"
                >
                  {t('testimonials.know_more')} →
                </a>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevStory}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/35"
                    aria-label={t('testimonials.prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStory}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/35"
                    aria-label={t('testimonials.next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
            {VIDEO_TILES.map((tile) => (
              <a
                key={tile.id}
                href={tile.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-[#E7DFD0]">
                  <img
                    src={tile.posterUrl}
                    alt={tile.customerName}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ objectPosition: tile.posterPosition || 'center' }}
                  />
                  <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-leaf text-white">
                    <Play className="ml-0.5 h-5 w-5 fill-white" />
                  </span>
                </div>
                <p className="mt-3 font-heading text-sm font-bold text-ink">{tile.customerName}</p>
                <p className="text-xs text-ink-60">{tile.location}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
