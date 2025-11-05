"use client";

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

  return (
    <>
      {isAnyOpen && (
        <div
          className={`${styles.overlay} ${isAnyOpen ? styles.open : ""}`}
          onClick={closeAll}
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
      </aside>
    </>
  );
}
