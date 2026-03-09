import Link from "next/link";
import styles from "./page.module.css";

export const dynamic = "force-dynamic"; // ✅ 항상 최신 데이터 불러오기

export default async function Workshop() {
  const base = process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_API_URL;
  let workshops: any[] = [];

  try {
    const res = await fetch(`${base}/api/workshops?sort=createdAt`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    workshops = data.docs || [];
  } catch (err) {
    console.error("❌ Failed to fetch workshops:", err);
  }

  return (
    <div className={styles.container}>
      {/* 상단 제목 */}
      <h1 className={styles.title}>WORKSHOP</h1>

      {/* 소개 문구 */}
      <p className={styles.description}>
        At CRML Studio, we host marbling workshops that embrace the beauty of
        chance to create uniquely perfect patterns, along with Kintsugi
        workshops where broken and chipped ceramics are thoughtfully restored,
        inviting participants to experience the philosophy and beauty of
        wabi-sabi.
      </p>

      {/* 워크숍 카드 리스트 */}
      <div className={styles.grid}>
        {workshops.map((workshop) => {
          const imageUrl = workshop.image?.url?.startsWith("http")
            ? workshop.image.url
            : `${process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_API_URL}${workshop.image?.url || ""}`;

          return (
            <Link
              key={workshop.id}
              href={`/workshop/${workshop.slug}`} // ✅ slug 기준 이동
              className={styles.card}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={workshop.name}
                  className={styles.image}
                />
              )}
              <h3 className={styles.name}>{workshop.name}</h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
