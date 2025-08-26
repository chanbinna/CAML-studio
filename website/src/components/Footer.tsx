import styles from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <ul>
              <li>
                <Link href='/about'>ABOUT</Link>
              </li>
              <li>
                <Link href='/contact'>CONTACT</Link>
              </li>
              <li>
                <Link
                  href='https://www.instagram.com/crmlstudio/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  INSTAGRAM
                </Link>
              </li>
            </ul>
          </div>

          <div className={`${styles.footerSection} ${styles.sidebar}`}>
            <ul>
              <li>
                <Link href='/policy'>POLICY</Link>
              </li>
              <li>
                <Link href='/workWithUs'>WORK WITH US</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}></div>

          <div className={styles.footerSection}></div>
        </div>

        <div className={styles.footerBottom}>
          <p>CRML Studio &copy; 2025</p>
        </div>

        <div className={styles.cornerLogo}>
          <Link href='/'>
            <Image
              src='/logo2.png'
              alt='CRML Studio Logo'
              width={70}
              height={40}
              className={styles.cornerLogoImage}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
