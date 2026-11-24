import React, { useState, useEffect } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { waLink, handleWaClick } from '../lib/wa';
import { Search, Check, MessageCircle, HelpCircle } from 'lucide-react';

interface StoredOrder {
  orderId: string;
  createdAt?: string;
  contact?: { mobile?: string };
  delivery?: { city?: string; state?: string; pincode?: string };
}

export const TrackOrderPage: React.FC = () => {
  // Query param auto-fill
  const [orderIdInput, setOrderIdInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    const rawHash = window.location.hash || '';
    const [, queryPart] = rawHash.split('?');
    const params = new URLSearchParams(queryPart || '');
    const prefillId = params.get('orderId');

    if (prefillId) {
      setOrderIdInput(prefillId);
      performSearch(prefillId, '');
    }
  }, []);

  const performSearch = (targetOrderId: string, targetMobile: string) => {
    setSearched(true);
    try {
      const saved = localStorage.getItem('ce_orders');
      if (saved) {
        const list = JSON.parse(saved) as StoredOrder[];
        const match = list.find((o) => {
          const matchId = targetOrderId
            ? o.orderId.toLowerCase().trim() === targetOrderId.toLowerCase().trim()
            : false;
          const cleanMob = targetMobile.replace(/\D/g, '');
          const matchMob = cleanMob ? o.contact?.mobile === cleanMob : false;
          return matchId || matchMob;
        });

        if (match) {
          setFoundOrder(match);
          return;
        }
      }
    } catch {
      // ignore
    }
    setFoundOrder(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(orderIdInput, mobileInput);
  };

  // Dynamic step advancement: advances 1 step for every 1 minute since order was placed!
  const getProgressStep = (createdAtIso?: string): number => {
    if (!createdAtIso) return 1; // default 'Packed'
    const created = new Date(createdAtIso).getTime();
    const now = Date.now();
    const minutesPassed = Math.floor((now - created) / 60000);

    // 0 min = step 0 (Order confirmed)
    // 1 min = step 1 (Packed)
    // 2 min = step 2 (Dispatched)
    // 3 min = step 3 (Out for delivery)
    // 4+ min = step 4 (Delivered)
    return Math.min(4, Math.max(0, minutesPassed));
  };

  const activeStepIdx = foundOrder ? getProgressStep(foundOrder.createdAt) : 1;

  const trackingSteps = [
    { label: 'Order Confirmed', time: 'Logged in system' },
    { label: 'Packed & Inspected', time: 'SEEC pad tested' },
    { label: 'Dispatched from Hub', time: 'Freight transport in transit' },
    { label: 'Out for Local Delivery', time: 'Van scheduled to destination' },
    { label: 'Delivered', time: 'Produce cooling active' },
  ];

  return (
    <div className="w-full bg-cream py-10 md:py-16">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <SectionHeading
          title="TRACK YOUR ORDER"
          subtitle="Real-time freight and dispatch movement across regional agricultural hubs."
          isCentered
        />

        {/* Tracking Search Form */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-ink/10 shadow-sm mb-8">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-ink mb-1.5">
                  Order ID
                </label>
                <input
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="e.g. CE-2026-AB12C"
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-ink mb-1.5">
                  Mobile Number (+91)
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] py-3 px-6 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Search className="w-4 h-4" />
              Check Status
            </button>
          </form>
        </div>

        {/* Search Results */}
        {searched && (
          <div>
            {foundOrder ? (
              /* Found Order Timeline & Status */
              <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-ink/10 shadow-sm space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-ink/10">
                  <div>
                    <span className="text-xs text-ink-40 font-heading font-bold uppercase">
                      Tracking Order
                    </span>
                    <h3 className="font-heading font-extrabold text-lg text-ink">
                      {foundOrder.orderId}
                    </h3>
                    <p className="text-xs text-ink-60">
                      Destination: {foundOrder.delivery?.city}, {foundOrder.delivery?.state} (
                      {foundOrder.delivery?.pincode})
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-ink-40 font-heading font-bold uppercase block">
                      Estimated Delivery
                    </span>
                    <span className="inline-block mt-1 font-heading font-bold text-xs text-leaf bg-leaf-light px-2.5 py-0.5 rounded-full">
                      3–5 business days
                    </span>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="relative pl-6 space-y-6 pt-2">
                  <div className="absolute top-2 bottom-2 left-2.5 w-1 bg-ink/15 rounded-full" />

                  {trackingSteps.map((step, idx) => {
                    const isDone = idx < activeStepIdx;
                    const isCurrent = idx === activeStepIdx;

                    return (
                      <div key={idx} className="relative pl-4 flex items-start gap-3">
                        <div
                          className={`absolute -left-[14px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isDone
                              ? 'bg-leaf text-white'
                              : isCurrent
                                ? 'bg-marigold text-ink ring-4 ring-marigold/20 animate-pulse'
                                : 'bg-sand text-ink-40 border border-ink/20'
                          }`}
                        >
                          {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-heading font-bold text-xs uppercase text-ink">
                              {step.label}
                            </h5>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-marigold text-ink text-[10px] font-heading font-bold uppercase">
                                Current Status
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-ink-60 mt-0.5 font-body">{step.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-ink/10 flex items-center justify-between text-xs text-ink-60">
                  <span>Demo simulation: status advances 1 step each minute.</span>
                  <a
                    href={waLink({
                      type: 'checkout',
                      summary: `Tracking Order ${foundOrder.orderId}`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-leaf font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Help on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              /* Friendly Not-Found Message with WhatsApp Link */
              <div className="bg-white rounded-[28px] p-8 border border-ink/10 shadow-sm text-center space-y-4 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-sand text-ink-40 flex items-center justify-center mx-auto">
                  <HelpCircle className="w-6 h-6" />
                </div>

                <h3 className="font-heading font-bold text-lg uppercase text-ink">
                  No matching order found
                </h3>

                <p className="text-xs sm:text-sm text-ink-60 font-body max-w-md mx-auto leading-relaxed">
                  We couldn&apos;t locate an order with the provided ID or mobile number. If you
                  placed an order earlier or booked crates through your local FPO or dealer, message
                  our dispatch coordinator directly.
                </p>

                <div className="pt-3">
                  <a
                    href={waLink({ type: 'home' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleWaClick({ type: 'home' })}
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    Connect on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
