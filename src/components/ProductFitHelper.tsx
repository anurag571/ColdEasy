import React, { useState } from 'react';
import { FIT_QUESTIONS, getRecommendedProduct } from '../data/mock';
import { waLink, handleWaClick } from '../lib/wa';
import { HelpCircle, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';

export const ProductFitHelper: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({
    crops: 'mixed_veg',
    volume: 'small',
    mobility: 'mobile',
  });

  const recommendation = getRecommendedProduct(answers);

  const handleSelectOption = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  return (
    <div className="mb-14 p-6 sm:p-8 rounded-[28px] bg-sand border border-ink/10 shadow-xs">
      <div className="flex items-center gap-2.5 mb-2">
        <HelpCircle className="w-5 h-5 text-leaf" />
        <h3 className="font-heading font-bold text-base sm:text-lg uppercase tracking-wider text-ink">
          Not sure which one fits?
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-ink-60 mb-6 font-body">
        Select your daily produce handling routine to see the optimal evaporative cooling match.
      </p>

      {/* 3 Chip Questions */}
      <div className="space-y-4">
        {FIT_QUESTIONS.map((q) => (
          <div key={q.id}>
            <span className="block text-xs font-heading font-bold uppercase tracking-wider text-ink mb-2">
              {q.label}
            </span>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(q.id, opt.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-leaf text-white font-semibold shadow-xs'
                        : 'bg-white text-ink hover:bg-sand border border-ink/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Result */}
      <div className="mt-6 pt-6 border-t border-ink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-marigold" />
            <span className="text-xs font-heading font-bold uppercase text-ink-40">
              Suggested Recommendation
            </span>
          </div>
          <h4 className="font-heading font-extrabold text-base text-ink mt-0.5">
            {recommendation.product.name}
          </h4>
          <p className="text-xs text-ink-60 font-body mt-1 max-w-lg">{recommendation.reason}</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={`#/products/${recommendation.product.slug}`}
            className="flex-1 sm:flex-initial py-2.5 px-5 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            View Match <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <a
            href={waLink({ type: 'product', productName: recommendation.product.name })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              handleWaClick({ type: 'product', productName: recommendation.product.name })
            }
            className="p-2.5 rounded-full border border-ink-40 text-ink hover:bg-sand transition-colors"
            title="Chat on WhatsApp for guidance"
          >
            <MessageCircle className="w-4 h-4 text-leaf" />
          </a>
        </div>
      </div>
    </div>
  );
};
