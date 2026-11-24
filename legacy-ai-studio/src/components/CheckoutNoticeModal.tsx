import React from 'react';
import { X, ShieldAlert, MessageCircle } from 'lucide-react';

interface CheckoutNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutNoticeModal: React.FC<CheckoutNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-notice-title"
    >
      <div
        className="relative w-full max-w-md bg-cream text-ink rounded-[24px] p-6 sm:p-8 shadow-2xl border border-ink/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-ink-60 hover:text-ink hover:bg-black/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-sky-light flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6 text-ink" />
        </div>

        <h3
          id="checkout-notice-title"
          className="font-heading font-bold text-xl uppercase tracking-wide text-ink"
        >
          Prototype Notice
        </h3>

        <div className="mt-4 p-4 rounded-2xl bg-white border border-ink/10">
          <p className="text-sm font-medium text-ink leading-relaxed">
            Checkout and Razorpay payments are not connected in this prototype.
          </p>
        </div>

        <p className="mt-4 text-xs text-ink-60 leading-relaxed">
          This is an interactive visual and layout preview of ColdEasy. For actual product
          inquiries, wholesale crates, or distributor bookings, connect directly with the ColdEasy
          team on WhatsApp.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <a
            href="https://wa.me/919182968542"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-5 rounded-full bg-leaf text-white font-heading font-semibold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Connect on WhatsApp
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-5 rounded-full border border-ink-40 text-ink font-heading font-medium text-xs uppercase tracking-wider hover:bg-sand transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
