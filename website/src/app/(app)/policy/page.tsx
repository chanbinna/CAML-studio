"use client";

import { useState } from "react";
import styles from "./page.module.css"; // 이 CSS 안에 기존 detail.module.css 스타일 복사 필요!

export default function Policy() {
  const [openReturn, setOpenReturn] = useState(false);
  const [openCare, setOpenCare] = useState(false);
  const [openStudio, setOpenStudio] = useState(false);
  const [openWorkshop, setOpenWorkshop] = useState(false);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CRML POLICY</h1>

      {/* -------------------- Return and Exchange Policy -------------------- */}
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
              <strong>Return Request:</strong> Returns must be requested within
              2 days of receiving your order.
            </li>
            <li>
              <strong>Return Conditions:</strong> Only unused and unwashed items
              are eligible for return within 10 days of receipt. Items must be
              returned in their original packaging.
            </li>
            <li>
              <strong>Non-returnable Items (Final Sale):</strong> Sale items,
              items purchased with coupons, pre-order items, and final sale
              items.
            </li>
          </ul>
        </div>
      )}

      <div className={styles.divider} />

      {/* -------------------- How to Care -------------------- */}
      <div
        className={styles.policy}
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

      <div className={styles.divider} />

      {/* -------------------- Studio Policy -------------------- */}
      <div
        className={styles.policy}
        onClick={() => setOpenStudio((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        <p>Studio Policy</p>
        <div className={styles.expandWrap}>
          <span
            className={`${styles.expand} ${openStudio ? styles.hide : styles.show}`}
          >
            +
          </span>
          <span
            className={`${styles.expand} ${openStudio ? styles.show : styles.hide}`}
          >
            –
          </span>
        </div>
      </div>

      {openStudio && (
        <div
          className={`${styles.accordionContent} ${openStudio ? styles.open : ""}`}
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

      {/* -------------------- Workshop Policy -------------------- */}
      <div
        className={styles.policy}
        onClick={() => setOpenWorkshop((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        <p>Workshop Policy</p>
        <div className={styles.expandWrap}>
          <span
            className={`${styles.expand} ${openWorkshop ? styles.hide : styles.show}`}
          >
            +
          </span>
          <span
            className={`${styles.expand} ${
              openWorkshop ? styles.show : styles.hide
            }`}
          >
            –
          </span>
        </div>
      </div>

      {openWorkshop && (
        <div
          className={`${styles.accordionContent} ${
            openWorkshop ? styles.open : ""
          }`}
        >
          <p>
            All materials needed for the class will be provided. (For the
            Kintsugi class, please bring your own item to repair.) If you want,
            you may bring your own apron.
          </p>
          <p>
            Classes begin on time, so please arrive at least five minutes early.
          </p>
          <p>
            Once your piece is completed, it must be picked up in person at the
            studio.
          </p>
          <p>
            After registration is confirmed, no changes or refunds can be made
            under any circumstances. Please review your schedule carefully
            before registering.
          </p>
          <p>By registering, I acknowledge and agree to the terms above.</p>
        </div>
      )}
    </div>
  );
}
