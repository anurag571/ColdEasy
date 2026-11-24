import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, ExternalLink, Quote, Sparkles } from 'lucide-react';
import { TESTIMONIAL_STORIES, TestimonialStory } from '../data/mock';

// Video tiles for the marquee loop (linked to Instagram / TODO)
interface VideoTile {
  id: string;
  customerName: string;
  location: string;
  caption: string;
  videoUrl: string;
  posterUrl?: string;
  isTodoPlaceholder?: boolean;
}

const VIDEO_TILES: VideoTile[] = [
  {
    id: 'vid-1',
    customerName: 'Gunja Devi',
    location: 'Patna, Bihar',
    caption: 'Selling leafy greens fresh till late evening',
    videoUrl: 'https://www.instagram.com/coldeasyglobal',
    posterUrl: '/assets/aistudio/test_composite.jpg',
  },
  {
    id: 'vid-2',
    customerName: 'Sobha Devi',
    location: 'Bihar',
    caption: 'Overcoming mid-day vegetable spoilage and heat stress',
    videoUrl: 'https://www.instagram.com/coldeasyglobal',
    posterUrl: '/assets/aistudio/test_graded.jpg',
  },
  {
    id: 'vid-3',
    customerName: 'Lathabhai Jadhav',
    location: 'Maharashtra',
    caption: 'Flower preservation from morning harvest to mandi',
    videoUrl: 'https://www.instagram.com/coldeasyglobal',
    posterUrl: '/assets/aistudio/test_autobox2_graded.jpg',
  },
  {
    id: 'vid-4',
    customerName: 'Vannama & Lakshmi',
    location: 'Kurnool, Andhra Pradesh',
    caption: '// TODO(client): Add video reel from Instagram',
    videoUrl: 'https://www.instagram.com/coldeasyglobal',
    isTodoPlaceholder: true,
  },
  {
    id: 'vid-5',
    customerName: 'Regional Agri Collective',
    location: 'Karnataka',
    caption: '// TODO(client): Add video reel from Instagram',
    videoUrl: 'https://www.instagram.com/coldeasyglobal',
    isTodoPlaceholder: true,
  },
];

export const TestimonialsSection: React.FC = () => {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeStory: TestimonialStory =
    TESTIMONIAL_STORIES[activeStoryIndex] || TESTIMONIAL_STORIES[0];

  const handleNextStory = () => {
    setActiveStoryIndex((prev) => (prev + 1) % TESTIMONIAL_STORIES.length);
  };

  const handlePrevStory = () => {
    setActiveStoryIndex((prev) => (prev === 0 ? TESTIMONIAL_STORIES.length - 1 : prev - 1));
  };

  return (
    <section className="w-full bg-cream py-16 md:py-24 border-t border-ink/5 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Heading per brief */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-7 rounded-full overflow-hidden flex flex-col shrink-0">
              <span className="w-full h-1/4 bg-sky" />
              <span className="w-full h-1/4 bg-marigold" />
              <span className="w-full h-1/4 bg-chilli" />
              <span className="w-full h-1/4 bg-leaf" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-ink">
              CUSTOMER TESTIMONIALS
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-leaf">
            Real stories. Real experiences. Real impact.
          </p>
        </div>

        {/* 1/3 + 2/3 Grid: Mobile Stack (Card on top) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 1/3: Portrait Still-Image + Quote Card (col-span-4 on desktop) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-white rounded-[28px] p-6 sm:p-7 border border-ink/10 shadow-md relative overflow-hidden">
            <div>
              {/* Portrait Still-Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-sand mb-5 border border-ink/5">
                {activeStory.image ? (
                  <img
                    src={activeStory.image}
                    alt={activeStory.customerName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-sand/60">
                    <div className="w-12 h-12 rounded-full bg-leaf-light flex items-center justify-center text-leaf font-bold text-lg mb-2">
                      {activeStory.customerName.charAt(0)}
                    </div>
                    <span className="text-xs font-heading font-bold uppercase text-ink">
                      {activeStory.customerName}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-heading font-bold uppercase text-leaf tracking-wider shadow-2xs">
                  {activeStory.fpoRole || 'Customer Story'}
                </div>
              </div>

              {/* Quote Card Content */}
              <div className="relative">
                <Quote className="w-6 h-6 text-marigold mb-3 fill-current opacity-80" />
                <blockquote className="font-body italic text-ink text-sm sm:text-base leading-relaxed mb-4">
                  {activeStory.quote}
                </blockquote>

                <div>
                  <h4 className="font-heading font-extrabold text-base text-ink">
                    {activeStory.customerName}
                  </h4>
                  <p className="text-xs font-semibold text-leaf mt-0.5">{activeStory.crop}</p>
                  <p className="text-xs text-ink-60 mt-0.5">{activeStory.location}</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Know More -> & Prev / Next Controls */}
            <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between">
              <a
                href={`#/story/${activeStory.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-leaf hover:underline"
              >
                <span>Know More</span>
                <span>→</span>
              </a>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevStory}
                  className="w-8 h-8 rounded-full bg-sand hover:bg-leaf-light text-ink hover:text-leaf flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous customer story"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-heading font-semibold text-ink-60 px-1">
                  {activeStoryIndex + 1}/{TESTIMONIAL_STORIES.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextStory}
                  className="w-8 h-8 rounded-full bg-sand hover:bg-leaf-light text-ink hover:text-leaf flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next customer story"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right 2/3: Testimonial Video Tiles in slow seamless right-to-left loop (col-span-8 on desktop) */}
          <div
            className="lg:col-span-8 flex flex-col justify-center overflow-hidden rounded-[28px] bg-sand/40 p-4 sm:p-6 border border-ink/5"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink-60 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-leaf" />
                Instagram Field Reels
              </span>
              <a
                href="https://www.instagram.com/coldeasyglobal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-heading font-bold uppercase tracking-wider text-leaf hover:underline flex items-center gap-1"
              >
                @coldeasyglobal
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Seamless scrolling marquee container */}
            <div className="relative w-full overflow-hidden">
              <div
                className={`flex gap-4 sm:gap-5 w-max transition-all ${
                  isPaused ? 'animate-none' : 'animate-[marquee_25s_linear_infinite]'
                }`}
                style={{
                  animationPlayState: isPaused ? 'paused' : 'running',
                }}
              >
                {/* Render tiles twice for continuous marquee looping */}
                {[...VIDEO_TILES, ...VIDEO_TILES].map((tile, idx) => (
                  <a
                    key={`${tile.id}-${idx}`}
                    href={tile.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[220px] sm:w-[260px] shrink-0 group block bg-white rounded-[22px] p-3 border border-ink/10 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Video Tile Box */}
                    <div className="relative aspect-[9/16] max-h-[300px] w-full rounded-[16px] overflow-hidden bg-ink/90 flex flex-col items-center justify-center text-center p-4">
                      {tile.posterUrl ? (
                        <img
                          src={tile.posterUrl}
                          alt={tile.customerName}
                          className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : null}

                      {tile.isTodoPlaceholder ? (
                        <div className="relative z-10 p-3 rounded-xl bg-ink/75 border border-white/20 text-white space-y-1">
                          <span className="px-2 py-0.5 rounded-full bg-marigold text-ink text-[10px] font-heading font-extrabold tracking-wider uppercase block">
                            TODO
                          </span>
                          <span className="text-[11px] font-medium leading-tight block">
                            Reel from Instagram
                          </span>
                        </div>
                      ) : (
                        <div className="relative z-10 w-12 h-12 rounded-full bg-leaf/90 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5 fill-white" />
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-ink/80 backdrop-blur-xs text-white text-[10px] text-center truncate">
                        Watch on Instagram
                      </div>
                    </div>

                    {/* Name and location below */}
                    <div className="mt-3 px-1">
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-ink group-hover:text-leaf transition-colors truncate">
                        {tile.customerName}
                      </h4>
                      <p className="text-[11px] text-ink-60 font-body truncate">{tile.location}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-ink-40 text-center mt-3 font-body">
              Hover or tap on any video tile to pause the reel loop.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
