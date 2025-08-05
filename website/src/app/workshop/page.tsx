import styles from "./page.module.css";

export default function Workshop() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Workshop</h1>
      <p className={styles.description}>
        CRML Studio의 워크샵 프로그램을 소개합니다.
      </p>
      <div className={styles.content}>
        {/* 추후 워크샵 정보가 들어갈 공간 */}
      </div>
    </div>
  );
}
