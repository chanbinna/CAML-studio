// app/shop/category/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import styles from "../../page.module.css";

type Product = {
  id: string;
  name: string;
  slug: string;
  filename?: string;
  price?: number;
  category?: { name: string };
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ Promise 해제
  const base = process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_API_URL;

  // ✅ 카테고리 slug 기준으로 필터링
  const res = await fetch(
    `${base}/api/shopProducts?where[category.slug][equals]=${slug}&sort=createdAt`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div className={styles.container}>
        <p className={styles.description}>SHOP &gt; UNKNOWN CATEGORY</p>
        <p className={styles.emptyMessage}>⚠️ Failed to load category.</p>
      </div>
    );
  }

  const data = await res.json();
  const products: Product[] = data.docs || [];

  const categoryName = products[0]?.category?.name || slug;

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        SHOP &gt; {categoryName.toUpperCase()}
      </p>

      {products.length === 0 ? (
        <div className={styles.emptyMessage}>
          <p>No items have been added to this category yet.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((p) => {
            const imageUrl = p.filename
              ? `/media/products/${p.filename}`
              : null;

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
      )}
    </div>
  );
}
