import styles from "./Footer.module.css";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <ul>
              <li>
                <a href='/about'>ABOUT</a>
              </li>
              <li>
                <a href='/contact'>CONTACT</a>
              </li>
              <li>
                <a
                  href='https://www.instagram.com/crmlstudio/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  INSTAGRAM
                </a>
              </li>
            </ul>
          </div>

          <div className={`${styles.footerSection} ${styles.sidebar}`}>
            <ul>
              <li>
                <a href='/policy'>POLICY</a>
              </li>
              <li>
                <a href='/workWithUs'>WORK WITH US</a>
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
          <a href='/'>
            <Image
              src='/logo2.png'
              alt='CRML Studio Logo'
              width={70}
              height={40}
              className={styles.cornerLogoImage}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
