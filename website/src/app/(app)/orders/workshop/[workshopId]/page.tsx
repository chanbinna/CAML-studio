"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "../../page.module.css";

export default function WorkshopDetailPage() {
  const { workshopId } = useParams();
  const router = useRouter();
  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workshopId) return;

    const fetchWorkshop = async () => {
      setLoading(true);
      try {
        // 1️⃣ 유저 예약 데이터에서 workshopId 찾기
        const resUser = await fetch("/api/users/me");
        const userData = await resUser.json();
        const found = userData.user.workshops?.find(
          (ws: any) => ws.id === workshopId
        );
        if (!found) throw new Error("Workshop reservation not found");

        // 2️⃣ workshopId 로 Payload workshop 데이터 요청 (depth=1)
        const base = process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_API_URL;
        const resWorkshop = await fetch(
          `${base}/api/workshops/${found.workshopId}?depth=1`,
          { cache: "no-store" }
        );
        if (!resWorkshop.ok) throw new Error("Workshop not found");

        const workshopData = await resWorkshop.json();

        // 3️⃣ 예약 정보 + 워크숍 문서 병합
        setWorkshop({ ...found, ...workshopData });
      } catch (err) {
        console.error("❌ Workshop detail fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, [workshopId]);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!workshop) return <p className={styles.empty}>Workshop not found.</p>;

  // ✅ 이미지 URL 처리
  const imageUrl = workshop.image?.url?.startsWith("http")
    ? workshop.image.url
    : `${process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_API_URL}${workshop.image?.url || ""}`;

  return (
    <div className={styles.container2}>
      {/* 🔙 뒤로가기 버튼 */}
      <button
        className={styles.showMore}
        onClick={() => router.push("/orders")}
        style={{ marginBottom: "20px" }}
      >
        ← Back to Orders
      </button>

      {/* 🖼️ 이미지 */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={workshop.workshopName || workshop.name}
          className={styles.workshopimage}
        />
      )}

      {/* 🧾 제목 클릭 시 워크숍 페이지로 이동 */}
      <Link
        href={`/workshop/${workshop.slug}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "inline-block",
        }}
      >
        <h1
          className={styles.title}
          style={{
            marginTop: "20px",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#555")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
        >
          {workshop.name || workshop.workshopName}
        </h1>
      </Link>

      <p>Schedule: {workshop.schedule}</p>
      <p>Fee: ${workshop.fee}</p>

      <p>
        Reserved At:{" "}
        {new Date(workshop.reservedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
    </div>
  );
}
