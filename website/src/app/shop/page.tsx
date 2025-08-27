// app/shop/page.tsx
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { products, type Product } from "./products";

export default function Shop() {
  return (
    <div className={styles.container}>
      <p className={styles.description}>SHOP &gt; ALL</p>

      <div className={styles.grid}>
        {products.map((p: Product) => (
          <Link key={p.id} href={`/shop/${p.slug}`} className={styles.card}>
            <div className={styles.thumbWrap}>
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 250px'
                className={styles.thumb}
                priority
              />
            </div>
            <div className={styles.meta}>
              <div className={styles.nameRow}>{p.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
