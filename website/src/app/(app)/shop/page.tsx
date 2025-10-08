// app/shop/page.tsx
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

type Product = {
  id: string;
  name: string;
  slug: string;
  filename?: string;
  price?: number;
  image?: { url: string };
  category?: { name: string };
};

export default async function Shop() {
  const base = process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${base}/api/shopProducts?sort=createdAt`, {
    cache: "no-store",
  });

  const data = await res.json();
  const products: Product[] = data.docs || [];

  return (
    <div className={styles.container}>
      <p className={styles.description}>SHOP &gt; ALL</p>

      <div className={styles.grid}>
        {products.map((p) => {
          const imageUrl = `/media/products/${p.filename}`;

          return (
            <Link
              key={p.id}
              href={`/shop/product/${p.slug}`}
              className={styles.card}
            >
              <div className={styles.thumbWrap}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={p.name}
                    fill
                    sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 250px'
                    className={styles.thumb}
                    priority
                    unoptimized
                  />
                ) : (
                  <div className={styles.thumbPlaceholder}>No Image</div>
                )}
              </div>
              <div className={styles.meta}>
                <div className={styles.nameRow}>{p.name}</div>
                {p.price && (
                  <div className={styles.price}>${p.price.toFixed(2)}</div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
