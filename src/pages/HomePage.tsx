import React, { useState } from 'react';
import { PRODUCTS, Product } from '../data/mock';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { ComparisonSection } from '../components/ComparisonSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { MediaSection } from '../components/MediaSection';
import { FaqSection } from '../components/FaqSection';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { NotifyModal } from '../components/NotifyModal';
import { ArrowRight, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  onShowToast: (message: string) => void;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <span className="inline-flex items-center gap-0.5" aria-hidden="true">
    {[0, 1, 2, 3, 4].map((index) => {
      const fill = Math.min(1, Math.max(0, rating - index));
      return (
        <span key={index} className="relative h-4 w-4">
          <Star className="h-4 w-4 text-marigold/40" />
          <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
            <Star className="h-4 w-4 fill-marigold text-marigold" />
          </span>
        </span>
      );
    })}
  </span>
);

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
    if (!(prod.inStock && prod.price !== null)) return;
    addToCart(prod.id, 1);
    window.location.hash = prod.id === 'coldeasy-box' ? '#/checkout' : `#/products/${prod.slug}`;
  };

  return (
    <div className="w-full">
      {/* 1. E-COMMERCE HERO FOR THE COLDEASY BOX */}
      <section className="hero-scene relative w-full overflow-hidden py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
            {/* Left Column: Headlines & Prominent BUY NOW */}
            <div className="relative z-10 lg:col-span-6 flex flex-col items-start text-left">
              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-[52px] text-[#251A10] leading-[1.05] tracking-tight break-words">
                {t('hero.headline')}
              </h1>

              <p className="mt-4 max-w-md text-sm sm:text-base text-[#5E554E] font-body leading-relaxed">
                {t('hero.desc')}
              </p>

              <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <a
                  href="#/products/coldeasy-box"
                  className="py-4 px-10 rounded-full bg-leaf text-white font-heading font-extrabold text-sm uppercase tracking-wider hover:bg-leaf/90 active:scale-[0.98] transition-all text-center shadow-lg hover:shadow-xl break-words"
                >
                  {t('hero.cta_buy')}
                </a>

                <a
                  href="#/science?section=science-how"
                  className="hero-secondary py-4 px-6 rounded-full border border-[#251A10]/20 text-[#251A10] font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#EFE8DB] transition-all text-center"
                >
                  {t('hero.cta_works')}
                </a>
              </div>
            </div>

            {/* Product sits on the page colour and runs off the right, the way the Oura ring does. */}
            <div className="relative mt-2 lg:col-span-6 lg:-ml-8 lg:mt-6 lg:-mr-2">
              <img
                src="/products/coldeasy-box/front.png"
                alt={t('hero.image_alt')}
                className="hero-product ml-auto h-auto w-full object-contain object-left lg:w-[104%] lg:max-w-[640px]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW COLDEASY WORKS: The Interactive Product Animation */}
      <HowItWorksSection />

      {/* 3. BEST SELLERS (3 PRODUCTS ONLY): Minimal layout */}
      <section id="bestsellers" className="home-fade home-fade-works relative w-full bg-white pb-16 pt-10 md:pb-24 md:pt-14">
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-wider text-ink">
              {t('bestsellers.title')}
            </h2>
            <a
              href="#/products"
              className="inline-flex items-center gap-1.5 font-heading font-bold text-xs uppercase tracking-wider text-leaf hover:underline"
            >
              <span>{t('bestsellers.view_all')}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

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
                  className="group flex cursor-pointer flex-col justify-between rounded-[24px] bg-[#FAF7F0] p-5 shadow-[0_8px_24px_rgba(37,26,16,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(37,26,16,0.08)] sm:p-6"
                >
                  <div>
                    <div className="relative mb-5 flex aspect-[4/3] items-center justify-center">
                      {prod.images.main.url ? (
                        <img
                          src={prod.images.main.url}
                          alt={prod.name}
                          className={`bestseller-photo h-full w-full object-contain drop-shadow-[0_12px_16px_rgba(37,26,16,0.14)] transition-transform duration-300 group-hover:scale-105 ${
                            isSoldOut ? 'opacity-80' : ''
                          }`}
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
                        <div className="absolute top-1 right-1 rounded-full bg-chilli px-2.5 py-1 text-[10px] font-heading font-bold uppercase tracking-wider text-white">
                          {t('bestsellers.sold_out')}
                        </div>
                      )}
                    </div>

                    <h3 className="font-heading text-base font-extrabold leading-snug text-ink transition-colors group-hover:text-leaf sm:text-lg">
                      {prod.name}
                    </h3>

                    {prod.rating != null && (
                      <p
                        className="mt-1.5 flex items-center gap-1.5 text-xs font-heading font-bold text-ink"
                        aria-label={`${prod.rating} out of 5`}
                      >
                        <RatingStars rating={prod.rating} />
                        <span>
                          {prod.rating} / 5
                        </span>
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-baseline gap-2">
                      {prod.price !== null ? (
                        <>
                          <span className="font-heading text-lg font-bold text-ink">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          {prod.mrp && (
                            <span className="text-xs font-medium text-ink-40 line-through">
                              ₹{prod.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs font-heading font-bold text-leaf">
                          Price coming soon
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    {isSoldOut ? (
                      <div className="w-full cursor-default select-none rounded-full bg-ink/10 py-3 text-center text-xs font-heading font-bold uppercase tracking-wider text-ink-40">
                        {t('bestsellers.sold_out')}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, prod)}
                        className="w-full cursor-pointer rounded-full bg-leaf py-3 text-center text-xs font-heading font-bold uppercase tracking-wider text-white transition-all hover:bg-leaf/90 active:scale-95"
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
