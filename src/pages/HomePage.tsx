import React, { useState } from 'react';
import { PRODUCTS, Product } from '../data/mock';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { ComparisonSection } from '../components/ComparisonSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { MediaSection } from '../components/MediaSection';
import { FaqSection } from '../components/FaqSection';
import { OptimizedImage } from '../components/OptimizedImage';
import { ProductCard } from '../components/ProductCard';
import { NotifyModal } from '../components/NotifyModal';
import { ArrowRight, Droplets, Leaf, ZapOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface HomePageProps {
  onShowToast: (message: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onShowToast }) => {
  const [selectedNotifyProduct, setSelectedNotifyProduct] = useState<Product | null>(null);
  const { t } = useLanguage();
  const { buyNow } = useCart();

  const bestSellerProducts = [
    PRODUCTS.find((p) => p.id === 'coldeasy-box') || PRODUCTS[0],
    PRODUCTS.find((p) => p.id === 'coldeasy-autobox-3') || PRODUCTS[1],
    PRODUCTS.find((p) => p.id === 'coldeasy-autobox-2') || PRODUCTS[2],
  ];

  const handleNotifySuccess = (phone: string) => {
    onShowToast(t('bestsellers.alert', { phone }));
  };

  return (
    <div className="w-full">
      {/* 1. E-COMMERCE HERO FOR THE COLDEASY BOX */}
      <section className="hero-scene relative w-full overflow-hidden py-12 text-ink sm:py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
            <div className="relative z-10 lg:col-span-6 flex flex-col items-start text-left">
              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-[52px] text-ink leading-[1.05] tracking-tight break-words">
                {t('hero.headline')}
              </h1>

              <p className="mt-4 max-w-md text-sm sm:text-base text-ink-60 font-body leading-relaxed">
                {t('hero.desc')}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {[
                  { icon: Droplets, label: t('hero.chip.evap') },
                  { icon: ZapOff, label: t('hero.chip.power') },
                  { icon: Leaf, label: t('hero.chip.produce') },
                ].map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-sand px-3 py-1.5 font-heading text-[11px] font-semibold text-ink"
                  >
                    <Icon className="h-3.5 w-3.5 text-leaf" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => buyNow('coldeasy-box')}
                  className="py-4 px-10 rounded-full bg-leaf text-white font-heading font-extrabold text-sm uppercase tracking-wider hover:bg-leaf/90 active:scale-[0.98] transition-all text-center shadow-lg hover:shadow-xl break-words cursor-pointer"
                >
                  {t('hero.cta_buy')}
                </button>

                <a
                  href="#/science?section=science-how"
                  className="hero-secondary py-4 px-6 rounded-full border border-ink/20 text-ink font-heading font-bold text-xs uppercase tracking-wider hover:bg-sand transition-all text-center"
                >
                  {t('hero.cta_works')}
                </a>
              </div>
            </div>

            <div className="hero-frame relative mt-2 lg:col-span-6">
              <OptimizedImage
                src="/assets/hero/hero-box.webp"
                alt={t('hero.image_alt')}
                className="hero-product ml-auto h-auto w-full object-contain lg:max-w-[640px]"
                width={1024}
                height={1024}
                loading="eager"
                fetchPriority="high"
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
            {bestSellerProducts.map((prod, index) => (
              <ProductCard
                key={prod.id}
                product={prod}
                index={index}
                onNotifyClick={setSelectedNotifyProduct}
                onShowToast={onShowToast}
              />
            ))}
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
