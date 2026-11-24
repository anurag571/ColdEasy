import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WhatsAppFloatingButton: React.FC = () => {
  const { t } = useLanguage();
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(false);

  const defaultWaUrl =
    'https://api.whatsapp.com/send/?phone=919182968542&text&type=phone_number&app_absent=0';

  return (
    <div className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 flex items-end gap-2.5">
      {/* Friendly Tooltip Pill */}
      {!isTooltipDismissed && (
        <div className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-ink/10 text-xs font-heading font-medium text-ink animate-in fade-in slide-in-from-right-4 duration-300">
          <span className="w-2 h-2 rounded-full bg-[#25D366] shrink-0 animate-ping" />
          <span>{t('whatsapp.prompt')}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsTooltipDismissed(true);
            }}
            className="text-ink-40 hover:text-ink p-0.5 ml-1 cursor-pointer"
            aria-label={t('whatsapp.dismiss')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={defaultWaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 min-w-[52px] min-h-[52px] rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white flex items-center justify-center shadow-xl transition-all duration-200 group cursor-pointer border-2 border-white/80"
        aria-label={t('whatsapp.aria')}
        title={t('whatsapp.title')}
      >
        <MessageCircle className="w-7 h-7 fill-white stroke-none group-hover:scale-110 transition-transform" />
      </a>
    </div>
  );
};
