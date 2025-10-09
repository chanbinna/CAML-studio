// src/types/payload.d.ts

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  items: OrderItem[];
  total: number;
  purchasedAt?: string;
}

// ✅ LoginUsers 컬렉션의 User 타입 확장
declare module "payload" {
  interface User {
    name?: string;
    lastName?: string;
    cart?: CartItem[];
    orders?: Order[];
  }
}