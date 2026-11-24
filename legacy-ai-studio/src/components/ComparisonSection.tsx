import React from 'react';
import { Check, X } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { useLanguage } from '../context/LanguageContext';

type PointType = 'check' | 'cross' | 'none';

const PointIcon: React.FC<{ type: PointType }> = ({ type }) => {
  if (type === 'check') {
    return (
      <span className="mt-0.5 w-5 h-5 rounded-full bg-leaf text-white flex items-center justify-center shrink-0">
        <Check className="w-3 h-3 stroke-[3]" />
      </span>
    );
  }
  if (type === 'cross') {
    return (
      <span className="mt-0.5 w-5 h-5 rounded-full bg-chilli text-white flex items-center justify-center shrink-0">
        <X className="w-3 h-3 stroke-[3]" />
      </span>
    );
  }
  return (
    <span className="mt-0.5 w-5 h-5 rounded-full bg-ink/10 text-ink-60 flex items-center justify-center shrink-0 text-[11px] font-bold">
      —
    </span>
  );
};

export const ComparisonSection: React.FC = () => {
  const { t } = useLanguage();

  const rows: { fridge: PointType; cold: PointType; fridgeKey: string; coldKey: string }[] = [
    { fridge: 'cross', cold: 'check', fridgeKey: 'comparison.pt1_fridge', coldKey: 'comparison.pt1_coldeasy' },
    { fridge: 'check', cold: 'cross', fridgeKey: 'comparison.pt2_fridge', coldKey: 'comparison.pt2_coldeasy' },
    { fridge: 'cross', cold: 'check', fridgeKey: 'comparison.pt3_fridge', coldKey: 'comparison.pt3_coldeasy' },
    { fridge: 'cross', cold: 'check', fridgeKey: 'comparison.pt4_fridge', coldKey: 'comparison.pt4_coldeasy' },
    { fridge: 'none', cold: 'none', fridgeKey: 'comparison.pt5_fridge', coldKey: 'comparison.pt5_coldeasy' },
  ];

  return (
    <section id="comparison" className="w-full bg-sand py-12 md:py-16 border-y border-ink/5">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        <SectionHeading
          title={t('comparison.title')}
          subtitle={t('comparison.subtitle')}
          isCentered
          className="mb-5 md:mb-6"
        />

        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <figure className="flex flex-col items-center rounded-2xl border border-ink/10 bg-white px-2 pt-3 pb-2">
            <img
              src="/assets/aistudio/fridge-crop.jpg"
              alt={t('comparison.fridge_title')}
              className="mx-auto h-auto max-h-[72vh] w-auto max-w-full object-contain"
            />
            <figcaption className="mt-2 text-center text-[11px] sm:text-xs font-heading font-bold uppercase tracking-wide text-ink">
              {t('comparison.fridge_title')}
            </figcaption>
          </figure>
          <figure className="flex flex-col items-center rounded-2xl border border-leaf/30 bg-leaf-light/40 px-2 pt-3 pb-2">
            <img
              src="/assets/aistudio/coldeasy-crop.jpg"
              alt={t('comparison.coldeasy_title')}
              className="mx-auto h-auto max-h-[72vh] w-auto max-w-full object-contain"
            />
            <figcaption className="mt-2 text-center text-[11px] sm:text-xs font-heading font-bold uppercase tracking-wide text-leaf">
              {t('comparison.coldeasy_title')}
            </figcaption>
          </figure>

          {rows.map((row) => (
            <React.Fragment key={row.fridgeKey}>
              <div className="flex items-start gap-2 rounded-xl bg-white border border-ink/10 px-2.5 py-2 sm:px-3 sm:py-2.5">
                <PointIcon type={row.fridge} />
                <p className="text-[12px] sm:text-sm leading-snug text-ink">{t(row.fridgeKey)}</p>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-leaf-light/50 border border-leaf/20 px-2.5 py-2 sm:px-3 sm:py-2.5">
                <PointIcon type={row.cold} />
                <p className="text-[12px] sm:text-sm leading-snug font-medium text-ink">{t(row.coldKey)}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
