"use client";
import { useAuth } from "@/components/AuthProvider";
import { useSidebar } from "@/components/sidebar/SidebarProvider";
import styles from "./Navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function Navbar() {
  const { openLeft, openRight, leftView, rightView } = useSidebar();
  const { user } = useAuth();
  const { cart } = useCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const keyOpen =
    (fn: () => void) => (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fn();
      }
    };

  // ✅ 현재 활성화된 메뉴 판별 함수
  const isActive = (menu: string) => leftView === menu || rightView === menu;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <ul className={styles.navLinks}>
          <li>
            <Link href='/'>HOME</Link>
          </li>
          <li>
            <Link href='/about'>ABOUT</Link>
          </li>

          <li>
            <a
              onClick={() => openLeft("shop")}
              onKeyDown={keyOpen(() => openLeft("shop"))}
              role='button'
              tabIndex={0}
              className={`${isActive("shop") ? styles.active : ""}`}
            >
              SHOP
            </a>
          </li>

          <li>
            <a
              onClick={() => openLeft("workshop")}
              onKeyDown={keyOpen(() => openLeft("workshop"))}
              role='button'
              tabIndex={0}
              className={`${isActive("workshop") ? styles.active : ""}`}
            >
              WORKSHOP
            </a>
          </li>
        </ul>

        <div className={styles.logoCenter}>
          <Link href='/'>
            <Image
              src='/logo3.png'
              alt='Website Logo'
              width={150}
              height={104}
              quality={100}
              priority
              className={styles.logoImage}
            />
          </Link>
        </div>

        <div className={`${styles.navLinks} ${styles.rightActions}`}>
          {user ? (
            <a
              className={`${styles.actionLink} ${isActive("account") ? styles.active : ""}`}
              onClick={() => openRight("account")}
              onKeyDown={keyOpen(() => openRight("account"))}
              role='button'
              tabIndex={0}
            >
              ACCOUNT
            </a>
          ) : (
            <a
              className={`${styles.actionLink} ${isActive("login") ? styles.active : ""}`}
              onClick={() => openRight("login")}
              onKeyDown={keyOpen(() => openRight("login"))}
              role='button'
              tabIndex={0}
            >
              LOG IN
            </a>
          )}

          <a
            className={`${styles.actionLink} ${isActive("search") ? styles.active : ""}`}
            onClick={() => openRight("search")}
            onKeyDown={keyOpen(() => openRight("search"))}
            role='button'
            tabIndex={0}
          >
            SEARCH
          </a>

          <a
            className={`${styles.actionLink} ${isActive("cart") ? styles.active : ""}`}
            onClick={() => openRight("cart")}
            onKeyDown={keyOpen(() => openRight("cart"))}
            role='button'
            tabIndex={0}
          >
            CART <span className={styles.cartCount}>[{totalCount}]</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
