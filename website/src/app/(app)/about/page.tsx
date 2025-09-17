import styles from "./page.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <p className={styles.description}>ABOUT CRML</p>
      <div className={styles.content}>
        <p>
          Carmel Studio is a curated space where a workshop meets a concept
          store. Through classes in lacquerware, kintsugi, and marbling, the
          studio explores —the subtle beauty of everyday life—and Wabi-Sabi,
          where imperfection reveals depth and harmony.
        </p>
        <p>
          Featuring works from Korean, Japanese, and American artists, each
          piece is carefully curated by the owner’s distinctive sense of style,
          offering objects and artworks that turn even the simplest moments into
          something special.
        </p>
      </div>
    </div>
  );
}
