import styles from "./page.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <p className={styles.description}>ABOUT TEXT</p>
      <div className={styles.content}>
        {/* 추후 회사 소개 내용이 들어갈 공간 */}
      </div>
    </div>
  );
}
