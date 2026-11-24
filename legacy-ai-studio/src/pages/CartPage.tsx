import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, MapPin, ShoppingBag } from 'lucide-react';
import { BrandPattern } from '../components/BrandPattern';
import { track } from '../lib/track';
import { lookupPincode } from '../data/mock';
import { useLanguage } from '../context/LanguageContext';

export const CartPage: React.FC = () => {
  const { t } = useLanguage();
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  useEffect(() => {
    track('view_cart', {
      value: subtotal,
      currency: 'INR',
      items: items.map((i) => ({
        item_id: i.product.id,
        item_name: i.product.name,
        price: i.product.price || 0,
        quantity: i.quantity,
      })),
    });
    // Record the cart as it was when the page opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.replace(/\D/g, '');
    if (clean.length === 6) {
      const info = lookupPincode(clean);
      if (info.serviceable) {
        setPincodeResult(
          `Delivery available for ${info.city}, ${info.state}: Estimated delivery in ${info.estimateDays}.`,
        );
      } else {
        setPincodeResult("We don't deliver here yet. Chat on WhatsApp and we'll find a way.");
      }
      track('pincode_check', {
        pincode: clean,
        serviceable: info.serviceable,
      });
    } else {
      setPincodeResult('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full bg-cream min-h-[60vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-[24px] p-8 text-center border border-ink/10 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 text-olive/10 pointer-events-none">
            <BrandPattern variant="subtle" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center text-ink-40 mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-ink">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-ink-60 font-body">
              Explore our passive evaporative cooling crates designed for fresh Indian produce.
            </p>

            <a
              href="#/products/coldeasy-box"
              className="mt-6 py-3.5 px-8 rounded-full bg-leaf text-white font-heading font-semibold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all shadow-xs"
            >
              Shop ColdEasy
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-cream py-10 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl uppercase tracking-wider text-ink mb-8">
          Shopping Cart ({totalItems})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Items) */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="p-5 sm:p-6 rounded-[24px] bg-white border border-ink/10 shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                {/* Thumbnail & Info */}
                <div className="flex gap-4 items-center min-w-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-sand overflow-hidden shrink-0 flex items-center justify-center">
                    {item.product.images.main.url ? (
                      <img
                        src={item.product.images.main.url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImagePlaceholder
                        label={item.product.name}
                        className="w-full h-full p-2 text-[9px]"
                        aspectRatio="aspect-square"
                      />
                    )}
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-base text-ink truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-ink-60 font-body line-clamp-1">
                      {t(`product.desc.${item.product.id}`)}
                    </p>
                    <div className="mt-1 font-heading font-bold text-sm text-leaf">
                      {item.product.price !== null
                        ? `₹${item.product.price.toLocaleString('en-IN')}`
                        : '—'}
                    </div>
                  </div>
                </div>

                {/* Stepper, Total & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-ink/5">
                  <div className="flex items-center border border-ink-40/50 rounded-full bg-sand/30 px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 text-ink hover:text-leaf transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-heading font-bold text-ink">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 text-ink hover:text-leaf transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                      disabled={item.quantity >= 10}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-heading font-bold text-base text-ink min-w-[80px] text-right">
                    {item.product.price !== null
                      ? `₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`
                      : '—'}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-ink-40 hover:text-chilli transition-colors cursor-pointer"
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Pincode Availability Checker */}
            <div className="p-6 rounded-[24px] bg-white border border-ink/10 shadow-xs mt-6">
              <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-ink mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky" />
                Check Delivery Availability
              </h4>
              <p className="text-xs text-ink-60 mb-4 font-body">
                Enter your 6-digit postal code to check road transport routes to your mandi or farm.
              </p>

              <form onSubmit={handleCheckPincode} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN code"
                  className="flex-1 px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-full bg-sand hover:bg-sand/80 text-ink font-heading font-semibold text-xs uppercase tracking-wider cursor-pointer border border-ink/10"
                >
                  Check
                </button>
              </form>

              {pincodeResult && (
                <div className="mt-3 p-3 rounded-xl bg-sand/60 border border-ink/5 text-xs text-ink font-medium">
                  {pincodeResult}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Order Summary Card) */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-[24px] bg-white border border-ink/10 shadow-md space-y-6">
              <h3 className="font-heading font-bold text-lg uppercase tracking-wider text-ink pb-4 border-b border-ink/10">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm font-body">
                <div className="flex items-center justify-between text-ink-60">
                  <span>Subtotal</span>
                  <span className="font-heading font-bold text-ink">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-ink-60">
                  <span>Shipping</span>
                  <span className="text-xs text-ink-60">Calculated at checkout</span>
                </div>

                <div className="pt-3 border-t border-ink/10 flex items-center justify-between">
                  <span className="font-heading font-bold text-base text-ink">Total</span>
                  <span className="font-heading font-extrabold text-2xl text-ink">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <p className="text-xs text-ink-40 text-center font-body">
                Shipping and taxes calculated at checkout
              </p>

              <button
                onClick={() => {
                  window.location.hash = '#/checkout';
                }}
                className="w-full py-4 px-6 rounded-full bg-leaf text-white font-heading font-bold text-sm uppercase tracking-wider hover:bg-leaf/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Proceed to checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-ink-60 font-body">
                <ShieldCheck className="w-4 h-4 text-leaf" />
                <span>Secure SSL checkout preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
