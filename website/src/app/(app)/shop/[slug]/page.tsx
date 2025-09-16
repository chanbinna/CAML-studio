// app/shop/[slug]/page.tsx
import Image from "next/image";
import styles from "./detail.module.css";
import { notFound } from "next/navigation";
import { products } from "../products";
import QuantityBuy from "./QuantityBuy";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return notFound();

  return (
    <div className={styles.wrap}>
      <p className={styles.description}>SHOP &gt; {product.category}</p>
      <div className={styles.gallery}>
        <div className={styles.thumb}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes='(max-width: 1024px) 90vw, 600px'
            className={styles.img}
            priority
          />
        </div>
      </div>

      <div className={styles.info}>
        <h1 className={styles.title}>{product.name}</h1>
        <p className={styles.price}>
          {" "}
          {product.price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
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

        <QuantityBuy productId={product.id} />
      </div>
    </div>
  );
}
