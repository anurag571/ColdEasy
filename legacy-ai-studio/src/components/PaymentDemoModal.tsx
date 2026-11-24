import React, { useState } from 'react';
import { ShieldCheck, X, Check, ArrowRight } from 'lucide-react';

interface PaymentDemoModalProps {
  isOpen: boolean;
  totalAmount: number;
  onSimulateSuccess: () => void;
  onSimulateFailure: () => void;
  onClose: () => void;
}

export const PaymentDemoModal: React.FC<PaymentDemoModalProps> = ({
  isOpen,
  totalAmount,
  onSimulateSuccess,
  onSimulateFailure,
  onClose,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'emi' | 'netbanking'>(
    'upi',
  );

  if (!isOpen) return null;

  const paymentMethods = [
    { id: 'upi', label: 'UPI (Google Pay, PhonePe, Paytm, BHIM)', tag: 'Fast & Instant' },
    { id: 'card', label: 'Credit / Debit Cards (Visa, Mastercard, RuPay)', tag: 'All Banks' },
    { id: 'emi', label: 'EMI on Cards (Credit Card & Selected Debit Cards)', tag: 'Low Interest' },
    { id: 'netbanking', label: 'Netbanking (50+ Indian Banks)', tag: 'Direct Debit' },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-heading"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white text-ink rounded-[28px] overflow-hidden shadow-2xl border border-ink/10 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chilli Banner at top */}
        <div className="bg-chilli text-white py-2 px-4 text-center font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">
          PAYMENT DEMO, NO MONEY WILL BE TAKEN
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-ink/10">
            <div>
              <span className="text-[11px] font-heading font-bold uppercase text-ink-40">
                Mock Payment Gateway
              </span>
              <h3
                id="payment-modal-heading"
                className="font-heading font-extrabold text-xl text-ink"
              >
                ₹{totalAmount.toLocaleString('en-IN')}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-ink-60 hover:text-ink hover:bg-sand transition-colors cursor-pointer"
              aria-label="Close payment demo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-3 text-xs text-ink-60 font-body">
            Choose a mock payment method to test checkout flows:
          </p>

          {/* Large tappable method rows: labels only, NO input fields */}
          <div className="mt-4 space-y-2.5">
            {paymentMethods.map((m) => {
              const isSelected = selectedMethod === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between min-h-[50px] ${
                    isSelected
                      ? 'border-leaf bg-leaf-light/30 shadow-2xs'
                      : 'border-ink/10 hover:border-ink/30 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected ? 'border-leaf bg-leaf text-white' : 'border-ink-40 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="font-heading font-semibold text-xs text-ink block">
                        {m.label}
                      </span>
                      <span className="text-[10px] text-ink-40">{m.tag}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Razorpay small placeholder badge */}
          <div className="mt-5 p-2 rounded-xl bg-sand/60 text-center flex items-center justify-center gap-2 text-ink-60 text-[11px] font-heading font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-sky" />
            <span>Secured by Razorpay (Placeholder Badge)</span>
          </div>

          {/* Two Action Buttons: Simulate success (leaf) & Simulate failure (outline chilli) */}
          <div className="mt-6 space-y-2.5">
            <button
              onClick={onSimulateSuccess}
              className="w-full min-h-[44px] py-3.5 px-6 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              Simulate success
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onSimulateFailure}
              className="w-full min-h-[44px] py-2.5 px-6 rounded-full border-2 border-chilli text-chilli font-heading font-bold text-xs uppercase tracking-wider hover:bg-chilli-light/40 transition-all text-center cursor-pointer"
            >
              Simulate failure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
