// app/order-success/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./success.module.css";

export default function OrderSuccess() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
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

  const addr = order.shippingAddress || {};

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Payment Successful!</h1>
      <p className={styles.thankyou}>
        Thank you for your purchase at <strong>CRML Studio</strong>.
      </p>

      {/* Order Summary */}
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

        {order.shippingAddress && (
          <div style={{ marginTop: "12px" }}>
            <p>
              <strong>Shipping Address:</strong>
            </p>
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && (
              <p>{order.shippingAddress.line2}</p>
            )}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postal_code}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        )}
      </div>

      {/* Items */}
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
