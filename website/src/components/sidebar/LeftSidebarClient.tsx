"use client";

import { useState } from "react";
import Link from "next/link";
import { useSidebar } from "./SidebarProvider";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function LeftSidebarClient({
  shopCategories,
  workshopCategories,
  styles,
}: {
  shopCategories: Category[];
  workshopCategories: Category[];
  styles: { [key: string]: string };
}) {
  const { leftView, closeAll, isAnyOpen } = useSidebar();

  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);

  const toggleSubMenu = (menu: string) => {
    setMobileSubMenu(mobileSubMenu === menu ? null : menu);
  };

  const handleClose = () => {
    setMobileSubMenu(null);
    closeAll();
  };

  return (
    <>
      {isAnyOpen && (
        <div
          className={`${styles.overlay} ${isAnyOpen ? styles.open : ""}`}
          onClick={handleClose}
          aria-hidden='true'
        />
      )}

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
        {/* SHOP MENU */}
        {leftView === "shop" && (
          <div
            className={`${styles.content} ${
              shopCategories.length ? styles.loaded : styles.loading
            }`}
          >
            <ul>
              <li>
                <Link href='/shop' onClick={closeAll}>
                  SHOP ALL
                </Link>
              </li>
              {shopCategories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/shop/category/${cat.slug}`} onClick={closeAll}>
                    {cat.name.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* WORKSHOP MENU */}
        {leftView === "workshop" && (
          <div
            className={`${styles.content} ${
              workshopCategories.length ? styles.loaded : styles.loading
            }`}
          >
            <ul>
              <li>
                <Link href='/workshop' onClick={closeAll}>
                  ALL WORKSHOP
                </Link>
              </li>
              {workshopCategories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/workshop/${cat.slug}`} onClick={closeAll}>
                    {cat.name.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* MOBILE MENU */}
        {leftView === "menu" && (
          <div className={styles.content}>
            <ul className={styles.mobileMenuList}>
              {/* ABOUT */}
              <li className={styles.mobileMenuItem}>
                <Link href='/about' onClick={handleClose}>
                  ABOUT
                </Link>
              </li>

              {/* SHOP */}
              <li className={styles.mobileMenuItem}>
                <div className={styles.menuRow}>
                  <Link href='/shop' onClick={handleClose}>
                    SHOP
                  </Link>
                  <button
                    className={`${styles.expandBtn} ${
                      mobileSubMenu === "shop" ? styles.expanded : ""
                    }`}
                    onClick={() => toggleSubMenu("shop")}
                    aria-label='Toggle shop submenu'
                  >
                    +
                  </button>
                </div>

                <ul
                  className={`${styles.inlineSubMenu} ${
                    mobileSubMenu === "shop" ? styles.inlineSubMenuOpen : ""
                  }`}
                >
                  <li>
                    <Link href='/shop' onClick={handleClose}>
                      SHOP ALL
                    </Link>
                  </li>
                  {shopCategories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/shop/category/${cat.slug}`}
                        onClick={handleClose}
                      >
                        {cat.name.toUpperCase()}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* WORKSHOP */}
              <li className={styles.mobileMenuItem}>
                <div className={styles.menuRow}>
                  <Link href='/workshop' onClick={handleClose}>
                    WORKSHOP
                  </Link>
                  <button
                    className={`${styles.expandBtn} ${
                      mobileSubMenu === "workshop" ? styles.expanded : ""
                    }`}
                    onClick={() => toggleSubMenu("workshop")}
                    aria-label='Toggle workshop submenu'
                  >
                    +
                  </button>
                </div>

                <ul
                  className={`${styles.inlineSubMenu} ${
                    mobileSubMenu === "workshop" ? styles.inlineSubMenuOpen : ""
                  }`}
                >
                  <li>
                    <Link href='/workshop' onClick={handleClose}>
                      ALL WORKSHOP
                    </Link>
                  </li>
                  {workshopCategories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/workshop/${cat.slug}`}
                        onClick={handleClose}
                      >
                        {cat.name.toUpperCase()}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        )}
      </aside>
    </>
  );
}
