import styles from "./Navbar.module.css";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <ul className={styles.navLinks}>
          <li>
            <a href='/'>HOME</a>
          </li>
          <li>
            <a href='/about'>SHOP</a>
          </li>
          <li>
            <a href='/services'>WORKSHOP</a>
          </li>
          <li>
            <a href='/contact'>GALLERY</a>
          </li>
        </ul>

        <div className={styles.logoCenter}>
          <a href='/'>
            <Image
              src='/logo2.png'
              alt='Website Logo'
              width={160.8}
              height={87.6}
              quality={100}
              priority
              className={styles.logoImage}
            />
          </a>
        </div>

        <div className={`${styles.navLinks} ${styles.rightActions}`}>
          <a href='/login' className={styles.actionLink}>
            LOG IN
          </a>
          <a href='/search' className={styles.actionLink}>
            SEARCH
          </a>
          <a href='/cart' className={styles.actionLink}>
            CART <span className={styles.cartCount}>[0]</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
