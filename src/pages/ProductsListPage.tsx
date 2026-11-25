import React, { useState } from 'react';
import { PRODUCTS, Product } from '../data/mock';
import { SectionHeading } from '../components/SectionHeading';
import { ProductCard } from '../components/ProductCard';
import { NotifyModal } from '../components/NotifyModal';
import { useLanguage } from '../context/LanguageContext';

interface ProductsListPageProps {
  onShowToast: (message: string) => void;
}

export const ProductsListPage: React.FC<ProductsListPageProps> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [selectedNotifyProduct, setSelectedNotifyProduct] = useState<Product | null>(null);

  const mainProducts = PRODUCTS.filter((p) => p.group === 'main');
  const otherProducts = PRODUCTS.filter((p) => p.group === 'other');

  const handleNotifySuccess = (phone: string) => {
    onShowToast(`You're on the alert list (+91 ${phone})! We'll notify you on WhatsApp.`);
  };

  return (
    <div className="w-full bg-cream py-10 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Compact Header */}
        <div className="mb-8 text-center sm:text-left">
          <SectionHeading
            title={t('products.title')}
            subtitle={t('products.subtitle')}
            className="mb-2 md:mb-4"
          />
        </div>

        {/* Group 1: MAIN PRODUCTS */}
        <div className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider text-ink">
              {t('products.main')}
            </h3>
            <span className="text-xs text-ink-60 font-body">{t('products.main_note')}</span>
          </div>

          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainProducts.map((prod, index) => (
              <ProductCard
                key={prod.id}
                product={prod}
                size="normal"
                index={index}
                onNotifyClick={(p) => setSelectedNotifyProduct(p)}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        </div>

        {/* Group 2: OTHER COLDEASY PRODUCTS */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider text-ink">
              {t('products.other')}
            </h3>
            <span className="text-xs text-ink-60 font-body">{t('products.other_note')}</span>
          </div>

          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherProducts.map((prod, index) => (
              <ProductCard
                key={prod.id}
                product={prod}
                size="compact"
                index={index + mainProducts.length}
                onNotifyClick={(p) => setSelectedNotifyProduct(p)}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Notify Modal */}
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
