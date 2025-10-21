"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider"; // ✅ 추가
import styles from "./detail.module.css";
import { useSidebar } from "../../../../../components/sidebar/SidebarProvider";
import { useCart } from "@/components/CartProvider";

export default function QuantityBuy({ productId }: { productId: string }) {
  const [qty, setQty] = useState(1);
  const [checked, setChecked] = useState(false);
  const [policyError, setPolicyError] = useState(false);
  const [openCare, setOpenCare] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);
  const [openPolicy, setOpenPolicy] = useState(false);
  const { refreshCart } = useCart();

  const { user } = useAuth(); // ✅ 로그인 여부 확인용
  const { openRight } = useSidebar();

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // 1️⃣ Studio Policy 체크 여부 확인
    if (!checked) {
      setPolicyError(true);
      return;
    }
    setPolicyError(false);

    // 2️⃣ 로그인 여부 확인 (user 기반)
    if (!user) {
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Please sign in to continue." })
      );
      openRight("login");
      return;
    }

    // 3️⃣ 서버에 장바구니 추가 요청
    try {
      const res = await fetch("/api/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ✅ 이제 Authorization 헤더 필요 없음 (세션 쿠키 기반)
        },
        body: JSON.stringify({ productId, quantity: qty }),
        credentials: "include", // ✅ 세션 쿠키 포함
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ 여기가 핵심
        await refreshCart(); // 전역 cart 갱신
        setChecked(false); // policy 체크 해제
        openRight("cart"); // 사이드바 열기
        window.dispatchEvent(
          new CustomEvent("toast", { detail: "Item added to your cart!" })
        );
      } else {
        window.dispatchEvent(
          new CustomEvent("toast", {
            detail: data.message || "Failed to add to cart.",
          })
        );
      }
    } catch (err) {
      console.error(err);
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Server error. Please try again." })
      );
    }
  };

  const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!checked) {
      setPolicyError(true);
      return;
    }
    setPolicyError(false);

    if (!user) {
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Please sign in to continue." })
      );
      openRight("login");
      return;
    }

    try {
      const res = await fetch("/api/checkout-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity: qty }),
      });
      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url; // ✅ Stripe 결제 페이지로 이동
      } else {
        window.dispatchEvent(
          new CustomEvent("toast", {
            detail: data.message || "Checkout failed.",
          })
        );
      }
    } catch (err) {
      console.error(err);
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Server error. Please try again." })
      );
    }
  };

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

      <div className={styles.divider} />

      {/* ─── Return & Exchange Policy ─── */}
      <div
        className={styles.policy}
        onClick={() => setOpenReturn((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        <p>Return and Exchange Policy</p>
        <div className={styles.expandWrap}>
          <span
            className={`${styles.expand} ${openReturn ? styles.hide : styles.show}`}
          >
            +
          </span>
          <span
            className={`${styles.expand} ${openReturn ? styles.show : styles.hide}`}
          >
            –
          </span>
        </div>
      </div>
      {openReturn && (
        <div
          className={`${styles.accordionContent} ${openReturn ? styles.open : ""}`}
        >
          <p>
            If you’re not satisfied with your order, we are happy to offer you
            store credit. At this time, we do not issue refunds for orders.
          </p>
          <p>
            Each CRML piece is a one-of-a-kind, handcrafted work of art,
            meticulously inspected for quality.
          </p>
          <p>
            We kindly ask for your understanding that returns or exchanges
            cannot be accommodated for change-of-mind purchases.
          </p>
          <ul>
            <li>
              Return Request: Returns must be requested within 2 days of
              receiving your order.
            </li>
            <li>
              Return Conditions: Only unused and unwashed items are eligible for
              return within 10 days of receipt. Items must be returned in their
              original packaging.
            </li>
            <li>
              Non-returnable Items (Final Sale): Sale items, items purchased
              with coupons, pre-order items, and final sale items.
            </li>
          </ul>
        </div>
      )}

      {/* ─── How to Care ─── */}
      <div
        className={styles.howtocare}
        onClick={() => setOpenCare((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        <p>How to Care</p>
        <div className={styles.expandWrap}>
          <span
            className={`${styles.expand} ${openCare ? styles.hide : styles.show}`}
          >
            +
          </span>
          <span
            className={`${styles.expand} ${openCare ? styles.show : styles.hide}`}
          >
            –
          </span>
        </div>
      </div>
      {openCare && (
        <div
          className={`${styles.accordionContent} ${openCare ? styles.open : ""}`}
        >
          <p>
            For ceramic, wood, and lacquerware items, please clean them gently
            using a soft cloth or sponge.
          </p>
          <p>
            Silver-glazed ceramic products are not suitable for use in the
            dishwasher, microwave, or oven. Over time, discoloration may occur.
            In such cases, please use a silver polish or polishing cloth to
            gently restore their shine.
          </p>
        </div>
      )}

      {/* ─── Studio Policy ─── */}
      <div
        className={styles.policy}
        onClick={() => setOpenPolicy((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        <p>Studio Policy</p>
        <div className={styles.expandWrap}>
          <span
            className={`${styles.expand} ${openPolicy ? styles.hide : styles.show}`}
          >
            +
          </span>
          <span
            className={`${styles.expand} ${openPolicy ? styles.show : styles.hide}`}
          >
            –
          </span>
        </div>
      </div>
      {openPolicy && (
        <div
          className={`${styles.accordionContent} ${openPolicy ? styles.open : ""}`}
        >
          <p>
            Each CRML piece is a carefully handcrafted artwork, thoroughly
            inspected for quality. Due to the nature of ceramic materials and
            the handmade process, variations in shape, size, and color may
            occur, and fine crackles may appear over time.
          </p>
          <p>
            For silver-glazed pieces, brush strokes may differ from piece to
            piece. Please note that actual colors may also vary depending on
            your monitor settings.
          </p>
          <p>
            These characteristics are considered part of the unique nature of
            each item and are not grounds for returns or exchanges.
          </p>
        </div>
      )}

      <div className={styles.divider} />

      {/* ✅ Policy Check */}
      <div className={styles.policy}>
        <p>Check</p>
        <p>I have read and agree to the studio policy</p>
        <input
          type='checkbox'
          className={styles.checkbox}
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
            setPolicyError(false);
          }}
        />
      </div>

      {policyError && (
        <p className={styles.errorText}>
          Please agree to the Studio Policy before proceeding.
        </p>
      )}

      <div className={styles.divider} />

      {/* ✅ 버튼 그룹 */}
      <div className={styles.buttonGroup}>
        <button className={styles.buy} onClick={handleAddToCart}>
          ADD TO CART
        </button>

        <button className={styles.buyNow} onClick={handleCheckout}>
          BUY NOW
        </button>
      </div>
    </>
  );
}
