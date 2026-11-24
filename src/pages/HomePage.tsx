import React, { useState } from 'react';
import { PRODUCTS, Product } from '../data/mock';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { ComparisonSection } from '../components/ComparisonSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { MediaSection } from '../components/MediaSection';
import { FaqSection } from '../components/FaqSection';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { NotifyModal } from '../components/NotifyModal';
import { ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  onShowToast: (message: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onShowToast }) => {
  const [selectedNotifyProduct, setSelectedNotifyProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const handleNotifySuccess = (phone: string) => {
    onShowToast(t('bestsellers.alert', { phone }));
  };

  // Best Sellers: Exactly 3 products (ColdEasy Box, AutoBox 3 Box, AutoBox 2 Box)
  const bestSellerProducts = [
    PRODUCTS.find((p) => p.id === 'coldeasy-box') || PRODUCTS[0],
    PRODUCTS.find((p) => p.id === 'coldeasy-autobox-3') || PRODUCTS[1],
    PRODUCTS.find((p) => p.id === 'coldeasy-autobox-2') || PRODUCTS[2],
  ];

  const handleBuyNow = (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation();
    if (prod.inStock && prod.price !== null) {
      addToCart(prod.id, 1);
      window.location.hash = `#/products/${prod.slug}`;
    }
  };

  return (
    <div className="w-full">
      {/* 1. E-COMMERCE HERO FOR THE COLDEASY BOX */}
      <section className="relative w-full bg-[#FAF7F0] py-14 sm:py-20 lg:py-28 overflow-hidden border-b border-ink/10 shadow-2xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Headlines & Prominent BUY NOW */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf-light text-leaf text-xs font-heading font-extrabold uppercase tracking-wider mb-4 border border-leaf/20">
                <span className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
                {t('hero.badge')}
              </span>

              <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-[56px] text-ink leading-[1.1] tracking-tight break-words">
                {t('hero.headline')}
              </h1>

              <p className="mt-4 text-lg sm:text-2xl text-leaf font-heading font-bold break-words">
                {t('hero.subhead')}
              </p>

              <p className="mt-3 text-xs sm:text-base text-ink-60 font-body max-w-xl leading-relaxed break-words">
                {t('hero.desc')}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <a
                  href="#/products/coldeasy-box"
                  className="py-4 px-10 rounded-full bg-leaf text-white font-heading font-extrabold text-sm uppercase tracking-wider hover:bg-leaf/90 active:scale-[0.98] transition-all text-center shadow-lg hover:shadow-xl break-words"
                >
                  {t('hero.cta_buy')}
                </a>

                <a
                  href="#how-it-works"
                  className="py-4 px-6 rounded-full border border-ink/20 text-ink font-heading font-bold text-xs uppercase tracking-wider hover:bg-sand transition-all text-center"
                >
                  {t('hero.cta_works')}
                </a>
              </div>
            </div>

            {/* Right Column: One product image on soft background that blends with the box */}
            <div className="lg:col-span-5 flex justify-center items-center relative mt-4 lg:mt-0">
              <div className="relative w-full max-w-[460px] p-6 sm:p-8 rounded-[32px] bg-[#EFE9DD] border border-ink/10 shadow-xl flex items-center justify-center">
                <img
                  src="/products/coldeasy-box/front.png"
                  alt={t('hero.image_alt')}
                  className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500 drop-shadow-md"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW COLDEASY WORKS: The Interactive Product Animation */}
      <HowItWorksSection />

      {/* 3. BEST SELLERS (3 PRODUCTS ONLY): Minimal layout */}
      <section id="bestsellers" className="w-full bg-white py-16 md:py-24 border-t border-ink/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-ink/10">
            <div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-wider text-ink">
                {t('bestsellers.title')}
              </h2>
              <p className="text-xs sm:text-sm text-ink-60 font-body mt-0.5">
                {t('bestsellers.subtitle')}
              </p>
            </div>
            <a
              href="#/products"
              className="inline-flex items-center gap-1.5 font-heading font-bold text-xs uppercase tracking-wider text-leaf hover:underline"
            >
              <span>{t('bestsellers.view_all')}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Exactly 3 cards in one row on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {bestSellerProducts.map((prod) => {
              const isAutoBox2 = prod.id === 'coldeasy-autobox-2';
              const isSoldOut = !prod.inStock || isAutoBox2;

              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    window.location.hash = `#/products/${prod.slug}`;
                  }}
                  className="group bg-[#FAF7F0] rounded-[24px] p-5 sm:p-6 border border-ink/10 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-[4/3] rounded-[18px] bg-white overflow-hidden mb-4 p-3 flex items-center justify-center border border-ink/5 product-image-stage">
                      {prod.images.main.url ? (
                        <img
                          src={prod.images.main.url}
                          alt={prod.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <ImagePlaceholder
                          label={t('bestsellers.images_soon')}
                          sublabel={prod.name}
                          aspectRatio="aspect-[4/3]"
                          className="w-full"
                        />
                      )}
                      {isSoldOut && (
                        <div className="absolute top-3 right-3 bg-chilli text-white text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                          {t('bestsellers.sold_out')}
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="font-heading font-extrabold text-base sm:text-lg text-ink group-hover:text-leaf transition-colors leading-snug">
                      {prod.name}
                    </h3>

                    {/* Rating */}
                    {/* Price & Struck-through Price */}
                    <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                      {prod.price !== null ? (
                        <>
                          <span className="font-heading font-black text-xl sm:text-2xl text-ink">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          {prod.mrp && (
                            <span className="text-xs sm:text-sm text-ink-40 line-through font-medium">
                              ₹{prod.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs font-heading font-bold text-leaf bg-leaf-light px-2.5 py-0.5 rounded-full">
                          Price coming soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Button: BUY NOW or SOLD OUT (no button for AutoBox 2) */}
                  <div className="mt-5 pt-3 border-t border-ink/10">
                    {isSoldOut ? (
                      <div className="w-full py-3 rounded-full bg-ink/10 text-ink-40 font-heading font-bold text-xs uppercase tracking-wider text-center cursor-default select-none">
                        SOLD OUT
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, prod)}
                        className="w-full py-3 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all text-center shadow-xs cursor-pointer active:scale-95"
                      >
                        {t('product.buy_now')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FRIDGE VS COLDEASY BOX */}
      <ComparisonSection />

      {/* 5. CUSTOMER TESTIMONIALS */}
      <TestimonialsSection />

      {/* 6. MEDIA PRESENCE */}
      <MediaSection />

      {/* 7. FAQ (8 Questions, 2 Columns) */}
      <FaqSection />

      {/* Notify Modal for Sold-out products */}
      {selectedNotifyProduct && (
        <NotifyModal
          isOpen={!!selectedNotifyProduct}
          productName={selectedNotifyProduct.name}
          onClose={() => setSelectedNotifyProduct(null)}
          onSuccess={handleNotifySuccess}
        />
      )}
    </div>
  );
};
