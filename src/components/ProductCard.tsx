import React, { useState } from 'react';
import { Product } from '../data/mock';
import { ImagePlaceholder } from './ImagePlaceholder';
import { useCart } from '../context/CartContext';
import { ArrowRight, Star } from 'lucide-react';
import { EmiInfoModal } from './EmiInfoModal';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  size?: 'normal' | 'compact';
  badgeStyle?: 'sold-out' | 'out-of-stock';
  index?: number;
  onNotifyClick?: (product: Product) => void;
  onShowToast?: (message: string) => void;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <span className="inline-flex items-center gap-0.5" aria-hidden="true">
    {[0, 1, 2, 3, 4].map((star) => {
      const fill = Math.min(1, Math.max(0, rating - star));
      return (
        <span key={star} className="relative h-3.5 w-3.5">
          <Star className="h-3.5 w-3.5 text-marigold/40" />
          <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
            <Star className="h-3.5 w-3.5 fill-marigold text-marigold" />
          </span>
        </span>
      );
    })}
  </span>
);

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  onNotifyClick,
}) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [touchSwiped, setTouchSwiped] = useState(false);
  const [showEmiModal, setShowEmiModal] = useState(false);

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
  const quietLabel = !product.inStock
    ? t('product.quiet_stock')
    : product.saveAmount && product.saveAmount > 0
      ? t('product.save_label', { amount: product.saveAmount.toLocaleString('en-IN') })
      : null;

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
          <img
            src={currentImageData.url}
            alt={currentImageData.label || product.name}
            className={`h-full w-full object-contain ${product.inStock ? '' : 'opacity-80'}`}
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
            {product.mrp ? (
              <span className="text-sm font-medium text-ink-40 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            ) : null}
          </>
        ) : (
          <span className="font-heading text-sm font-bold text-ink-60">{t('product.price_soon')}</span>
        )}
      </div>

      {product.emiEligible ? (
        <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-olive">
          <span>
            {t('product.emi', {
              amount: (product.emiFromPerMonth || '₹1,420').replace(/^₹/, ''),
            })}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowEmiModal(true);
            }}
            className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-sand text-[10px] font-bold text-ink-60"
            aria-label={t('product.emi_details')}
          >
            i
          </button>
        </div>
      ) : null}

      {product.rating != null ? (
        <div className="mt-2 flex items-center gap-2">
          <RatingStars rating={product.rating} />
          <span className="font-body text-sm text-ink">{product.rating} / 5</span>
        </div>
      ) : null}

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

      <EmiInfoModal isOpen={showEmiModal} onClose={() => setShowEmiModal(false)} />
    </article>
  );
};
