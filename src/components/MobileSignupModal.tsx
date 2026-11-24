import React, { useState } from 'react';
import { X, Smartphone } from 'lucide-react';
import { BrandPattern } from './BrandPattern';
import { track } from '../lib/track';

interface MobileSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MobileSignupModal: React.FC<MobileSignupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [role, setRole] = useState<'Farmer' | 'Vendor' | 'FPO' | 'Business' | 'Other'>('Farmer');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!consent) {
      setError('Please agree to receive updates to proceed.');
      return;
    }

    if (pincode && !/^\d{6}$/.test(pincode.trim())) {
      setError('PIN code must be 6 digits if provided.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const signupData = {
        mobile: cleanPhone,
        pincode: pincode.trim(),
        role,
        page: window.location.hash || '#/',
        timestamp: new Date().toISOString(),
      };

      try {
        localStorage.setItem('coldeasy_signed_up', 'true');
        localStorage.setItem('coldeasy_user_phone', cleanPhone);
        localStorage.setItem('ce_signup', JSON.stringify(signupData));
      } catch {
        // ignore storage error
      }

      track('sign_up', {
        method: 'whatsapp_mobile',
        role,
      });

      onSuccess();
      onClose();
    }, 400);
  };

  const roles: ('Farmer' | 'Vendor' | 'FPO' | 'Business' | 'Other')[] = [
    'Farmer',
    'Vendor',
    'FPO',
    'Business',
    'Other',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-cream text-ink rounded-[24px] p-6 sm:p-8 shadow-2xl border border-ink/10 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Low contrast brand pattern in corner */}
        <div className="absolute -top-6 -right-6 text-olive/10 pointer-events-none">
          <BrandPattern variant="subtle" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-ink-60 hover:text-ink hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-marigold-light flex items-center justify-center mb-4 text-marigold">
            <Smartphone className="w-6 h-6 text-ink" />
          </div>

          <h3
            id="signup-modal-title"
            className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-wide text-ink"
          >
            Stay Fresh with ColdEasy
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-ink-60 font-body">
            Get product updates, seasonal cooling tips and batch delivery alerts directly on
            WhatsApp.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Mobile Number */}
            <div>
              <label
                htmlFor="mobile-input"
                className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
              >
                Mobile Number *
              </label>
              <div className="flex rounded-full border border-ink-40/60 overflow-hidden bg-white min-h-[44px]">
                <span className="px-3.5 py-2.5 bg-sand text-ink-60 text-xs font-semibold border-r border-ink-40/40 select-none flex items-center">
                  +91
                </span>
                <input
                  id="mobile-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="98765 43210"
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm text-ink outline-hidden bg-transparent font-medium"
                  autoFocus
                />
              </div>
            </div>

            {/* Optional "I am a" chip selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                I am a (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      role === r
                        ? 'bg-leaf text-white font-semibold'
                        : 'bg-white text-ink border border-ink/10 hover:bg-sand'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Pincode */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                PIN Code (Optional)
              </label>
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 560001"
                className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden bg-white"
              />
            </div>

            {/* Required Consent Checkbox */}
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (error) setError('');
                }}
                className="w-4 h-4 accent-leaf rounded mt-0.5"
              />
              <span className="text-[11px] text-ink-60 leading-tight">
                I agree to receive updates from ColdEasy on WhatsApp and SMS. I can opt out anytime.{' '}
                <a href="#/privacy" className="text-leaf underline" onClick={onClose}>
                  Privacy Policy
                </a>
              </span>
            </label>

            {error && <p className="text-xs text-chilli font-medium">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[44px] py-3 px-6 rounded-full bg-leaf text-white font-heading font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-leaf/90 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isSubmitting ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
