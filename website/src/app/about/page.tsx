import styles from './page.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About Us</h1>
      <p className={styles.description}>CRML Studio에 대한 소개 페이지입니다.</p>
      <div className={styles.content}>
        {/* 추후 회사 소개 내용이 들어갈 공간 */}
      </div>
    </div>
  );
}
