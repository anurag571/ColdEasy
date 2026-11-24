import React, { useState } from 'react';
import { PRODUCTS, Product } from '../data/mock';
import { SectionHeading } from '../components/SectionHeading';
import { ProductCard } from '../components/ProductCard';
import { NotifyModal } from '../components/NotifyModal';

interface ProductsListPageProps {
  onShowToast: (message: string) => void;
}

export const ProductsListPage: React.FC<ProductsListPageProps> = ({ onShowToast }) => {
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
            title="BEST SELLERS"
            subtitle="Effortless cooling everyday."
            className="mb-2 md:mb-4"
          />
        </div>

        {/* Group 1: MAIN PRODUCTS */}
        <div className="mb-16">
          <div className="mb-6 flex items-center justify-between border-b border-ink/10 pb-3">
            <h3 className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider text-ink">
              MAIN PRODUCTS
            </h3>
            <span className="text-xs text-ink-60 font-body">Flagship passive crates</span>
          </div>

          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                size="normal"
                badgeStyle="out-of-stock"
                onNotifyClick={(p) => setSelectedNotifyProduct(p)}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        </div>

        {/* Group 2: OTHER COLDEASY PRODUCTS */}
        <div>
          <div className="mb-6 flex items-center justify-between border-b border-ink/10 pb-3">
            <h3 className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider text-ink">
              OTHER COLDEASY PRODUCTS
            </h3>
            <span className="text-xs text-ink-60 font-body">Specialised crop solutions</span>
          </div>

          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                size="compact"
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
