import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Logo } from '../components/Logo';
import { PlaceholderPill } from '../components/PlaceholderPill';
import { PaymentDemoModal } from '../components/PaymentDemoModal';
import {
  lookupPincode,
  FREE_SHIPPING_THRESHOLD,
  EMI_THRESHOLD,
  INDIAN_STATES_AND_UTS,
} from '../data/mock';
import { track } from '../lib/track';
import { waLink, handleWaClick } from '../lib/wa';
import { useLanguage } from '../context/LanguageContext';
import {
  Lock,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  ShieldCheck,
  AlertCircle,
  MessageCircle,
  Phone,
  RefreshCw,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { t } = useLanguage();
  const { items, subtotal, totalItems, clearCart } = useCart();

  // Empty-cart guard
  useEffect(() => {
    if (items.length === 0) {
      window.location.hash = '#/cart';
    } else {
      track('begin_checkout', {
        items: items.map((i) => ({
          item_id: i.product.id,
          item_name: i.product.name,
          price: i.product.price || 0,
          quantity: i.quantity,
        })),
        value: subtotal,
        currency: 'INR',
      });
    }
  }, [items, subtotal]);

  // Steps accordion: 1 = Contact, 2 = Delivery, 3 = Review
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // Step 1: Contact
  const [mobile, setMobile] = useState(() => {
    return localStorage.getItem('coldeasy_user_phone') || '';
  });
  const [email, setEmail] = useState('');
  const [sendWhatsAppUpdates, setSendWhatsAppUpdates] = useState(true);
  const [contactError, setContactError] = useState('');

  // Step 2: Delivery
  const [fullName, setFullName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [deliveryEstimate, setDeliveryEstimate] = useState('3–5 days');
  const [isServiceable, setIsServiceable] = useState(true);
  const [deliveryError, setDeliveryError] = useState('');

  // GSTIN Toggle
  const [hasGstin, setHasGstin] = useState(false);
  const [gstin, setGstin] = useState('');
  const [gstinError, setGstinError] = useState('');

  // Payment Demo Sheet & Failure State
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  // Auto-fill city/state upon entering 6 digits
  useEffect(() => {
    const cleanPin = pincode.replace(/\D/g, '');
    if (cleanPin.length === 6) {
      const info = lookupPincode(cleanPin);
      setCity(info.city);
      setState(info.state);
      setIsServiceable(info.serviceable);
      setDeliveryEstimate(info.estimateDays);

      track('pincode_check', {
        pincode: cleanPin,
        serviceable: info.serviceable,
      });
    }
  }, [pincode]);

  const validateGstin = (code: string) => {
    // 15 chars standard Indian GSTIN regex
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
      code.trim().toUpperCase(),
    );
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = mobile.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(clean)) {
      setContactError('checkout.err.mobile');
      return;
    }
    setContactError('');
    setActiveStep(2);
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !addressLine1.trim()) {
      setDeliveryError('checkout.err.name');
      return;
    }
    const cleanPin = pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setDeliveryError('checkout.err.pin');
      return;
    }
    if (!isServiceable) {
      setDeliveryError('checkout.err.unserviceable');
      return;
    }
    if (hasGstin && gstin) {
      if (!validateGstin(gstin)) {
        setGstinError('checkout.err.gstin');
        return;
      }
    }
    setDeliveryError('');
    setGstinError('');

    track('add_shipping_info', {
      value: subtotal,
      currency: 'INR',
      items: items.map((i) => ({
        item_id: i.product.id,
        item_name: i.product.name,
        price: i.product.price || 0,
        quantity: i.quantity,
      })),
    });

    setActiveStep(3);
  };

  // Calculations
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingAmount = isFreeShipping ? 0 : 250;
  const totalAmount = subtotal + shippingAmount;
  const isEmiAvailable = totalAmount >= EMI_THRESHOLD;

  const handleInitiatePayment = () => {
    track('add_payment_info', {
      value: totalAmount,
      currency: 'INR',
    });
    setIsPaymentSheetOpen(true);
  };

  const handleSimulateSuccess = () => {
    setIsPaymentSheetOpen(false);

    // Mock Order ID generation (e.g. CE-2026-XXXXX)
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderId = `CE-2026-${randomCode}`;

    const orderRecord = {
      orderId,
      items,
      subtotal,
      shipping: isFreeShipping ? 'Free' : '₹250',
      total: totalAmount,
      contact: {
        mobile,
        email,
        sendWhatsAppUpdates,
      },
      delivery: {
        fullName,
        addressLine1,
        addressLine2,
        landmark,
        pincode,
        city,
        state,
        gstin: hasGstin ? gstin.toUpperCase() : undefined,
      },
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem('ce_orders');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(orderRecord);
      localStorage.setItem('ce_orders', JSON.stringify(list));
    } catch {
      // storage unavailable
    }

    track('purchase', {
      item_id: orderId,
      value: totalAmount,
      currency: 'INR',
      items: items.map((i) => ({
        item_id: i.product.id,
        item_name: i.product.name,
        price: i.product.price || 0,
        quantity: i.quantity,
      })),
    });

    // Clear cart and route to order confirmation
    clearCart();
    window.location.hash = `#/order/${orderId}`;
  };

  const handleSimulateFailure = () => {
    setIsPaymentSheetOpen(false);
    setPaymentFailed(true);
    track('payment_failed', {
      value: totalAmount,
      currency: 'INR',
    });
  };

  const stepColors = ['bg-sky', 'bg-marigold', 'bg-chilli', 'bg-leaf'];

  const orderSummaryText =
    items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ') +
    ` (Total ₹${totalAmount.toLocaleString('en-IN')})`;

  return (
    <div className="min-h-screen bg-cream text-ink font-body">
      {/* 1. Minimal Checkout Header */}
      <header className="w-full bg-white border-b border-ink/10 py-3.5 px-4 sm:px-8 sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <a href="#/" aria-label="ColdEasy Home">
            <Logo variant="horizontal-color" height={34} />
          </a>

          <div className="flex items-center gap-2 text-xs font-heading font-semibold uppercase tracking-wider text-leaf">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">{t('checkout.secure')}</span>
          </div>

          <a
            href="#/cart"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-ink-60 hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('checkout.back')}</span>
          </a>
        </div>
      </header>

      {/* Mobile Collapsible "Order summary (₹total)" Bar at top */}
      <div className="lg:hidden bg-sand border-b border-ink/10">
        <button
          onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-heading font-bold text-ink cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span>{t('checkout.summary', { amount: totalAmount.toLocaleString('en-IN') })}</span>
            {isMobileSummaryOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          <span className="text-leaf">
            {totalItems} {totalItems === 1 ? t('checkout.item') : t('checkout.items')}
          </span>
        </button>

        {isMobileSummaryOpen && (
          <div className="px-4 pb-4 pt-1 space-y-3 border-t border-ink/5 bg-sand/80 text-xs">
            {items.map((it) => (
              <div key={it.product.id} className="flex justify-between items-center">
                <span>
                  {it.product.name} × {it.quantity}
                </span>
                <span className="font-heading font-semibold">
                  {it.product.price !== null
                    ? `₹${(it.product.price * it.quantity).toLocaleString('en-IN')}`
                    : '—'}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-ink/10 flex justify-between">
              <span className="text-ink-60">{t('checkout.shipping')}</span>
              <span className="font-semibold text-leaf">{isFreeShipping ? t('checkout.free') : '₹250'}</span>
            </div>
            {isEmiAvailable && (
              <div className="p-2 rounded-xl bg-white text-olive text-[11px] font-medium text-center">
                EMI available at payment
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        {paymentFailed ? (
          /* Payment Failure Screen (Prompt 3.2 Item 2) */
          <div className="max-w-md mx-auto bg-white rounded-[28px] p-6 sm:p-8 border border-chilli/20 shadow-lg text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-chilli-light text-chilli flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-chilli" />
            </div>

            <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-ink">
              {t('checkout.failed')}
            </h2>

            <p className="text-sm text-ink-60 font-body leading-relaxed">
              {t('checkout.failed_body')}
            </p>

            <div className="pt-4 space-y-3">
              <button
                onClick={() => {
                  setPaymentFailed(false);
                  setIsPaymentSheetOpen(true);
                }}
                className="w-full min-h-[44px] py-3.5 px-6 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                {t('checkout.retry')}
              </button>

              <a
                href={waLink({ type: 'checkout', summary: orderSummaryText })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleWaClick({ type: 'checkout', summary: orderSummaryText })}
                className="w-full min-h-[44px] py-3 px-6 rounded-full border-2 border-ink text-ink font-heading font-bold text-xs uppercase tracking-wider hover:bg-sand transition-all flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-4 h-4 text-leaf" />
                {t('checkout.wa_pay')}
              </a>

              <a
                href="tel:+919182968542"
                className="inline-flex items-center gap-1.5 text-xs text-ink-60 hover:text-ink pt-2 font-medium"
              >
                <Phone className="w-3.5 h-3.5" />
                Need help? Call us at +91 91829 68542
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left 60% Form Accordion (Desktop 7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Progress Indicator Dots */}
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3].map((stepNum) => (
                  <div key={stepNum} className="flex items-center gap-2">
                    <div
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                        activeStep >= stepNum
                          ? stepColors[stepNum - 1]
                          : 'bg-sand border border-ink/20'
                      }`}
                    >
                      {activeStep > stepNum && (
                        <Check className="w-2.5 h-2.5 text-ink stroke-[3]" />
                      )}
                    </div>
                    {stepNum < 3 && <div className="w-8 h-0.5 bg-ink/15" />}
                  </div>
                ))}
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink-60 ml-2">
                  {t('checkout.step', { n: activeStep })}
                </span>
              </div>

              {/* STEP 1: CONTACT */}
              <div className="bg-white rounded-[24px] border border-ink/10 shadow-xs overflow-hidden">
                <div
                  onClick={() => activeStep > 1 && setActiveStep(1)}
                  className={`p-5 flex items-center justify-between cursor-pointer ${
                    activeStep === 1 ? 'border-b border-ink/10 bg-sand/30' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-sky text-ink font-heading font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-sm uppercase text-ink">
                        {t('checkout.contact')}
                      </h3>
                      {activeStep > 1 && (
                        <p className="text-xs text-ink-60 font-medium">
                          +91 {mobile} {email && `• ${email}`}
                        </p>
                      )}
                    </div>
                  </div>
                  {activeStep > 1 && (
                    <button className="text-xs font-heading font-semibold text-leaf hover:underline cursor-pointer">
                      {t('checkout.edit')}
                    </button>
                  )}
                </div>

                {activeStep === 1 && (
                  <form
                    onSubmit={handleContactSubmit}
                    className="p-5 sm:p-6 space-y-4 animate-in fade-in duration-200"
                  >
                    <div>
                      <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                        {t('checkout.mobile')}
                      </label>
                      <div className="flex rounded-full border border-ink-40/60 overflow-hidden bg-white min-h-[44px]">
                        <span className="px-3.5 py-2.5 bg-sand text-ink-60 text-xs font-semibold border-r border-ink-40/40 select-none flex items-center">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => {
                            setMobile(e.target.value);
                            if (contactError) setContactError('');
                          }}
                          placeholder="98765 43210"
                          className="flex-1 px-4 py-2.5 text-xs sm:text-sm text-ink outline-hidden font-medium"
                          autoFocus
                        />
                      </div>
                      {contactError && <p className="text-xs text-chilli mt-1">{contactError ? t(contactError) : ''}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                        {t('checkout.email')}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                      />
                    </div>

                    <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendWhatsAppUpdates}
                        onChange={(e) => setSendWhatsAppUpdates(e.target.checked)}
                        className="w-4 h-4 accent-leaf rounded"
                      />
                      <span className="text-xs text-ink font-medium">
                        {t('checkout.wa_updates')}
                      </span>
                    </label>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full min-h-[44px] py-3 px-6 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all cursor-pointer shadow-xs"
                      >
                        {t('checkout.to_delivery')}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* STEP 2: DELIVERY */}
              <div className="bg-white rounded-[24px] border border-ink/10 shadow-xs overflow-hidden">
                <div
                  onClick={() => activeStep > 2 && setActiveStep(2)}
                  className={`p-5 flex items-center justify-between cursor-pointer ${
                    activeStep === 2 ? 'border-b border-ink/10 bg-sand/30' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-marigold text-ink font-heading font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-sm uppercase text-ink">
                        {t('checkout.address')}
                      </h3>
                      {activeStep > 2 && (
                        <p className="text-xs text-ink-60 font-medium">
                          {fullName}, {addressLine1}, {city} ({pincode})
                        </p>
                      )}
                    </div>
                  </div>
                  {activeStep > 2 && (
                    <button className="text-xs font-heading font-semibold text-leaf hover:underline cursor-pointer">
                      {t('checkout.edit')}
                    </button>
                  )}
                </div>

                {activeStep === 2 && (
                  <form
                    onSubmit={handleDeliverySubmit}
                    className="p-5 sm:p-6 space-y-4 animate-in fade-in duration-200"
                  >
                    <div>
                      <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                        {t('checkout.name')}
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t('checkout.name_ph')}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                        {t('checkout.line1')}
                      </label>
                      <input
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder={t('checkout.line1_ph')}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          {t('checkout.line2')}
                        </label>
                        <input
                          type="text"
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                          placeholder={t('checkout.line2_ph')}
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          {t('checkout.landmark')}
                        </label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder={t('checkout.landmark_ph')}
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Pincode with Auto-fill & Serviceability Alert */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          {t('checkout.pin')}
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="e.g. 560001"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium focus:border-leaf focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          {t('checkout.city')}
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder={t('checkout.city_ph')}
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium bg-sand/40"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold uppercase text-ink mb-1.5">
                          {t('checkout.state')}
                        </label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs sm:text-sm font-medium bg-white"
                        >
                          {INDIAN_STATES_AND_UTS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Delivery Estimate or Unserviceable Warning */}
                    {pincode.length === 6 && (
                      <div className="pt-1">
                        {isServiceable ? (
                          <div className="p-3 rounded-2xl bg-leaf-light/50 border border-leaf/20 flex items-center justify-between text-xs">
                            <span className="text-leaf font-semibold">{t('checkout.serviceable')}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-ink-60">{t('checkout.delivers')}</span>
                              <PlaceholderPill text={`${deliveryEstimate} days`} />
                            </div>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-2xl bg-chilli-light border border-chilli/20 text-xs space-y-2">
                            <p className="text-chilli font-bold">
                              {t('checkout.no_deliver')}
                            </p>
                            <a
                              href={waLink({
                                type: 'checkout',
                                summary: `PIN code ${pincode} service inquiry`,
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-leaf font-bold hover:underline"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              {t('checkout.chat')}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Optional GSTIN Toggle */}
                    <div className="pt-2 border-t border-ink/10">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasGstin}
                          onChange={(e) => setHasGstin(e.target.checked)}
                          className="w-4 h-4 accent-leaf rounded"
                        />
                        <span className="text-xs font-semibold text-ink">
                          {t('checkout.gstin')}
                        </span>
                      </label>

                      {hasGstin && (
                        <div className="mt-3">
                          <input
                            type="text"
                            maxLength={15}
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value.toUpperCase())}
                            placeholder="Enter 15-digit GSTIN (e.g. 29AAAAA0000A1Z5)"
                            className="w-full min-h-[44px] px-4 py-2.5 rounded-full border border-ink-40/60 text-xs font-mono uppercase focus:border-leaf focus:outline-hidden"
                          />
                          {gstinError && <p className="text-xs text-chilli mt-1">{gstinError ? t(gstinError) : ''}</p>}
                        </div>
                      )}
                    </div>

                    {deliveryError && (
                      <p className="text-xs text-chilli font-medium">{deliveryError ? t(deliveryError) : ''}</p>
                    )}

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full min-h-[44px] py-3 px-6 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all cursor-pointer shadow-xs"
                      >
                        {t('checkout.to_review')}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* STEP 3: REVIEW */}
              <div className="bg-white rounded-[24px] border border-ink/10 shadow-xs overflow-hidden">
                <div
                  className={`p-5 flex items-center justify-between ${
                    activeStep === 3 ? 'border-b border-ink/10 bg-sand/30' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-leaf text-white font-heading font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <h3 className="font-heading font-bold text-sm uppercase text-ink">
                      {t('checkout.review')}
                    </h3>
                  </div>
                </div>

                {activeStep === 3 && (
                  <div className="p-5 sm:p-6 space-y-6 animate-in fade-in duration-200">
                    {/* Line Items */}
                    <div className="space-y-3 divide-y divide-ink/10">
                      {items.map((it) => (
                        <div
                          key={it.product.id}
                          className="pt-3 first:pt-0 flex justify-between items-center text-xs"
                        >
                          <div>
                            <span className="font-heading font-bold text-ink block">
                              {it.product.name}
                            </span>
                            <span className="text-ink-60">{t('checkout.qty', { count: it.quantity })}</span>
                          </div>
                          <span className="font-heading font-bold text-ink">
                            {it.product.price !== null
                              ? `₹${(it.product.price * it.quantity).toLocaleString('en-IN')}`
                              : '—'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Subtotal, Shipping, Total */}
                    <div className="p-4 rounded-2xl bg-sand/60 space-y-2 text-xs font-body">
                      <div className="flex justify-between text-ink-60">
                        <span>{t('checkout.subtotal')}</span>
                        <span className="font-bold text-ink">
                          ₹{subtotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-ink-60">
                        <span>{t('checkout.shipping')}</span>
                        <span className="font-bold text-leaf">
                          {isFreeShipping ? 'Free (Orders above ₹5,000)' : '₹250'}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-ink/10 flex justify-between items-center text-sm">
                        <span className="font-heading font-bold text-ink">{t('checkout.total')}</span>
                        <span className="font-heading font-extrabold text-lg text-ink">
                          ₹{totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* GST Note */}
                    <div className="text-center">
                      <span className="text-[11px] text-ink-60 font-medium">
                        All prices inclusive of applicable GST (Tax Invoice issued)
                      </span>
                    </div>

                    {/* Primary Button */}
                    <div className="space-y-3">
                      <button
                        onClick={handleInitiatePayment}
                        className="w-full min-h-[48px] py-4 px-6 rounded-full bg-leaf text-white font-heading font-bold text-sm uppercase tracking-wider hover:bg-leaf/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        Pay ₹{totalAmount.toLocaleString('en-IN')} securely
                      </button>

                      <div className="text-center space-y-1">
                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-40 font-heading">
                          <ShieldCheck className="w-3.5 h-3.5 text-sky" />
                          <span>{t('checkout.razorpay')}</span>
                        </div>
                        <p className="text-[11px] text-ink-40 font-body">
                          By paying you agree to our{' '}
                          <a href="#/terms" className="text-leaf underline">
                            Terms
                          </a>{' '}
                          and{' '}
                          <a href="#/refund-policy" className="text-leaf underline">
                            Refund Policy
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right 40% Sticky Order Summary Card (Desktop 5 cols) */}
            <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-ink/10 shadow-md space-y-6">
                <h3 className="font-heading font-bold text-base uppercase tracking-wider text-ink pb-3 border-b border-ink/10">
                  {t('checkout.summary_count', {
                    count: totalItems,
                    unit: totalItems === 1 ? t('checkout.item') : t('checkout.items'),
                  })}
                </h3>

                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div
                      key={it.product.id}
                      className="flex justify-between items-start text-xs pb-2 border-b border-ink/5"
                    >
                      <div>
                        <span className="font-heading font-bold text-ink block">
                          {it.product.name}
                        </span>
                        <span className="text-ink-40">{t('checkout.qty', { count: it.quantity })}</span>
                      </div>
                      <span className="font-heading font-semibold text-ink">
                        {it.product.price !== null
                          ? `₹${(it.product.price * it.quantity).toLocaleString('en-IN')}`
                          : '—'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs font-body pt-2">
                  <div className="flex justify-between text-ink-60">
                    <span>{t('checkout.subtotal')}</span>
                    <span className="font-bold text-ink">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-ink-60">
                    <span>{t('checkout.shipping')}</span>
                    <span className="font-bold text-leaf">
                      {isFreeShipping ? 'Free (Freight Complimentary)' : '₹250'}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-ink/10 flex justify-between items-center text-sm">
                    <span className="font-heading font-bold text-ink">{t('checkout.total_short')}</span>
                    <span className="font-heading font-extrabold text-xl text-ink">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {isEmiAvailable && (
                  <div className="p-3 rounded-2xl bg-olive/15 text-ink text-xs font-heading font-semibold text-center">
                    EMI available at payment
                  </div>
                )}

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-ink-60 font-medium">
                    Prices inclusive of GST · Mandi freight tracked
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Demo Sheet Modal */}
      <PaymentDemoModal
        isOpen={isPaymentSheetOpen}
        totalAmount={totalAmount}
        onSimulateSuccess={handleSimulateSuccess}
        onSimulateFailure={handleSimulateFailure}
        onClose={() => setIsPaymentSheetOpen(false)}
      />

      {/* Minimal Footer with Legal Links Only */}
      <footer className="w-full py-8 text-center text-xs text-ink-40 border-t border-ink/10 mt-12 bg-white">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a href="#/terms" className="hover:text-ink">
            {t('footer.terms')}
          </a>
          <span>•</span>
          <a href="#/privacy" className="hover:text-ink">
            {t('footer.privacy')}
          </a>
          <span>•</span>
          <a href="#/refund-policy" className="hover:text-ink">
            {t('footer.refund')}
          </a>
          <span>•</span>
          <a href="#/shipping-policy" className="hover:text-ink">
            {t('footer.shipping')}
          </a>
        </div>
        <p className="mt-2 text-[11px]">© 2026 ColdEasy • {t('checkout.secure')}</p>
      </footer>
    </div>
  );
};
