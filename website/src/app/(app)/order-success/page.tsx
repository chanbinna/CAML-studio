// app/order-success/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./success.module.css";

export default function OrderSuccess() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // ✅ 최근 주문 가져오기 (로그인 유저 기준)
    const fetchOrder = async () => {
      try {
        const res = await fetch("/api/login-users/me", {
          credentials: "include",
        });
        const data = await res.json();
        const latestOrder = data?.user?.orders?.[data.user.orders.length - 1];
        setOrder(latestOrder);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      }
    };
    fetchOrder();
  }, []);

  if (!order) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Payment Successful!</h1>
        <p>Your order is being processed...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Payment Successful!</h1>
      <p className={styles.thankyou}>
        Thank you for your purchase at <strong>CRML Studio</strong>.
      </p>

      <div className={styles.card}>
        <p>
          <strong>Order ID:</strong> {order.orderId}
        </p>
        <p>
          <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.purchasedAt).toLocaleString()}
        </p>
      </div>

      <div className={styles.items}>
        {order.items.map((item: any, i: number) => (
          <div key={i} className={styles.item}>
            <p>{item.productId}</p>
            <p>Qty: {item.quantity}</p>
            <p>${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Link href='/shop' className={styles.btn}>
          Continue Shopping
        </Link>
        <Link href='/orders' className={styles.btnSecondary}>
          View My Orders
        </Link>
      </div>
    </div>
  );
}
