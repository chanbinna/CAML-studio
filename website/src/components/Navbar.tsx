"use client";
import styles from "./Navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/components/sidebar/SidebarProvider";

export default function Navbar() {
  const { openLeft, openRight } = useSidebar();

  const keyOpen =
    (fn: () => void) => (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fn();
      }
    };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <ul className={styles.navLinks}>
          <li>
            <Link href='/'>HOME</Link>
          </li>

          <li>
            <a
              onClick={() => openLeft("shop")}
              onKeyDown={keyOpen(() => openLeft("shop"))}
              role='button'
              tabIndex={0}
              style={{ cursor: "pointer" }}
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
              style={{ cursor: "pointer" }}
            >
              WORKSHOP
            </a>
          </li>

          <li>
            <Link href='/gallery'>GALLERY</Link>
          </li>
        </ul>

        <div className={styles.logoCenter}>
          <Link href='/'>
            <Image
              src='/logo2.png'
              alt='Website Logo'
              width={160.8}
              height={87.6}
              quality={100}
              priority
              className={styles.logoImage}
            />
          </Link>
        </div>

        <div className={`${styles.navLinks} ${styles.rightActions}`}>
          <a
            className={styles.actionLink}
            onClick={() => openRight("login")}
            onKeyDown={keyOpen(() => openRight("login"))}
            role='button'
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            LOG IN
          </a>

          <a
            className={styles.actionLink}
            onClick={() => openRight("search")}
            onKeyDown={keyOpen(() => openRight("search"))}
            role='button'
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            SEARCH
          </a>

          <a
            className={styles.actionLink}
            onClick={() => openRight("cart")}
            onKeyDown={keyOpen(() => openRight("cart"))}
            role='button'
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            CART <span className={styles.cartCount}>[0]</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
