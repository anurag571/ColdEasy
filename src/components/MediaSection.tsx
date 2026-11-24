import React from 'react';
import { MEDIA_MENTIONS } from '../data/mock';
import { ExternalLink, Newspaper } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MediaSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-sand py-16 md:py-24 border-y border-ink/5">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Heading with brand in leaf */}
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
            <span className="text-leaf">{t('media.title_prefix')}</span> {t('media.title_suffix')}
          </h2>
        </div>

        {/* 4 Cards Grid / Mobile Swipe Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4 sm:pb-0 snap-x">
          {MEDIA_MENTIONS.map((media) => (
            <a
              key={media.id}
              href="#resources"
              className="group snap-center shrink-0 min-w-[260px] sm:min-w-0 bg-white rounded-[24px] p-5 border border-ink/5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
            >
              <div>
                {/* Thumbnail placeholder with "MEDIA LOGO" placeholder chip over it */}
                <div className="relative aspect-[16/10] rounded-[18px] bg-sand overflow-hidden flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-[1.03]">
                  <Newspaper className="w-10 h-10 text-ink-40" />

                  {/* MEDIA LOGO chip over it */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-ink/10 shadow-2xs">
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-ink">
                      MEDIA LOGO
                    </span>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-base text-ink group-hover:text-leaf transition-colors">
                  {media.outlet}
                </h3>

                <p className="mt-1 text-xs font-semibold text-ink-60">{media.headline}</p>

                <p className="mt-2 text-xs text-ink-40 leading-relaxed font-body">
                  {media.caption}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-ink/5 flex items-center justify-between text-xs font-heading font-semibold text-leaf">
                <span>{t('media.read_feature')}</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
