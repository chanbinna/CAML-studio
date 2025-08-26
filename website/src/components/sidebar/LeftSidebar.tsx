"use client";
import { useSidebar } from "./SidebarProvider";
import styles from "./Sidebars.module.css";

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
          <a href='/shop/all'>SHOP ALL</a>
        </li>
        <li>
          <a href='/shop/ceramic'>CERAMIC</a>
        </li>
        <li>
          <a href='/shop/wood'>WOOD</a>
        </li>
        <li>
          <a href='/shop/lacquer'>LACQUER</a>
        </li>
        <li>
          <a href='/shop/glass'>GLASS</a>
        </li>
        <li>
          <a href='/shop/artsncraft'>ARTS &amp; CRAFT</a>
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
          <a href='/workshop/lacquer'>LACQUER</a>
        </li>
        <li>
          <a href='/workshop/kintsugi'>KINTSUGI</a>
        </li>
        <li>
          <a href='/workshop/marbling'>MARBLING</a>
        </li>
      </ul>
    </div>
  );
}
