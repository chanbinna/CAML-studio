import styles from "./page.module.css";

export default function Gallery() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gallery</h1>
      <p className={styles.description}>CRML Studio의 작품들을 감상해보세요.</p>
      <div className={styles.content}>
        {/* 추후 갤러리 이미지들이 들어갈 공간 */}
      </div>
    </div>
  );
}
