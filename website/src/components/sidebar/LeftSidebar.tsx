import styles from "./Sidebars.module.css";
import LeftSidebarClient, { Category } from "./LeftSidebarClient";

export default async function LeftSidebar() {
  const base = process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_API_URL;

  let shopCategories: Category[] = [];
  let workshopCategories: Category[] = [];

  try {
    // ✅ shopCategories 그대로 유지, workshops 로 변경
    const [shopRes, workshopRes] = await Promise.all([
      fetch(`${base}/api/shopCategories?sort=createdAt`, { cache: "no-store" }),
      fetch(`${base}/api/workshops?sort=createdAt`, { cache: "no-store" }), // ✅ 수정된 부분
    ]);

    if (shopRes.ok) {
      const shopData = await shopRes.json();
      shopCategories = shopData.docs || [];
    }

    if (workshopRes.ok) {
      const workshopData = await workshopRes.json();

      // ✅ workshop 데이터에서 name, slug만 추출해 사이드바에 전달
      workshopCategories = (workshopData.docs || []).map((w: any) => ({
        id: w.id,
        name: w.name,
        slug: w.slug,
      }));
    }
  } catch (err) {
    console.error("❌ Failed to fetch categories:", err);
  }

  return (
    <LeftSidebarClient
      shopCategories={shopCategories}
      workshopCategories={workshopCategories}
      styles={styles}
    />
  );
}
