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

      <svg viewBox='0 0 18 17' xmlns='http://www.w3.org/2000/svg'>
        <g
          transform='translate(1 1)'
          stroke='currentColor'
          fill='none'
          stroke-linecap='square'
        >
          <path d='M16 16l-5.0752-5.0752'></path>
          <circle cx='6.4' cy='6.4' r='6.4'></circle>
        </g>
      </svg>

      <svg viewBox='0 0 17 20' fill='none'>
        <path
          d='M0 20V4.995l1 .006v.015l4-.002V4c0-2.484 1.274-4 3.5-4C10.518 0 12 1.48 12 4v1.012l5-.003v.985H1V19h15V6.005h1V20H0zM11 4.49C11 2.267 10.507 1 8.5 1 6.5 1 6 2.27 6 4.49V5l5-.002V4.49z'
          fill='currentColor'
        />
      </svg>
      <svg
        viewBox='0 0 20 14'
        role='presentation'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M0 14v-1h20v1H0zm0-7.5h20v1H0v-1zM0 0h20v1H0V0z'
          fill='currentColor'
        ></path>
      </svg>
      <svg
        viewBox='0 0 16 14'
        role='presentation'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M15 0L1 14m14 0L1 0' stroke='currentColor' fill='none'></path>
      </svg>
    </div>
  );
}
