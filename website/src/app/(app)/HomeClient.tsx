"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function HomeClient({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // ✅ 자동 슬라이드
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  // ✅ 토스트 메시지
  useEffect(() => {
    const msg = localStorage.getItem("toast");
    if (msg) {
      setToast(msg);
      localStorage.removeItem("toast");
      setTimeout(() => setToast(null), 3000);
    }
  }, []);

  if (!images.length) {
    return (
      <div className={styles.grayBox}>
        <p style={{ color: "#fff", fontSize: "20px" }}>Loading banners...</p>
      </div>
    );
  }

  return (
    <div className={styles.grayBox}>
      {toast && <div className={styles.toast}>{toast}</div>}
      <div className={styles.imageWrapper}>
        <Image
          src={images[current]}
          alt={`Slide ${current + 1}`}
          fill
          unoptimized
          className={styles.slideImage}
          priority
        />
      </div>
      <div className={styles.indicators}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${
              current === index ? styles.active : ""
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}
