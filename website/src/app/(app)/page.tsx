// app/page.tsx
import HomeClient from "./HomeClient";
import styles from "./page.module.css";

export default async function Home() {
  const res = await fetch(
    `${process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_API_URL}/api/front-banners?sort=createdAt`,
    {
      cache: "no-store", // ✅ 항상 최신 데이터
    }
  );

  let images: string[] = [];

  if (res.ok) {
    const data = await res.json();
    images = data.docs.map((banner: any) => `/media/${banner.filename}`);
  } else {
    console.error("❌ Failed to fetch banners:", res.status);
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <HomeClient images={images} />
        </div>
      </main>
    </div>
  );
}
