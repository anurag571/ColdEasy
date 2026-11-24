import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { FAQS } from '../data/mock';
import { track } from '../lib/track';
import { useLanguage } from '../context/LanguageContext';

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ title, subtitle, className = '' }) => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First question open by default

  const displayTitle = title || t('faqs.title');
  const displaySubtitle = subtitle || t('faqs.subtitle');

  const toggleAccordion = (index: number) => {
    const willOpen = openIndex !== index;
    setOpenIndex(willOpen ? index : null);
    if (willOpen && FAQS[index]) {
      track('faq_open', { faq_question: FAQS[index].question });
    }
  };

  return (
    <section className={`w-full bg-cream py-16 md:py-24 ${className}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionHeading title={displayTitle} subtitle={displaySubtitle} />

        {/* 2-Column Accordion on Desktop, 1-Column on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-white rounded-[22px] border border-ink/5 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-sm sm:text-base text-ink pr-2">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isOpen ? 'bg-leaf text-white rotate-180' : 'bg-sand text-ink'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-ink-60 leading-relaxed font-body border-t border-ink/5 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
