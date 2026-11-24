import React, { useState } from 'react';
import { X, Bell } from 'lucide-react';
import { BrandPattern } from './BrandPattern';

interface NotifyModalProps {
  isOpen: boolean;
  productName: string;
  onClose: () => void;
  onSuccess: (phone: string) => void;
}

export const NotifyModal: React.FC<NotifyModalProps> = ({
  isOpen,
  productName,
  onClose,
  onSuccess,
}) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const validateIndianMobile = (num: string): boolean => {
    return /^[6-9]\d{9}$/.test(num.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!validateIndianMobile(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setError('');
    setIsSubmitted(true);

    setTimeout(() => {
      onSuccess(cleanPhone);
      onClose();
      setIsSubmitted(false);
      setPhone('');
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notify-modal-title"
    >
      <div
        className="relative w-full max-w-md bg-cream text-ink rounded-[24px] p-6 sm:p-8 shadow-2xl border border-ink/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-6 -right-6 text-olive/10 pointer-events-none">
          <BrandPattern variant="subtle" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-ink-60 hover:text-ink hover:bg-black/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-sky-light flex items-center justify-center mb-4 text-ink">
            <Bell className="w-6 h-6 text-ink" />
          </div>

          <h3
            id="notify-modal-title"
            className="font-heading font-bold text-2xl uppercase tracking-wide text-ink"
          >
            Notify When Available
          </h3>
          <p className="mt-2 text-sm text-ink-60 font-body">
            <strong>{productName}</strong> is currently sold out. Leave your WhatsApp number to be
            alerted immediately when new manufacturing batches are released.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="notify-mobile-input"
                className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
              >
                Mobile Number
              </label>
              <div className="flex rounded-full border border-ink-40/60 overflow-hidden bg-white focus-within:border-leaf focus-within:ring-2 focus-within:ring-leaf/20 transition-all">
                <span className="px-3.5 py-3 bg-sand text-ink-60 text-sm font-semibold border-r border-ink-40/40 select-none flex items-center">
                  +91
                </span>
                <input
                  id="notify-mobile-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="98765 43210"
                  className="flex-1 px-4 py-3 text-sm text-ink outline-hidden bg-transparent font-medium"
                  autoFocus
                />
              </div>
              {error && <p className="mt-1.5 text-xs text-chilli font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitted}
              className="w-full py-3.5 px-6 rounded-full bg-leaf text-white font-heading font-semibold text-sm uppercase tracking-wider hover:bg-leaf/90 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitted ? 'Saving...' : 'Notify Me'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
