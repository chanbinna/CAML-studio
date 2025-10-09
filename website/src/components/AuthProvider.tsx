"use client";
import { createContext, useContext, useEffect, useState } from "react";

/** 카트/주문 타입 */
type CartItem = { productId: string; quantity: number };
type OrderItem = { productId: string; quantity: number; price: number };
type Order = {
  orderId: string;
  items: OrderItem[];
  total: number;
  purchasedAt?: string;
};

/** ✅ 프론트 전역에서 사용할 User 타입 (cart / orders 포함) */
export interface User {
  id: string;
  email: string;
  name?: string;
  lastName?: string;
  cart?: CartItem[];
  orders?: Order[];
}

const AuthContext = createContext<{ user: User | null }>({ user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/login-users/me", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        // data.user 가 cart / orders 포함하도록 API가 내려주고 있어야 함
        setUser(data.user as User);
      } catch (e) {
        console.error("Auth fetch error:", e);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
