import React, { useState } from 'react';
import { waLink, handleWaClick } from '../lib/wa';
import { Check, Copy, CheckCircle2, Truck, Play, MessageCircle, ShoppingBag } from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId }) => {
  const [copied, setCopied] = useState(false);

  // Retrieve saved order details from localStorage
  const orderData = (() => {
    try {
      const saved = localStorage.getItem('ce_orders');
      if (saved) {
        const list = JSON.parse(saved);
        return list.find((o: { orderId: string }) => o.orderId === orderId) || list[0];
      }
    } catch {
      // ignore
    }
    return null;
  })();

  const customerName = orderData?.delivery?.fullName || 'Valued Grower';
  const customerMobile = orderData?.contact?.mobile || '9876543210';
  const customerAddress = orderData?.delivery
    ? `${orderData.delivery.addressLine1}, ${orderData.delivery.city}, ${orderData.delivery.state} - ${orderData.delivery.pincode}`
    : 'Local Mandi Hub, India';
  const totalPaid = orderData?.total || 3990;

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const timelineSteps = [
    {
      label: 'Order confirmed',
      detail: 'Received & logged into assembly queue',
      done: true,
      current: false,
    },
    { label: 'Packed', detail: 'SEEC pad & crate unit inspected', done: false, current: true },
    {
      label: 'Dispatched',
      detail: 'Handed to regional freight logistics',
      done: false,
      current: false,
    },
    {
      label: 'Out for delivery',
      detail: 'Scheduled for farm gate or mandi drop',
      done: false,
      current: false,
    },
    { label: 'Delivered', detail: 'Produce preservation operational', done: false, current: false },
  ];

  return (
    <div className="w-full bg-cream py-10 md:py-16">
      <div className="max-w-[850px] mx-auto px-4 sm:px-6">
        {/* Soft confetti-free success mark */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-leaf text-white flex items-center justify-center mx-auto shadow-md">
            <Check className="w-9 h-9 stroke-[3]" />
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl uppercase tracking-tight text-ink">
            Order confirmed
          </h1>

          <p className="text-xs sm:text-sm text-ink-60 font-body max-w-md mx-auto">
            Thank you for choosing ColdEasy. Your evaporative cooling equipment order has been
            registered.
          </p>

          {/* Order ID with Copy Button */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-ink/10 shadow-2xs font-heading font-bold text-xs sm:text-sm text-ink">
            <span>Order ID: {orderId}</span>
            <button
              onClick={handleCopyOrderId}
              className="p-1.5 rounded-full hover:bg-sand text-ink-60 hover:text-ink transition-colors cursor-pointer"
              aria-label="Copy Order ID"
              title="Copy Order ID"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-leaf" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="text-ink-60">Estimated Delivery:</span>
            <span className="font-heading font-bold text-leaf bg-leaf-light px-2.5 py-0.5 rounded-full">
              3–5 business days to mandi hub
            </span>
          </div>
        </div>

        {/* Order Details Summary Card */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-ink/10 shadow-sm space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-ink/10">
            <div>
              <span className="text-xs text-ink-40 font-heading font-bold uppercase block">
                Deliver to
              </span>
              <h4 className="font-heading font-bold text-sm text-ink mt-0.5">
                {customerName} (+91 {customerMobile})
              </h4>
              <p className="text-xs text-ink-60 mt-0.5 max-w-md">{customerAddress}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-ink-40 font-heading font-bold uppercase block">
                Total Paid
              </span>
              <span className="font-heading font-extrabold text-xl text-ink mt-0.5 block">
                ₹{totalPaid.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-leaf font-semibold">Payment Confirmed</span>
            </div>
          </div>

          {/* Line items if available */}
          {orderData?.items && orderData.items.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs text-ink-40 font-heading font-bold uppercase block">
                Ordered Items
              </span>
              {orderData.items.map(
                (
                  it: { product: { name: string; price: number | null }; quantity: number },
                  idx: number,
                ) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1">
                    <span>
                      {it.product.name} × {it.quantity}
                    </span>
                    <span className="font-semibold text-ink">
                      {it.product.price
                        ? `₹${(it.product.price * it.quantity).toLocaleString('en-IN')}`
                        : '—'}
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        {/* What Happens Next Timeline */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-ink/10 shadow-sm mb-8">
          <h3 className="font-heading font-bold text-base uppercase tracking-wider text-ink mb-6">
            What Happens Next
          </h3>

          <div className="relative pl-6 space-y-6">
            {/* Multi-colour or brand timeline bar */}
            <div className="absolute top-2 bottom-2 left-2.5 w-1 bg-ink/15 rounded-full" />

            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative pl-4 flex items-start gap-3">
                <div
                  className={`absolute -left-[14px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step.done
                      ? 'bg-leaf text-white'
                      : step.current
                        ? 'bg-marigold text-ink ring-4 ring-marigold/20'
                        : 'bg-sand text-ink-40 border border-ink/20'
                  }`}
                >
                  {step.done ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                </div>

                <div>
                  <h5 className="font-heading font-bold text-xs uppercase text-ink">
                    {step.label}
                  </h5>
                  <p className="text-xs text-ink-60 mt-0.5 font-body">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Message Preview Card (Prompt 3.3 Item 3) */}
        <div className="bg-sand/60 rounded-[28px] p-6 sm:p-8 border border-ink/10 shadow-xs mb-8">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-leaf" />
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-ink">
              WhatsApp Order Updates
            </h4>
          </div>

          {/* Phone-chat-style bubble */}
          <div className="bg-[#E7FFDB] p-4 rounded-2xl rounded-tl-xs border border-leaf/20 text-xs text-ink max-w-md shadow-2xs font-body space-y-2">
            <p className="font-semibold text-leaf">ColdEasy Official Desk</p>
            <p>
              Hi {customerName}, your ColdEasy order <strong>{orderId}</strong> is confirmed!
            </p>
            <p className="text-ink-60 text-[11px]">
              We are packaging your cooling units. You will receive live transport alerts and driver
              contact details here on WhatsApp as soon as freight dispatches.
            </p>
            <div className="text-right text-[10px] text-ink-40 pt-1">Just now • Delivered ✓✓</div>
          </div>

          <p className="mt-3 text-[11px] text-ink-40 italic">
            Preview of WhatsApp update (not sent)
          </p>
        </div>

        {/* "Using your ColdEasy Box" Quick Tips & Setup Video */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-ink/10 shadow-sm space-y-6 mb-8">
          <h3 className="font-heading font-bold text-base uppercase tracking-wider text-ink">
            Using your ColdEasy Box
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-sand/60 border border-ink/5">
              <span className="w-6 h-6 rounded-full bg-sky text-ink font-bold font-heading text-xs flex items-center justify-center mb-2">
                1
              </span>
              <h5 className="font-heading font-bold text-xs uppercase text-ink">Fill Tap Water</h5>
              <p className="text-[11px] text-ink-60 mt-1">
                Fill the tank with regular room-temperature tap water every morning.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sand/60 border border-ink/5">
              <span className="w-6 h-6 rounded-full bg-marigold text-ink font-bold font-heading text-xs flex items-center justify-center mb-2">
                2
              </span>
              <h5 className="font-heading font-bold text-xs uppercase text-ink">Shade & Airflow</h5>
              <p className="text-[11px] text-ink-60 mt-1">
                Place crate in shade where natural cross-breezes flow through the louvers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sand/60 border border-ink/5">
              <span className="w-6 h-6 rounded-full bg-leaf text-white font-bold font-heading text-xs flex items-center justify-center mb-2">
                3
              </span>
              <h5 className="font-heading font-bold text-xs uppercase text-ink">Produce Only</h5>
              <p className="text-[11px] text-ink-60 mt-1">
                Best for fruit, vegetables and flowers. Not designed for meat, fish or dairy.
              </p>
            </div>
          </div>

          {/* "Watch setup video" placeholder tile */}
          <div className="relative aspect-[21/9] sm:aspect-[24/8] rounded-[22px] bg-sand border border-ink/10 overflow-hidden flex flex-col items-center justify-center p-4 text-center cursor-pointer group hover:border-leaf transition-all">
            <div className="w-12 h-12 rounded-full bg-leaf text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform mb-2">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-ink">
              Watch setup video
            </span>
            <span className="text-[10px] text-ink-40 mt-0.5">
              2-minute guide to unpacking and filling water
            </span>
          </div>
        </div>

        {/* Action Buttons: Track order, Continue shopping, Chat on WhatsApp */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`#/track?orderId=${orderId}`}
            className="w-full sm:w-auto py-3.5 px-7 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Truck className="w-4 h-4" />
            Track order
          </a>

          <a
            href="#/products"
            className="w-full sm:w-auto py-3.5 px-7 rounded-full border-2 border-ink text-ink font-heading font-bold text-xs uppercase tracking-wider hover:bg-sand transition-all flex items-center justify-center gap-2 text-center"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue shopping
          </a>

          <a
            href={waLink({ type: 'checkout', summary: `Order ${orderId}` })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleWaClick({ type: 'checkout', summary: `Order ${orderId}` })}
            className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-sand text-ink font-heading font-bold text-xs uppercase tracking-wider hover:bg-sand/80 transition-all border border-ink/10 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-leaf" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
