"use client";

import { useState } from "react";
import styles from "./detail.module.css";
import { useAuth } from "@/components/AuthProvider"; // ✅ 로그인 상태 확인
import { useSidebar } from "@/components/sidebar/SidebarProvider"; // ✅ 로그인 사이드바 열기용

type Workshop = {
  id: string;
  name: string;
  slug: string;
  description: string;
  fee: number;
  scheduleOptions?: { label: string }[];
};

export default function WorkshopDetailClient({
  workshop,
}: {
  workshop: Workshop;
}) {
  const [openReturn, setOpenReturn] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(""); // ✅ 에러 메시지 상태

  const { user } = useAuth(); // ✅ 로그인 여부 확인
  const { openRight } = useSidebar(); // ✅ 사이드바 열기 함수

  // ✅ 예약(결제) 버튼 클릭 핸들러
  const handleReservation = async () => {
    // 에러 초기화
    setErrorMessage("");

    // ✅ 스케줄 미선택 시
    if (!selectedSchedule) {
      setErrorMessage("Please select a workshop schedule before proceeding.");
      return;
    }

    // ✅ 로그인 안되어있으면 로그인 창 열기
    if (!user) {
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Please sign in to continue." })
      );
      openRight("login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout-workshop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          workshopId: workshop.id,
          scheduleLabel: selectedSchedule,
          cancelUrl: window.location.href,
        }),
      });

      const data = await res.json();

      // ✅ 중복 예약 등 서버 에러
      if (res.status === 400) {
        setErrorMessage(
          data.message || "You’ve already reserved this schedule."
        );
        return;
      }

      // ✅ 정상적으로 Stripe 세션 생성
      if (res.ok && data.url) {
        window.location.href = data.url; // Stripe Checkout으로 이동
      } else {
        setErrorMessage(data.message || "Failed to start checkout.");
      }
    } catch (err) {
      console.error("❌ Reservation error:", err);
      setErrorMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.info}>
      <div className={styles.divider} />

      {/* 워크샵 가격 */}
      <div className={styles.priceRow}>
        <p>WORKSHOP FEE</p>
        <p className={styles.price}>
          {workshop.fee.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>

      {/* 리턴 정책 (아코디언) */}
      <div
        className={styles.policy}
        onClick={() => setOpenReturn((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        <p>Workshop Policy</p>
        <div className={styles.expandWrap}>
          <span
            className={`${styles.expand} ${openReturn ? styles.hide : styles.show}`}
          >
            +
          </span>
          <span
            className={`${styles.expand} ${openReturn ? styles.show : styles.hide}`}
          >
            –
          </span>
        </div>
      </div>

      {openReturn && (
        <div
          className={`${styles.accordionContent} ${openReturn ? styles.open : ""}`}
        >
          <p>
            All materials needed for the class will be provided. (For the
            Kintsugi class, please bring your own item to repair.) If you want,
            you may bring your own apron. Classes begin on time, so please
            arrive at least five minutes early.
          </p>
          <p>
            Once your piece is completed, it must be picked up in person at the
            studio. Please note that after registration is confirmed, no changes
            or refunds can be made under any circumstances. We kindly ask that
            you review your schedule carefully before registering.
          </p>
          <p>By registering, I acknowledge and agree to the terms above.</p>
        </div>
      )}

      {/* 워크샵 일정 선택 */}
      <div className={styles.priceRow}>
        <p>WORKSHOP SCHEDULE</p>
        <select
          className={styles.scheduleSelect}
          value={selectedSchedule}
          onChange={(e) => setSelectedSchedule(e.target.value)}
        >
          <option value='' disabled>
            Select a schedule
          </option>
          {workshop.scheduleOptions?.length ? (
            workshop.scheduleOptions.map((s, idx) => (
              <option key={idx} value={s.label}>
                {s.label}
              </option>
            ))
          ) : (
            <option disabled>No schedules available</option>
          )}
        </select>
      </div>

      <div className={styles.divider} />

      {/* ❌ 에러 메시지 (버튼 위에 빨간색 표시) */}
      {errorMessage && (
        <p className={styles.errorText} style={{ marginBottom: "10px" }}>
          {errorMessage}
        </p>
      )}

      {/* 예약 버튼 */}
      <div className={styles.buttonGroup}>
        <button
          className={styles.buy}
          onClick={handleReservation}
          disabled={loading}
        >
          {loading ? "PROCESSING..." : "RESERVATION"}
        </button>
      </div>
    </div>
  );
}
