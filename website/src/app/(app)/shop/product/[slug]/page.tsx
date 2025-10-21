// app/shop/product/[slug]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "./detail.module.css";
import QuantityBuy from "./QuantityBuy"; // 장바구니 or 수량 조절용 컴포넌트

type Product = {
  id: string;
  name: string;
  slug: string;
  filename?: string;
  price?: number;
  color?: string;
  size?: string;
  category?: { name: string };
};

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_API_URL;

  // ✅ slug 기준으로 상품 1개만 검색
  const res = await fetch(
    `${base}/api/shopProducts?where[slug][equals]=${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return notFound();

  const data = await res.json();
  const product: Product | undefined = data.docs?.[0];
  if (!product) return notFound();

  // ✅ 이미지 경로
  const imageUrl = product.filename
    ? `/media/products/${product.filename}`
    : null;

  return (
    <div className={styles.wrap}>
      <p className={styles.description}>
        SHOP &gt; {product.category?.name || "UNCATEGORIZED"}
      </p>

      {/* 이미지 영역 */}
      <div className={styles.gallery}>
        <div className={styles.thumb}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes='(max-width: 1024px) 90vw, 600px'
              className={styles.img}
              priority
              unoptimized
            />
          ) : (
            <div className={styles.noImage}>No Image</div>
          )}
        </div>
      </div>

      {/* 제품 정보 영역 */}
      <div className={styles.info}>
        <h1 className={styles.title}>{product.name}</h1>

        {product.price && (
          <p className={styles.price}>
            {product.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        )}

        {(product.color || product.size) && (
          <div className={styles.badges}>
            {product.color && (
              <span className={styles.badge}>COLOR: {product.color}</span>
            )}
            {product.size && (
              <span className={styles.badge}>SIZE: {product.size}</span>
            )}
          </div>
        )}

        <QuantityBuy productId={product.slug} />
      </div>
    </div>
  );
}
