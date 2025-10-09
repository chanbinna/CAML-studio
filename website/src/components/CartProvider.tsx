"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  category?: string;
};

type CartContextType = {
  cart: CartItem[];
  loading: boolean;
  refreshCart: () => Promise<void>;
  updateCartLocally: (cart: CartItem[]) => void;
};

const CartContext = createContext<CartContextType>({
  cart: [],
  loading: true,
  refreshCart: async () => {},
  updateCartLocally: () => {},
});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ 최초 1회 로그인 상태에서 cart prefetch
  useEffect(() => {
    refreshCart();
  }, []);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/get-cart", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setCart(data.cart || []);
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCartLocally = (newCart: CartItem[]) => setCart(newCart);

  return (
    <CartContext.Provider
      value={{ cart, loading, refreshCart, updateCartLocally }}
    >
      {children}
    </CartContext.Provider>
  );
}
