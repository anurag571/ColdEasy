import React from 'react';
import { Check, X } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { useLanguage } from '../context/LanguageContext';

export const ComparisonSection: React.FC = () => {
  const { t } = useLanguage();

  const fridgePoints = [
    { type: 'cross', text: t('comparison.pt1_fridge') },
    { type: 'check', text: t('comparison.pt2_fridge') },
    { type: 'cross', text: t('comparison.pt3_fridge') },
    { type: 'cross', text: t('comparison.pt4_fridge') },
    { type: 'none', text: t('comparison.pt5_fridge') },
  ];

  const coldEasyPoints = [
    { type: 'check', text: t('comparison.pt1_coldeasy') },
    { type: 'cross', text: t('comparison.pt2_coldeasy') },
    { type: 'check', text: t('comparison.pt3_coldeasy') },
    { type: 'check', text: t('comparison.pt4_coldeasy') },
    { type: 'none', text: t('comparison.pt5_coldeasy') },
  ];

  const renderIcon = (type: string) => {
    if (type === 'check') {
      return (
        <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-leaf text-white flex items-center justify-center shrink-0 shadow-xs">
          <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[3]" />
        </span>
      );
    }
    if (type === 'cross') {
      return (
        <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-chilli text-white flex items-center justify-center shrink-0 shadow-xs">
          <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[3]" />
        </span>
      );
    }
    return (
      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-ink/10 text-ink-60 flex items-center justify-center shrink-0 text-xs font-bold">
        —
      </span>
    );
  };

  return (
    <section
      id="comparison"
      className="w-full bg-sand py-16 md:py-24 border-y border-ink/5 relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionHeading
          title={t('comparison.title')}
          subtitle={t('comparison.subtitle')}
          isCentered
        />

        {/* Center Comparison Showcase */}
        <div className="mt-12 bg-white rounded-[32px] p-6 sm:p-8 md:p-12 border border-ink/10 shadow-md">
          {/* Top / Center Visual: Comparison Graphic */}
          <div className="flex flex-col items-center mb-10 pb-8 border-b border-ink/10">
            <div className="w-full max-w-2xl rounded-2xl bg-sand/40 border border-ink/10 p-3 overflow-hidden flex items-center justify-center shadow-xs">
              <img
                src="/assets/aistudio/fridge_vs_coldeasy_comparison.jpg"
                alt={t('comparison.alt')}
                className="w-full h-auto object-contain rounded-xl max-h-[420px]"
                loading="lazy"
              />
            </div>
          </div>

          {/* Points on the outer sides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left: Fridge Points */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-ink/10">
                <span className="w-2.5 h-2.5 rounded-full bg-chilli" />
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-ink">
                  {t('comparison.fridge_title')}
                </h3>
              </div>

              <div className="space-y-3">
                {fridgePoints.map((pt, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-sand/40 border border-ink/5"
                  >
                    {renderIcon(pt.type)}
                    <span className="text-xs sm:text-sm font-medium text-ink leading-relaxed pt-0.5">
                      {pt.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: ColdEasy Box Points */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-leaf/30">
                <span className="w-2.5 h-2.5 rounded-full bg-leaf" />
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-leaf">
                  {t('comparison.coldeasy_title')}
                </h3>
              </div>

              <div className="space-y-3">
                {coldEasyPoints.map((pt, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-leaf-light/30 border border-leaf/15"
                  >
                    {renderIcon(pt.type)}
                    <span className="text-xs sm:text-sm font-semibold text-ink leading-relaxed pt-0.5">
                      {pt.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
