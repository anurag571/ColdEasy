import React, { useState } from 'react';
import { Product } from '../data/mock';
import { OptimizedImage } from './OptimizedImage';
import { ImagePlaceholder } from './ImagePlaceholder';
import { useCart } from '../context/CartContext';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  size?: 'normal' | 'compact';
  badgeStyle?: 'sold-out' | 'out-of-stock';
  index?: number;
  onNotifyClick?: (product: Product) => void;
  onShowToast?: (message: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  onNotifyClick,
}) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [touchSwiped, setTouchSwiped] = useState(false);

  const handleCardClick = () => {
    window.location.hash = `#/products/${product.slug}`;
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.inStock && product.price !== null) {
      addToCart(product.id, 1);
      window.location.hash = `#/products/${product.slug}`;
    }
  };

  const currentImageData = isHovered || touchSwiped ? product.images.hover : product.images.main;
  const hasPrice = product.price !== null;
  const isAvailableForPurchase = product.inStock && hasPrice;
  const quietLabel = !product.inStock ? t('product.quiet_stock') : null;

  return (
    <article
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setTouchSwiped((prev) => !prev)}
      className="product-tile-card product-rise group cursor-pointer"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="product-tile relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[28px] bg-studio">
        {quietLabel ? (
          <span className="absolute left-4 top-4 font-heading text-[11px] font-semibold tracking-wide text-ink-60">
            {quietLabel}
          </span>
        ) : null}

        {currentImageData.url ? (
          <OptimizedImage
            src={currentImageData.url}
            alt={currentImageData.label || product.name}
            className={`h-full w-full object-contain ${product.inStock ? '' : 'opacity-80'}`}
            width={1400}
            height={1050}
            loading="lazy"
          />
        ) : (
          <ImagePlaceholder
            label={t('product.images_soon')}
            sublabel={product.name}
            aspectRatio="aspect-[4/3]"
          />
        )}
      </div>

      <h3 className="mt-4 font-heading text-base font-bold leading-snug text-ink sm:text-lg">
        {product.name}
      </h3>

      <p className="mt-1 line-clamp-2 font-body text-sm text-ink-60">
        {t(`product.desc.${product.id}`)}
      </p>

      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        {hasPrice ? (
          <>
            <span className="font-heading text-xl font-bold text-ink">
              ₹{product.price!.toLocaleString('en-IN')}
            </span>
          </>
        ) : (
          <span className="font-heading text-sm font-bold text-ink-60">{t('product.price_soon')}</span>
        )}
      </div>

      <div className="mt-4">
        {isAvailableForPurchase ? (
          <button
            type="button"
            onClick={handleBuyNow}
            className="buy-outline cursor-pointer rounded-full border border-leaf px-5 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-leaf active:bg-leaf active:text-white"
          >
            {t('product.buy_now')}
          </button>
        ) : !product.inStock ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNotifyClick?.(product);
            }}
            className="cursor-pointer rounded-full border border-ink/20 px-5 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-ink active:bg-ink/5"
          >
            {t('product.notify_me')}
          </button>
        ) : (
          <a
            href={`#/products/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-block rounded-full border border-ink/20 px-5 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-ink"
          >
            {t('product.view_details')}
          </a>
        )}
      </div>

      <a
        href={`#/products/${product.slug}`}
        onClick={(e) => e.stopPropagation()}
        className="mt-3 inline-flex items-center gap-1 font-body text-sm text-ink-60"
      >
        {t('product.view_product')}
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </article>
  );
};
