import styles from './page.module.css';

export default function Shop() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Shop</h1>
      <p className={styles.description}>CRML Studio의 제품들을 만나보세요.</p>
      <div className={styles.content}>
        {/* 추후 제품 목록이 들어갈 공간 */}
      </div>
    </div>
  );
}
