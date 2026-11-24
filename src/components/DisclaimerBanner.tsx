import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DisclaimerBanner: React.FC = () => {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label={t('disclaimer.label')}
      className="fixed bottom-0 inset-x-0 z-40 bg-[#18140E] text-[#EDE8DE] text-xs py-2 px-4 shadow-lg border-t border-[#EDE8DE]/15 flex items-center justify-between gap-3 font-body"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto text-center sm:text-left justify-center flex-1">
        <Info className="w-3.5 h-3.5 text-sky shrink-0 hidden sm:inline" />
        <span>{t('disclaimer.body')}</span>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-full text-[#EDE8DE]/70 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        aria-label={t('disclaimer.dismiss')}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
