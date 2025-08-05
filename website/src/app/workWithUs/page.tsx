import styles from './page.module.css';

export default function WorkWithUs() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Work With Us</h1>
      <p className={styles.description}>CRML Studio와 함께 일하고 싶으신가요? 채용 및 협업 정보를 확인하세요.</p>
      <div className={styles.content}>
        {/* 추후 채용 정보가 들어갈 공간 */}
      </div>
    </div>
  );
}
