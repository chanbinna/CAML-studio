import styles from "./page.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.graybox}></div>
      <p className={styles.description}>ABOUT CRML</p>
      <div className={styles.content}>
        <p>
          Carmel Studio is a curated space where a workshop meets a concept
          store. Rooted in the philosophy of Wabi-Sabi, the studio explores the
          subtle beauty of everyday life, where imperfection reveals depth and
          harmony.
        </p>
        <p>
          Showcasing works by a diverse range of artists, Carmel Studio
          thoughtfully curates objects and artworks with a distinctive aesthetic
          sensibility, offering pieces that elevate even the simplest moments
          into something meaningful.
        </p>
      </div>
    </div>
  );
}
