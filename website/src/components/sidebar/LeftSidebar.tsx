// components/LeftSidebar.tsx
import styles from "./Sidebars.module.css";
import LeftSidebarClient, { Category } from "./LeftSidebarClient";

export default async function LeftSidebar() {
  const base = process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_API_URL;

  let categories: Category[] = [];

  try {
    const res = await fetch(`${base}/api/shopCategories?sort=createdAt`, {
      cache: "no-store", // ✅ 항상 최신
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    categories = data.docs || [];
  } catch (err) {
    console.error("❌ Failed to fetch categories:", err);
  }

  return (
    <LeftSidebarClient
      categories={categories}
      styles={styles} // css 모듈 전달
    />
  );
}
