import styles from './page.module.css';

export default function Contact() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contact</h1>
      <p className={styles.description}>연락처 정보</p>
      <div className={styles.content}>
        <ul className={styles.contactList}>
          <li>Email: info@crmlstudio.com</li>
          <li>Phone: +82 10-1234-5678</li>
          <li>Address: Seoul, Korea</li>
        </ul>
      </div>
    </div>
  );
}
