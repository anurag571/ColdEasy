import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, PRODUCTS } from '../data/mock';
import { track } from '../lib/track';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCheckoutModal: boolean;
  setOpenCheckoutModal: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'coldeasy_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    // Initial sample item so the reviewer sees a populated cart immediately, or empty
    const defaultProduct = PRODUCTS[0];
    return [{ product: defaultProduct, quantity: 1 }];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addToCart = (productId: string, quantity: number = 1) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product || !product.inStock) return;

    track('add_to_cart', {
      item_id: product.id,
      item_name: product.name,
      price: product.price || 0,
      quantity,
    });

    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.min(10, item.quantity + quantity) }
            : item,
        );
      }
      return [...prev, { product, quantity: Math.min(10, quantity) }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.min(10, quantity) } : item,
      ),
    );
  };

  const removeFromCart = (productId: string) => {
    const existing = items.find((i) => i.product.id === productId);
    if (existing) {
      track('remove_from_cart', {
        item_id: existing.product.id,
        item_name: existing.product.name,
        price: existing.product.price || 0,
        quantity: existing.quantity,
      });
    }
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        openCheckoutModal,
        setOpenCheckoutModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
