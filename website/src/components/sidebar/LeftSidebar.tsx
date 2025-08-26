"use client";
import { useSidebar } from "./SidebarProvider";
import styles from "./Sidebars.module.css";
import Link from "next/link";

export default function LeftSidebar() {
  const { leftView, closeAll, isAnyOpen } = useSidebar();

  return (
    <>
      {/* Overlay */}
      {isAnyOpen && (
        <div className={styles.overlay} onClick={closeAll} aria-hidden='true' />
      )}

      {/* Panel */}
      <aside
        data-sidebar-panel
        className={`${styles.panel} ${styles.left} ${
          leftView ? styles.open : ""
        }`}
        role='dialog'
        aria-modal='true'
        aria-label='Left sidebar'
        onPointerDown={(e) => e.stopPropagation()}
      >
        {leftView === "shop" && <ShopMenu />}
        {leftView === "workshop" && <WorkshopMenu />}
      </aside>
    </>
  );
}

function ShopMenu() {
  return (
    <div className={styles.content}>
      <ul>
        <li>
          <Link href='/shop/all'>SHOP ALL</Link>
        </li>
        <li>
          <Link href='/shop/ceramic'>CERAMIC</Link>
        </li>
        <li>
          <Link href='/shop/wood'>WOOD</Link>
        </li>
        <li>
          <Link href='/shop/lacquer'>LACQUER</Link>
        </li>
        <li>
          <Link href='/shop/glass'>GLASS</Link>
        </li>
        <li>
          <Link href='/shop/artsncraft'>ARTS &amp; CRAFT</Link>
        </li>
      </ul>
    </div>
  );
}

function WorkshopMenu() {
  return (
    <div className={styles.content}>
      <ul>
        <li>
          <Link href='/workshop/lacquer'>LACQUER</Link>
        </li>
        <li>
          <Link href='/workshop/kintsugi'>KINTSUGI</Link>
        </li>
        <li>
          <Link href='/workshop/marbling'>MARBLING</Link>
        </li>
      </ul>
    </div>
  );
}
