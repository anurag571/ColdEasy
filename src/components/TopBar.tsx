import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { MobileSignupModal } from './MobileSignupModal';

interface TopBarProps {
  onShowToast: (message: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onShowToast }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { t } = useLanguage();
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('coldeasy_signed_up');
    if (saved === 'true') {
      setIsSignedUp(true);
    }
  }, []);

  const handleSignupSuccess = () => {
    setIsSignedUp(true);
    onShowToast(t('topbar.signup_toast'));
  };

  return (
    <>
      <header
        aria-label="Top Announcement and Quick Links"
        className="w-full bg-marigold text-ink sticky top-0 z-40 transition-all duration-200 select-none border-b border-black/5"
      >
        <div className="max-w-[1200px] mx-auto px-4 py-1.5 flex items-center justify-between min-h-[36px] text-xs font-heading">
          {/* Left: Signup prompt (disappears after signup) */}
          {!isSignedUp && (
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-[11px] sm:text-xs text-ink">
                {t('topbar.signup_learn')}
              </span>
              <button
                onClick={() => setIsSignupModalOpen(true)}
                className="px-2.5 py-0.5 rounded-full bg-ink text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-ink/80 transition-transform active:scale-95 cursor-pointer"
              >
                {t('topbar.signup_btn')}
              </button>
            </div>
          )}

          {/* Right: WhatsApp + Cart */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <a
              href="https://api.whatsapp.com/send/?phone=919182968542&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/10 hover:bg-ink/15 text-ink font-semibold text-[11px] sm:text-xs transition-colors cursor-pointer"
              aria-label={t('topbar.whatsapp')}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current text-[#128C7E]" />
              <span className="hidden sm:inline">{t('topbar.whatsapp')}</span>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/10 hover:bg-ink/15 text-ink font-semibold text-[11px] sm:text-xs transition-colors cursor-pointer"
              aria-label={t('topbar.cart_count', { count: totalItems })}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t('topbar.cart')}</span>
              <span className="inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-leaf text-white text-[10px] font-bold">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileSignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSuccess={handleSignupSuccess}
      />
    </>
  );
};
