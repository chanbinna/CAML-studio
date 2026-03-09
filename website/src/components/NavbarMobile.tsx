"use client";

import { useSidebar } from "@/components/sidebar/SidebarProvider";
import { useCart } from "@/components/CartProvider";
import Image from "next/image";
import styles from "./Navbar.module.css";

export default function NavbarMobile() {
  const { openLeft, closeAll, leftView, openRight } = useSidebar();
  const { cart } = useCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isMenuOpen = leftView === "menu";

  return (
    <nav className={styles.mobileNav}>
      {/* 왼쪽 햄버거/X 메뉴 */}
      <button
        data-sidebar-trigger
        className={`${styles.mobileIcon} ${isMenuOpen ? styles.menuOpen : ""}`}
        onClick={() => {
          if (isMenuOpen) {
            closeAll();
          } else {
            openLeft("menu");
          }
        }}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <svg
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
          className={styles.menuSvg}
        >
          {/* Top line → becomes top-left to center diagonal */}
          <line
            x1='1'
            y1='5'
            x2='19'
            y2='5'
            stroke='currentColor'
            strokeWidth='1.2'
            strokeLinecap='round'
            className={`${styles.line} ${styles.lineTop}`}
          />
          {/* Middle line → stays but fades out */}
          <line
            x1='1'
            y1='10'
            x2='19'
            y2='10'
            stroke='currentColor'
            strokeWidth='1.2'
            strokeLinecap='round'
            className={`${styles.line} ${styles.lineMid}`}
          />
          {/* Bottom line → becomes bottom-left to center diagonal */}
          <line
            x1='1'
            y1='15'
            x2='19'
            y2='15'
            stroke='currentColor'
            strokeWidth='1.2'
            strokeLinecap='round'
            className={`${styles.line} ${styles.lineBot}`}
          />
        </svg>
      </button>

      {/* 가운데 로고 */}
      <div className={styles.mobileLogo}>
        <Image src='/logo3.png' alt='Logo' width={90} height={62} priority />
      </div>

      {/* 오른쪽 아이콘들 */}
      <div className={styles.mobileRight}>
        <button
          className={styles.mobileIcon}
          onClick={() => openRight("search")}
          aria-label='Search'
        >
          <svg viewBox='0 0 18 17' xmlns='http://www.w3.org/2000/svg'>
            <g
              transform='translate(1 1)'
              stroke='currentColor'
              fill='none'
              strokeLinecap='square'
            >
              <path d='M16 16l-5.0752-5.0752'></path>
              <circle cx='6.4' cy='6.4' r='6.4'></circle>
            </g>
          </svg>
        </button>

        <button
          className={styles.mobileIcon}
          onClick={() => openRight("cart")}
          aria-label='Cart'
        >
          <svg viewBox='0 0 17 20' fill='none'>
            <path
              d='M0 20V4.995l1 .006v.015l4-.002V4c0-2.484 1.274-4 3.5-4C10.518 0 12 1.48 12 4v1.012l5-.003v.985H1V19h15V6.005h1V20H0zM11 4.49C11 2.267 10.507 1 8.5 1 6.5 1 6 2.27 6 4.49V5l5-.002V4.49z'
              fill='currentColor'
            />
          </svg>

          {totalCount > 0 && (
            <span className={styles.cartDot}>{totalCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}
