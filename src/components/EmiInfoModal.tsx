import React from 'react';
import { X, CreditCard } from 'lucide-react';

interface EmiInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmiInfoModal: React.FC<EmiInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emi-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-[24px] p-6 shadow-2xl border border-ink/10 text-ink animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-ink-60 hover:text-ink hover:bg-sand transition-colors cursor-pointer"
          aria-label="Close EMI information"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-2xl bg-olive/20 flex items-center justify-center mb-4 text-ink">
          <CreditCard className="w-5 h-5 text-olive" />
        </div>

        <h3
          id="emi-modal-title"
          className="font-heading font-bold text-base uppercase tracking-wider text-ink"
        >
          EMI Information
        </h3>

        <div className="mt-4 p-4 rounded-2xl bg-sand/60 border border-ink/5 text-xs text-ink-60 leading-relaxed font-body">
          EMI options, banks and eligibility are shown by Razorpay at payment, and depend on your
          card or bank.
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-5 rounded-full bg-sand hover:bg-sand/80 text-ink font-heading font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
