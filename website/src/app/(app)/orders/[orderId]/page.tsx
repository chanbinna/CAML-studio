"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../page.module.css";

type ItemDetail = {
  productId: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  thumbnail?: string;
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<ItemDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        const found = data.user.orders?.find((o: any) => o.orderId === orderId);
        setOrder(found);

        if (found) {
          const detailedItems = await Promise.all(
            found.items.map(async (item: any) => {
              const res = await fetch(`/api/shopProducts/${item.productId}`);
              if (!res.ok) throw new Error("Product not found");

              const data = await res.json();
              const doc = data?.doc;

              // ✅ 상품 이미지 추출
              let thumbnail = "/media/products/placeholder.png"; // fallback

              if (doc?.url) {
                // 완전한 URL (예: http://localhost:3000/api/shopProducts/file/product1.png)
                thumbnail = doc.url;
              } else if (doc?.filename) {
                // 정적 파일 경로로 구성
                thumbnail = `/media/products/${doc.filename}`;
              }

              return {
                productId: item.productId,
                name: doc?.name || "Unknown Product",
                category:
                  typeof doc?.category === "object"
                    ? doc.category?.name || "Uncategorized"
                    : "Uncategorized",
                thumbnail,
                price: item.price,
                quantity: item.quantity,
              };
            })
          );

          setItems(detailedItems);
        }
      } catch (err) {
        console.error("❌ Order detail fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!order) return <p className={styles.empty}>Order not found.</p>;

  return (
    <div className={styles.container}>
      <button
        className={styles.showMore}
        onClick={() => router.push("/orders")}
        style={{ marginBottom: "20px" }}
      >
        ← Back to Orders
      </button>

      <h1 className={styles.title}>Order #{order.orderId}</h1>
      <p>Total: ${order.total?.toFixed(2)}</p>
      <p>
        Purchased on:{" "}
        {new Date(order.purchasedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>

      <ul className={styles.list} style={{ marginTop: "20px" }}>
        {items.map((item) => (
          <li key={item.productId} className={styles.card2}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <img
                src={item.thumbnail}
                alt={item.name}
                style={{
                  width: 80,
                  height: 100,
                  objectFit: "cover",
                }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = "/media/products/placeholder.png";
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>
                  <a
                    href={`/shop/product/${item.productId}`} // ✅ 상품 상세 페이지로 이동
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.textDecoration = "none")
                    }
                  >
                    {item.name}
                  </a>
                </p>
                <p>Category: {item.category}</p>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
