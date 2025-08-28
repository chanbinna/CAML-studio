// app/shop/[slug]/QuantityBuy.tsx
"use client";

import { useState } from "react";
import styles from "./detail.module.css";

export default function QuantityBuy({ productId }: { productId: string }) {
  const [qty, setQty] = useState(1);
  const [checked, setChecked] = useState(false);

  return (
    <>
      <p className={styles.quantityText}>QUANTITY</p>
      <div className={styles.quantityBox}>
        <button
          type='button'
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className={styles.qtyBtn}
          aria-label='Decrease quantity'
        >
          –
        </button>
        <span className={styles.qtyValue}>{qty}</span>
        <button
          type='button'
          onClick={() => setQty((q) => q + 1)}
          className={styles.qtyBtn}
          aria-label='Increase quantity'
        >
          +
        </button>
      </div>

      <div
        style={{
          width: "100%",
          height: "1px",
          background: "black",
          margin: "16px 0",
        }}
      />

      <div className={styles.howtocare}>
        <p>How to Care</p>
        <p className={styles.expand}>+</p>
      </div>

      <div className={styles.policy}>
        <p>Studio Policy</p>
        <p className={styles.expand}>+</p>
      </div>

      <div
        style={{
          width: "100%",
          height: "1px",
          background: "black",
          margin: "16px 0",
        }}
      />

      <div className={styles.policy}>
        <p>Check</p>
        <p>I have read and agree to the studio policy</p>
        <input
          type='checkbox'
          className={styles.checkbox}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      </div>

      <div
        style={{
          width: "100%",
          height: "1px",
          background: "black",
          margin: "16px 0",
        }}
      />

      <form action='/api/checkout' method='POST'>
        <button className={styles.buy} type='submit'>
          ADD TO CART
        </button>
      </form>
    </>
  );
}
