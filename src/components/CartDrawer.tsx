import React, { useEffect } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ImagePlaceholder } from './ImagePlaceholder';
import { useLanguage } from '../context/LanguageContext';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, totalItems } =
    useCart();
  const { t } = useLanguage();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-ink/60 backdrop-blur-xs transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-white text-ink flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 bg-sand border-b border-ink/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-leaf" />
              <h2
                id="cart-drawer-heading"
                className="font-heading font-bold text-lg uppercase tracking-wider text-ink"
              >
                {t('topbar.cart')} ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-ink-60 hover:text-ink hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center text-ink-40">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg uppercase text-ink">
                    {t('cart.empty_title')}
                  </h3>
                  <p className="mt-1 text-sm text-ink-60">{t('cart.empty_desc')}</p>
                </div>
                <a
                  href="#/products/coldeasy-box"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-3 rounded-full bg-leaf text-white font-heading font-semibold text-xs uppercase tracking-wider hover:bg-leaf/90 transition-all cursor-pointer"
                >
                  {t('cart.shop_btn')}
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 sm:p-4 rounded-[20px] bg-sand/60 border border-ink/5"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-sand flex items-center justify-center">
                      {item.product.images.main.url ? (
                        <img
                          src={item.product.images.main.url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImagePlaceholder
                          label={item.product.name}
                          className="w-full h-full p-2 text-[9px]"
                          aspectRatio="aspect-square"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-heading font-bold text-sm text-ink truncate">
                            {item.product.name}
                          </h4>
                          <span className="font-heading font-bold text-sm text-leaf">
                            {item.product.price !== null
                              ? `₹${item.product.price.toLocaleString('en-IN')}`
                              : '—'}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-ink-40 hover:text-chilli p-1 transition-colors cursor-pointer"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-ink-40/50 rounded-full bg-white px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-ink hover:text-leaf transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-semibold font-heading text-ink">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-ink hover:text-leaf transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                            disabled={item.quantity >= 10}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-semibold font-heading text-ink">
                          {item.product.price !== null
                            ? `₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-sand/40 border-t border-ink/10 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-ink-60">{t('cart.subtotal')}</span>
                <span className="font-heading font-bold text-lg text-ink">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-xs text-ink-40 text-center">
                Shipping and taxes calculated at checkout
              </p>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  window.location.hash = '#/checkout';
                }}
                className="w-full py-3.5 px-6 rounded-full bg-leaf text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-leaf/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {t('cart.proceed_checkout')}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs font-heading font-semibold uppercase tracking-wider pt-2">
                <a
                  href="#cart"
                  onClick={() => setIsCartOpen(false)}
                  className="text-ink hover:text-leaf underline underline-offset-4"
                >
                  View cart
                </a>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-ink-60 hover:text-ink cursor-pointer"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
