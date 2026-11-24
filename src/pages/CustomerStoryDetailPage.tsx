import React from 'react';
import { TESTIMONIAL_STORIES, TestimonialStory } from '../data/mock';
import { ChevronRight, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';

interface CustomerStoryDetailPageProps {
  storyId: string;
}

export const CustomerStoryDetailPage: React.FC<CustomerStoryDetailPageProps> = ({ storyId }) => {
  const currentIndex = TESTIMONIAL_STORIES.findIndex((s) => s.id === storyId);
  const story: TestimonialStory =
    currentIndex !== -1 ? TESTIMONIAL_STORIES[currentIndex] : TESTIMONIAL_STORIES[0];

  const prevStory =
    currentIndex > 0
      ? TESTIMONIAL_STORIES[currentIndex - 1]
      : TESTIMONIAL_STORIES[TESTIMONIAL_STORIES.length - 1];

  const nextStory =
    currentIndex < TESTIMONIAL_STORIES.length - 1
      ? TESTIMONIAL_STORIES[currentIndex + 1]
      : TESTIMONIAL_STORIES[0];

  return (
    <div className="w-full bg-cream py-10 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-heading font-medium text-ink-60 mb-6"
        >
          <a href="#/" className="hover:text-leaf transition-colors">
            Home
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-ink-40" />
          <a href="#/impact" className="hover:text-leaf transition-colors">
            Impact
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-ink-40" />
          <span className="text-ink font-semibold">{story.customerName}</span>
        </nav>

        {/* Story Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-leaf-light text-leaf text-xs font-heading font-bold uppercase tracking-wider mb-3">
            Verified Deployment Story
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink uppercase tracking-tight">
            {story.customerName}
          </h1>
          <p className="text-sm sm:text-base font-semibold text-leaf mt-1">{story.location}</p>
        </div>

        {/* Hero Card */}
        <div className="max-w-3xl space-y-6">
          <div className="p-6 sm:p-8 rounded-[24px] bg-sand border-l-4 border-leaf">
            <blockquote className="font-body italic text-base sm:text-xl text-ink leading-relaxed">
              {story.quote}
            </blockquote>
          </div>

          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-ink/10 shadow-xs">
            <h3 className="font-heading font-bold text-lg uppercase tracking-wider text-ink mb-3">
              Deployment Background
            </h3>
            <p className="text-sm text-ink-60 leading-relaxed font-body">{story.description}</p>
            <div className="mt-6">
              <a
                href={story.storyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all shadow-xs"
              >
                <span>Read Full Story on ColdEasy.in</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Prev / Next Story Links */}
          <div className="pt-6 border-t border-ink/10 flex items-center justify-between gap-4">
            <a
              href={`#/impact/stories/${prevStory.id}`}
              className="inline-flex items-center gap-2 text-xs font-heading font-semibold uppercase tracking-wider text-ink hover:text-leaf transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Story
            </a>
            <a
              href={`#/impact/stories/${nextStory.id}`}
              className="inline-flex items-center gap-2 text-xs font-heading font-semibold uppercase tracking-wider text-ink hover:text-leaf transition-colors"
            >
              Next Story
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
