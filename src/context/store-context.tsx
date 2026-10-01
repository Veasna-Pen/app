import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Product, PRODUCTS, WELCOME_DEALS, WelcomeDeal } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PromoVoucher {
  code: string;
  percent: number;
  label: string;
}

interface StoreContextType {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  discountAmount: number;
  cartTotal: number;
  hasFreeShipping: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toastMessage: string | null;
  isWelcomePromoOpen: boolean;
  openWelcomePromo: () => void;
  closeWelcomePromo: () => void;
  appliedVoucher: PromoVoucher | null;
  applyWelcomeVoucher: () => void;
  removeVoucher: () => void;
  claimWelcomeDeal: (deal?: WelcomeDeal) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[1] ?? PRODUCTS[0], quantity: 1 },
  ]);
  const [wishlist, setWishlist] = useState<string[]>([PRODUCTS[0].id]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWelcomePromoOpen, setIsWelcomePromoOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<PromoVoucher | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2200);
  }, []);

  const addToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.product.id === product.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }
        return [...prev, { product, quantity }];
      });
      showToast(`Added ${product.name} to bag`);
    },
    [showToast]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        const product = PRODUCTS.find((p) => p.id === productId);
        if (exists) {
          showToast(`Removed from favorites`);
          return prev.filter((id) => id !== productId);
        } else {
          showToast(`Saved ${product?.name ?? 'item'} to favorites`);
          return [...prev, productId];
        }
      });
    },
    [showToast]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const openWelcomePromo = useCallback(() => setIsWelcomePromoOpen(true), []);
  const closeWelcomePromo = useCallback(() => setIsWelcomePromoOpen(false), []);

  const applyWelcomeVoucher = useCallback(() => {
    setAppliedVoucher({
      code: 'EXTRA20',
      percent: 20,
      label: 'Extra 20% OFF',
    });
    showToast('🎉 Extra 20% OFF voucher applied!');
  }, [showToast]);

  const removeVoucher = useCallback(() => {
    setAppliedVoucher(null);
    showToast('Voucher removed');
  }, [showToast]);

  const claimWelcomeDeal = useCallback(
    (deal?: WelcomeDeal) => {
      const selected = deal ?? WELCOME_DEALS[1];
      const targetProduct =
        PRODUCTS.find((p) => p.id === selected.productId) ?? PRODUCTS[0];

      setAppliedVoucher({
        code: 'EXTRA20',
        percent: 20,
        label: 'Extra 20% OFF',
      });

      setCart((prev) => {
        const exists = prev.some((item) => item.product.id === targetProduct.id);
        if (exists) return prev;
        return [
          ...prev,
          {
            product: {
              ...targetProduct,
              price: selected.promoPrice,
              priceFormatted: selected.promoPriceFormatted,
            },
            quantity: 1,
          },
        ];
      });

      setIsWelcomePromoOpen(false);
      showToast(`🎉 Extra 20% OFF + ${selected.name} added!`);
    },
    [showToast]
  );

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      Number(
        cart
          .reduce((total, item) => total + item.product.price * item.quantity, 0)
          .toFixed(2)
      ),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    return Number(((cartSubtotal * appliedVoucher.percent) / 100).toFixed(2));
  }, [appliedVoucher, cartSubtotal]);

  const cartTotal = useMemo(
    () => Number(Math.max(0, cartSubtotal - discountAmount).toFixed(2)),
    [cartSubtotal, discountAmount]
  );

  const hasFreeShipping = useMemo(() => {
    return appliedVoucher !== null || cartSubtotal > 0;
  }, [appliedVoucher, cartSubtotal]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        discountAmount,
        cartTotal,
        hasFreeShipping,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isWishlisted,
        isCartOpen,
        openCart,
        closeCart,
        toastMessage,
        isWelcomePromoOpen,
        openWelcomePromo,
        closeWelcomePromo,
        appliedVoucher,
        applyWelcomeVoucher,
        removeVoucher,
        claimWelcomeDeal,
      }}>
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
