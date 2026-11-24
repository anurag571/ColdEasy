import React, { useState } from 'react';
import { Product } from '../data/mock';
import { ImagePlaceholder } from './ImagePlaceholder';
import { useCart } from '../context/CartContext';
import { Share2, ArrowRight } from 'lucide-react';
import { EmiInfoModal } from './EmiInfoModal';
import { track } from '../lib/track';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  size?: 'normal' | 'compact';
  badgeStyle?: 'sold-out' | 'out-of-stock';
  onNotifyClick?: (product: Product) => void;
  onShowToast?: (message: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  size = 'normal',
  badgeStyle = 'sold-out',
  onNotifyClick,
  onShowToast,
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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    track('share_product', {
      item_id: product.id,
      item_name: product.name,
    });
    const url = `${window.location.origin}${window.location.pathname}#/products/${product.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url,
        });
      } catch {
        await navigator.clipboard.writeText(url);
        onShowToast?.(t('product.link_copied'));
      }
    } else {
      await navigator.clipboard.writeText(url);
      onShowToast?.(t('product.link_copied'));
    }
  };

  const currentImageData = isHovered || touchSwiped ? product.images.hover : product.images.main;

  const hasPrice = product.price !== null;
  const isAvailableForPurchase = product.inStock && hasPrice;

  return (
    <article
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setTouchSwiped((prev) => !prev)}
      className={`group relative bg-white rounded-[24px] border border-ink/5 flex flex-col justify-between transition-all duration-250 cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
        size === 'normal' ? 'p-5 sm:p-6' : 'p-4 sm:p-5'
      }`}
    >
      <div>
        {/* Image Container with hover image swap & zoom */}
        <div className="relative mb-4 overflow-hidden rounded-[20px] bg-white border border-ink/5 product-image-stage">
          <div className="transition-transform duration-250 ease-out group-hover:scale-[1.03]">
            {currentImageData.url ? (
              <div className="aspect-[4/3] w-full overflow-hidden bg-white product-image-stage flex items-center justify-center p-2.5">
                <img
                  src={currentImageData.url}
                  alt={currentImageData.label || product.name}
                  className="w-full h-full object-contain transition-transform duration-250 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ) : (
              <ImagePlaceholder
                label={t('product.images_soon')}
                sublabel={product.name}
                aspectRatio="aspect-[4/3]"
              />
            )}
          </div>

          {/* Sold out / Out of Stock pill - shows OUT OF STOCK on hover */}
          {!product.inStock && (
            <div className="absolute top-3 right-3 z-10">
              <span className="px-3 py-1 rounded-full bg-chilli text-white text-xs font-heading font-bold uppercase tracking-wider shadow-xs">
                {isHovered
                  ? t('product.out_of_stock')
                  : badgeStyle === 'sold-out'
                    ? t('product.sold_out')
                    : t('product.out_of_stock')}
              </span>
            </div>
          )}

          {/* In-stock Save pill if discount exists */}
          {product.inStock && product.saveAmount && product.saveAmount > 0 && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 rounded-full bg-marigold text-ink text-[11px] font-heading font-bold uppercase tracking-wider shadow-xs">
                Save ₹{product.saveAmount.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-heading font-bold text-base sm:text-lg text-ink group-hover:text-leaf transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="mt-1 text-xs text-ink-60 line-clamp-2 font-body">
          {product.shortDescription}
        </p>

        {/* Price & MRP Row */}
        <div className="mt-3 flex items-baseline gap-2 flex-wrap">
          {hasPrice ? (
            <>
              <span className="font-heading font-bold text-xl sm:text-2xl text-ink">
                ₹{product.price!.toLocaleString('en-IN')}
              </span>
              {product.mrp && (
                <span className="text-xs sm:text-sm font-medium text-ink-40 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm font-heading font-bold text-leaf bg-leaf-light px-3 py-1 rounded-full">
              {t('product.price_soon')}
            </span>
          )}
        </div>

        {/* EMI line for eligible products only */}
        {product.emiEligible && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-olive font-medium">
            <span>{t('product.emi', { amount: product.emiFromPerMonth || '1,420' })}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowEmiModal(true);
              }}
              className="w-4 h-4 rounded-full bg-sand hover:bg-olive/20 text-ink-60 flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors"
              aria-label={t('product.emi_details')}
              title={t('product.emi_details')}
            >
              i
            </button>
          </div>
        )}

      </div>

      {/* Card Actions */}
      <div className="mt-5 pt-3 border-t border-ink/5">
        {isAvailableForPurchase ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 px-4 rounded-full bg-leaf text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-leaf/90 active:scale-[0.98] transition-all text-center shadow-xs cursor-pointer"
            >
              {t('product.buy_now')}
            </button>
            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-sand hover:bg-leaf-light text-ink hover:text-leaf transition-colors cursor-pointer"
              aria-label={t('product.share_named', { name: product.name })}
              title={t('product.share')}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        ) : !product.inStock ? (
          <div className="space-y-1.5 text-center">
            <button
              disabled
              className="w-full py-3 px-4 rounded-full bg-ink/10 text-ink-40 font-heading font-bold text-xs uppercase tracking-wider cursor-not-allowed"
            >
              {badgeStyle === 'sold-out' ? t('product.sold_out') : t('product.out_of_stock')}
            </button>
            {onNotifyClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNotifyClick(product);
                }}
                className="text-xs font-semibold text-leaf hover:underline cursor-pointer block w-full text-center py-1"
              >
                {t('product.notify')}
              </button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <a
              href={`#/products/${product.slug}`}
              className="w-full inline-block py-3 px-4 rounded-full border border-ink/20 text-ink font-heading font-bold text-xs uppercase tracking-wider hover:bg-sand transition-colors text-center"
            >
              {t('product.view_details')}
            </a>
          </div>
        )}

        {/* View product link that appears on hover */}
        <div className="mt-2 text-center">
          <span className="inline-flex items-center gap-1 text-[11px] font-heading font-semibold text-leaf group-hover:opacity-100 opacity-60 transition-opacity">
            {t('product.view_product')}{' '}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>

      <EmiInfoModal isOpen={showEmiModal} onClose={() => setShowEmiModal(false)} />
    </article>
  );
};
