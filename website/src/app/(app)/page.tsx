// app/page.tsx
import HomeClient from "./HomeClient";
import styles from "./page.module.css";

interface FrontBanner {
  id: string;
  alt?: string;
  filename: string;
  url?: string;
}

interface FrontBannerResponse {
  docs: FrontBanner[];
}

export default async function Home() {
  const res = await fetch(
    `${process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_API_URL}/api/front-banners?sort=createdAt`,
    {
      cache: "no-store", // ✅ 항상 최신 데이터
    }
  );

  let images: string[] = [];

  if (res.ok) {
    const data = (await res.json()) as FrontBannerResponse;

    // ✅ 타입 안정성 확보
    images = data.docs.map((banner) => `/media/${banner.filename}`);
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
