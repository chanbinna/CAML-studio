import styles from './page.module.css';

export default function Policy() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Policy</h1>
      <p className={styles.description}>개인정보처리방침 및 이용약관 페이지입니다.</p>
      <div className={styles.content}>
        {/* 추후 정책 내용이 들어갈 공간 */}
      </div>
    </div>
  );
}
