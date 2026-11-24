import React, { useState, useEffect } from 'react';
import { PRODUCTS, Product } from '../data/mock';
import { useCart } from '../context/CartContext';
import { ChevronRight, Share2, ChevronDown, Sun, Zap, Sparkles } from 'lucide-react';
import { track } from '../lib/track';

interface ProductPageProps {
  slug?: string;
  onShowToast?: (message: string) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ slug = 'coldeasy-box', onShowToast }) => {
  const baseProduct: Product =
    PRODUCTS.find((p) => p.slug === slug || p.id === slug) || PRODUCTS[0];

  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // AutoBox Variant Switch: Solar vs AC Grid
  const isAutoBox = baseProduct.id.includes('autobox');
  const [powerVariant, setPowerVariant] = useState<'solar' | 'grid'>('solar');

  // Accordion state: exactly 3 accordions (Measurements, Features & Specs, Materials & Care)
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    measurements: true,
    features: false,
    materials: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Compute pricing and highlights based on variant for AutoBox
  let displayPrice = baseProduct.price;
  let displayMrp = baseProduct.mrp;
  let displayDiscount = baseProduct.saveAmount
    ? `Save ₹${baseProduct.saveAmount.toLocaleString('en-IN')}`
    : null;

  if (isAutoBox) {
    if (powerVariant === 'solar') {
      displayMrp = 17000;
      displayPrice = 16500;
      displayDiscount = '₹500 OFF';
    } else {
      // AC Grid: same pricing per brief
      // TODO(client): confirm AC Grid pricing
      displayMrp = 17000;
      displayPrice = 16500;
      displayDiscount = '₹500 OFF';
    }
  }

  // Highlights dynamically adjust for AutoBox variant
  const activeHighlights = (baseProduct.highlights || []).map((h) => {
    if (isAutoBox) {
      if (powerVariant === 'solar') {
        if (h.includes('POWERED')) return 'SOLAR POWERED (Runs on clean, renewable solar energy)';
      } else {
        if (h.includes('POWERED')) return 'GRID POWERED (Runs on Electricity)';
      }
    }
    return h;
  });

  // Track product view
  useEffect(() => {
    track('view_item', {
      item_id: baseProduct.id,
      item_name: baseProduct.name,
      price: displayPrice || 0,
      currency: 'INR',
    });
  }, [baseProduct.id, baseProduct.name, displayPrice]);

  // Reset selected gallery thumbnail when switching product or power variant
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [baseProduct.id, powerVariant]);

  // Gallery items (variant-aware for AutoBox Solar vs AC Grid)
  const variantGallery = isAutoBox
    ? baseProduct.images.variantGalleries?.[powerVariant]
    : undefined;

  const galleryItems =
    variantGallery && variantGallery.length > 0
      ? variantGallery
      : baseProduct.images.gallery && baseProduct.images.gallery.length > 0
        ? baseProduct.images.gallery
        : [
            {
              id: 'main',
              url: baseProduct.images.main.url,
              label: baseProduct.images.main.label,
              sublabel: baseProduct.images.main.sublabel,
            },
            {
              id: 'hover',
              url: baseProduct.images.hover.url,
              label: baseProduct.images.hover.label,
              sublabel: baseProduct.images.hover.sublabel,
            },
          ];

  const currentItem = galleryItems[selectedImageIndex] || galleryItems[0];
  const showcaseImageUrl = galleryItems[0]?.url || baseProduct.images.main.url;
  const hasPrice = displayPrice !== null;
  const isAvailableForPurchase = baseProduct.inStock && hasPrice;

  // Amazon-style Share handler
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/products/${baseProduct.slug}`;
    const shareText = `Check out ${baseProduct.name} on ColdEasy: ${shareUrl}`;

    track('share_product', {
      item_id: baseProduct.id,
      item_name: baseProduct.name,
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: baseProduct.name,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        await navigator.clipboard.writeText(shareText);
        onShowToast?.('Link copied to clipboard!');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      onShowToast?.('Link copied to clipboard!');
    }
  };

  const handleBuyNow = () => {
    if (isAvailableForPurchase && displayPrice !== null) {
      addToCart(baseProduct.id, 1);
      window.location.hash = '#cart';
    }
  };

  return (
    <div className="w-full bg-[#FAF7F0] pb-24 md:pb-20">
      {/* Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-2">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-heading font-medium text-ink-60"
        >
          <a href="#/" className="hover:text-leaf transition-colors">
            Home
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-ink-40" />
          <a href="#/products" className="hover:text-leaf transition-colors">
            Products
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-ink-40" />
          <span className="text-ink font-bold">{baseProduct.name}</span>
        </nav>
      </div>

      {/* TOP SECTION: TWO COLUMNS (Build once, reuse) */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* LEFT COLUMN: Large image with 4-5 thumbnails */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Main Display Image */}
            <div className="relative rounded-[28px] bg-white p-4 sm:p-6 border border-ink/10 shadow-sm flex items-center justify-center overflow-hidden aspect-[4/3] sm:aspect-[16/11] product-image-stage">
              {currentItem?.url ? (
                <img
                  src={currentItem.url}
                  alt={currentItem.label || baseProduct.name}
                  className="w-full h-full object-contain transition-transform duration-300"
                />
              ) : (
                <div className="p-8 text-center">
                  <p className="font-heading font-bold text-sm uppercase tracking-wider text-ink">
                    Images coming soon
                  </p>
                  <p className="mt-2 text-xs text-ink-60">{baseProduct.name}</p>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 left-4 z-10">
                {!baseProduct.inStock ? (
                  <span className="px-3 py-1 rounded-full bg-chilli text-white text-xs font-heading font-bold uppercase tracking-wider shadow-xs">
                    OUT OF STOCK
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-leaf text-white text-xs font-heading font-bold uppercase tracking-wider shadow-xs">
                    In Stock
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Name + Share, rating, price directly above large BUY NOW whose bottom edge lines up */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-[28px] p-6 sm:p-8 border border-ink/10 shadow-sm">
            <div>
              {/* Product Name + Share Button (Amazon style) */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-ink leading-tight">
                  {baseProduct.name}
                </h1>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-sand hover:bg-leaf-light text-ink hover:text-leaf transition-colors cursor-pointer shrink-0"
                  aria-label="Share product"
                  title="Share product link"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* AutoBox Variant Switch: Solar vs AC Grid Toggle */}
              {isAutoBox && (
                <div className="mt-6 p-4 rounded-2xl bg-sand/60 border border-ink/10">
                  <div className="text-xs font-heading font-bold uppercase tracking-wider text-ink mb-2">
                    Power Configuration
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPowerVariant('solar')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        powerVariant === 'solar'
                          ? 'bg-leaf text-white shadow-xs'
                          : 'bg-white text-ink border border-ink/10 hover:bg-sand'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Solar Powered</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPowerVariant('grid')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        powerVariant === 'grid'
                          ? 'bg-leaf text-white shadow-xs'
                          : 'bg-white text-ink border border-ink/10 hover:bg-sand'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>AC Grid</span>
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-ink-60 font-body">
                    {powerVariant === 'solar'
                      ? 'Includes solar charging system for off-grid operations.'
                      : 'Standard AC wall grid powered automated controller.'}
                  </p>
                </div>
              )}

              {/* Short Description */}
              <p className="mt-5 text-xs sm:text-sm text-ink-60 font-body leading-relaxed">
                {baseProduct.shortDescription}
              </p>
            </div>

            {/* Price Row directly above large BUY NOW button */}
            <div className="mt-8 pt-6 border-t border-ink/10">
              <div className="flex items-baseline gap-3 flex-wrap mb-4">
                {hasPrice ? (
                  <>
                    <span className="font-heading font-black text-3xl sm:text-4xl text-ink">
                      ₹{displayPrice!.toLocaleString('en-IN')}
                    </span>
                    {displayMrp && (
                      <span className="text-sm sm:text-base font-semibold text-ink-40 line-through">
                        ₹{displayMrp.toLocaleString('en-IN')}
                      </span>
                    )}
                    {displayDiscount && (
                      <span className="px-2.5 py-1 rounded-full bg-marigold text-ink text-xs font-heading font-extrabold uppercase tracking-wider shadow-2xs">
                        {displayDiscount}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-base font-heading font-bold text-leaf bg-leaf-light px-4 py-1.5 rounded-full">
                    Price coming soon
                  </span>
                )}
              </div>

              {/* BUY NOW whose bottom edge lines up with the bottom of the main image */}
              {isAvailableForPurchase ? (
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-4 px-8 rounded-full bg-leaf text-white font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider hover:bg-leaf/90 active:scale-[0.98] transition-all text-center shadow-md cursor-pointer"
                >
                  BUY NOW
                </button>
              ) : !baseProduct.inStock ? (
                <div className="space-y-2 text-center">
                  <button
                    disabled
                    className="w-full py-4 px-8 rounded-full bg-ink/10 text-ink-40 font-heading font-bold text-sm uppercase tracking-wider cursor-not-allowed"
                  >
                    SOLD OUT
                  </button>
                  <p className="text-xs text-ink-60 font-body">
                    Currently in production. Restock updates sent on WhatsApp.
                  </p>
                </div>
              ) : (
                <a
                  href="https://api.whatsapp.com/send/?phone=919182968542&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-8 rounded-full border-2 border-ink text-ink font-heading font-bold text-sm uppercase tracking-wider hover:bg-ink hover:text-white transition-all text-center inline-block"
                >
                  Enquire on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* THEN IN EXACT ORDER BELOW: */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 mt-16 sm:mt-20 space-y-16">
        {/* 1. DESCRIPTION (centered title with divider) */}
        <section className="text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px bg-ink/15 flex-1 max-w-[120px]" />
            <h2 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-widest text-ink">
              DESCRIPTION
            </h2>
            <span className="h-px bg-ink/15 flex-1 max-w-[120px]" />
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-ink-80 font-body leading-relaxed">
            {baseProduct.shortDescription}
          </p>
        </section>

        {/* 2. LARGE PRODUCT IMAGE */}
        <section className="flex justify-center">
          <div className="w-full max-w-2xl rounded-[32px] bg-white product-image-stage p-6 sm:p-10 border border-ink/10 shadow-md overflow-hidden flex items-center justify-center">
            <img
              src={showcaseImageUrl}
              alt={`${baseProduct.name} Showcase`}
              className="w-full max-h-[440px] object-contain drop-shadow-sm"
              loading="lazy"
            />
          </div>
        </section>

        {/* 3. HIGHLIGHTS STRIP */}
        {activeHighlights.length > 0 && (
          <section className="bg-white rounded-[28px] p-6 sm:p-8 border border-ink/10 shadow-xs">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <Sparkles className="w-5 h-5 text-marigold" />
              <h3 className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider text-ink">
                Product Highlights
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activeHighlights.map((hl, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-sand/50 border border-ink/5 text-xs sm:text-sm font-semibold text-ink"
                >
                  <span className="w-2 h-2 rounded-full bg-leaf shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. "POWERED BY STRUCTURALLY ENHANCED EVAPORATIVE COOLING TECHNOLOGY"
               (centered, Learn more bottom right -> links to /science) */}
        <section className="bg-white rounded-[28px] p-6 sm:p-10 border border-ink/10 shadow-xs relative">
          <h3 className="font-heading font-black text-lg sm:text-xl md:text-2xl uppercase tracking-tight text-ink text-center mb-4">
            Powered by Structurally Enhanced Evaporative Cooling Technology
          </h3>

          <p className="text-xs sm:text-sm text-ink-70 font-body leading-relaxed text-center max-w-2xl mx-auto">
            {baseProduct.seecSection?.copy ||
              'ColdEasy uses passive Structurally Enhanced Evaporative Cooling (SEEC) physics to create a temperature-controlled, high-humidity microclimate without compressors, chemical refrigerants, or electricity.'}
          </p>

          <div className="mt-6 text-right">
            <a
              href="#/science"
              className="inline-flex items-center gap-1.5 font-heading font-bold text-xs uppercase tracking-wider text-leaf hover:underline"
            >
              <span>Learn more</span>
              <span>→</span>
            </a>
          </div>
        </section>

        {/* 5. PRODUCT INFORMATION WITH EXACTLY 3 ACCORDIONS:
               Measurements, Features & Specs, Materials & Care (no other accordions) */}
        <section className="bg-white rounded-[28px] p-6 sm:p-8 border border-ink/10 shadow-xs">
          <div className="text-center mb-8">
            <h3 className="font-heading font-black text-lg sm:text-xl uppercase tracking-wider text-ink">
              Product Information
            </h3>
            <p className="text-xs text-ink-60 font-body mt-1">
              Specifications, dimensions and materials verified by client data.
            </p>
          </div>

          <div className="divide-y divide-ink/10">
            {/* Accordion 1: Measurements */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('measurements')}
                className="w-full flex items-center justify-between text-left font-heading font-bold text-sm sm:text-base uppercase tracking-wider text-ink py-2 cursor-pointer"
                aria-expanded={openAccordions.measurements}
              >
                <span>Measurements</span>
                <ChevronDown
                  className={`w-5 h-5 text-ink-60 transition-transform ${
                    openAccordions.measurements ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordions.measurements && (
                <div className="pt-3 pb-2 space-y-2 text-xs sm:text-sm font-body">
                  {baseProduct.measurements && baseProduct.measurements.length > 0 ? (
                    baseProduct.measurements.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-center justify-between py-1.5 border-b border-ink/5"
                      >
                        <span className="text-ink-60">{spec.label}</span>
                        <span className="font-heading font-semibold text-ink">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-ink-40 py-2">
                      // TODO(client): Technical measurements from coldeasy.in
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Accordion 2: Features & Specs */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('features')}
                className="w-full flex items-center justify-between text-left font-heading font-bold text-sm sm:text-base uppercase tracking-wider text-ink py-2 cursor-pointer"
                aria-expanded={openAccordions.features}
              >
                <span>Features & Specs</span>
                <ChevronDown
                  className={`w-5 h-5 text-ink-60 transition-transform ${
                    openAccordions.features ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordions.features && (
                <div className="pt-3 pb-2 space-y-2 text-xs sm:text-sm font-body">
                  {baseProduct.specs && baseProduct.specs.length > 0 ? (
                    baseProduct.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-center justify-between py-1.5 border-b border-ink/5"
                      >
                        <span className="text-ink-60">{spec.label}</span>
                        <span className="font-heading font-semibold text-ink">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-ink-40 py-2">
                      // TODO(client): Features and technical specifications
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Accordion 3: Materials & Care */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('materials')}
                className="w-full flex items-center justify-between text-left font-heading font-bold text-sm sm:text-base uppercase tracking-wider text-ink py-2 cursor-pointer"
                aria-expanded={openAccordions.materials}
              >
                <span>Materials & Care</span>
                <ChevronDown
                  className={`w-5 h-5 text-ink-60 transition-transform ${
                    openAccordions.materials ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordions.materials && (
                <div className="pt-3 pb-2 space-y-2 text-xs sm:text-sm font-body">
                  {baseProduct.materialsAndCare && baseProduct.materialsAndCare.length > 0 ? (
                    baseProduct.materialsAndCare.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-center justify-between py-1.5 border-b border-ink/5"
                      >
                        <span className="text-ink-60">{spec.label}</span>
                        <span className="font-heading font-semibold text-ink">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-ink-40 py-2">
                      // TODO(client): Materials and cleaning guidelines
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
