"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type ProductInfo = { name: string; category?: string };
const productCache: Record<string, ProductInfo> = {};

async function fetchProductInfo(id: string): Promise<ProductInfo> {
  if (productCache[id]) return productCache[id];
  try {
    const res = await fetch(`/api/shopProducts/${id}`);
    if (!res.ok) throw new Error("Product not found");
    const data = await res.json();
    const doc = data?.doc;
    const name = doc?.name || "Unknown Product";
    const category =
      typeof doc?.category === "object"
        ? doc.category?.name || "Uncategorized"
        : "Uncategorized";
    const info = { name, category };
    productCache[id] = info;
    return info;
  } catch {
    return { name: "Unknown Product", category: "Uncategorized" };
  }
}

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [productInfos, setProductInfos] = useState<Record<string, ProductInfo>>(
    {}
  );
  const [visibleOrders, setVisibleOrders] = useState(5);
  const [visibleWorkshops, setVisibleWorkshops] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const fetchUserWithProducts = async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) return;
      const data = await res.json();
      const userData = data.user;
      setUser(userData);

      const ids: string[] =
        userData.orders?.flatMap((order: any) =>
          order.items.map((item: any) => item.productId)
        ) ?? [];
      const uniqueIds = [...new Set(ids)];

      uniqueIds.forEach(async (id) => {
        const info = await fetchProductInfo(id);
        setProductInfos((prev) => ({ ...prev, [id]: info }));
      });
    };
    fetchUserWithProducts();
  }, []);

  if (!user) return <p className={styles.loading}>Loading...</p>;

  const orders = [...(user.orders || [])].sort(
    (a, b) =>
      new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
  );
  const workshops = [...(user.workshops || [])].sort(
    (a, b) =>
      new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime()
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Orders</h1>

      {/* 🛍️ Shop Orders */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Shop Orders</h2>
        {orders.length > 0 && (
          <>
            <ul className={styles.list}>
              {orders.slice(0, visibleOrders).map((order: any) => (
                <li
                  key={order.orderId}
                  className={styles.card}
                  onClick={() => router.push(`/orders/${order.orderId}`)}
                  style={{ cursor: "pointer" }}
                >
                  <p className={styles.orderId}>Order #{order.orderId}</p>
                  <p>Total: ${order.total?.toFixed(2)}</p>
                  <p>
                    Date:{" "}
                    {new Date(order.purchasedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>

                  <ul className={styles.itemList}>
                    {order.items.map((item: any, i: number) => {
                      const info = productInfos[item.productId];
                      return (
                        <li key={i} className={styles.item}>
                          <span>• {info?.name || "Loading..."} </span>
                          <span>Category: {info?.category}</span>
                          <span>Qty: {item.quantity}</span>
                          <span>${item.price}</span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>

            {/* ✅ 버튼은 주문이 5개 이상일 때만 표시 */}
            {orders.length > 5 &&
              (visibleOrders < orders.length ? (
                <button
                  className={styles.showMore}
                  onClick={() => setVisibleOrders((v) => v + 5)}
                >
                  Show More
                </button>
              ) : (
                <button
                  className={styles.showMore}
                  onClick={() => setVisibleOrders(5)}
                >
                  Show Less
                </button>
              ))}
          </>
        )}
      </section>

      {/* 🎨 Workshop Reservations */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Workshop Reservations</h2>
        {workshops.length === 0 ? (
          <p className={styles.empty}>No workshop reservations yet.</p>
        ) : (
          <>
            <ul className={styles.list}>
              {workshops
                .slice(0, visibleWorkshops)
                .map((ws: any, i: number) => (
                  <li
                    key={i}
                    className={styles.card}
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push(`/orders/workshop/${ws.id}`)} // ✅ 수정 포인트
                  >
                    <p className={styles.workshopName}>{ws.workshopName}</p>
                    <p>Schedule: {ws.schedule}</p>
                    <p>Fee: ${ws.fee}</p>
                    <p>
                      Reserved At:{" "}
                      {new Date(ws.reservedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </li>
                ))}
            </ul>

            {/* ✅ 버튼은 워크숍이 5개 이상일 때만 표시 */}
            {workshops.length > 5 &&
              (visibleWorkshops < workshops.length ? (
                <button
                  className={styles.showMore}
                  onClick={() => setVisibleWorkshops((v) => v + 5)}
                >
                  Show More
                </button>
              ) : (
                <button
                  className={styles.showMore}
                  onClick={() => setVisibleWorkshops(5)}
                >
                  Show Less
                </button>
              ))}
          </>
        )}
      </section>
    </div>
  );
}
