"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

const images = ["/page1.jpg", "/page2.jpg", "/page3.jpg", "/page4.jpg"];

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/front-banners?sort=createdAt")
      .then((res) => res.json())
      .then((data) => {
        const urls = data.docs.map(
          (banner: any) => `/media/${banner.filename}`
        );
        setImages(urls);
      });
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    const msg = localStorage.getItem("toast");
    if (msg) {
      setToast(msg);
      localStorage.removeItem("toast"); // prevent repeat
      setTimeout(() => setToast(null), 3000); // auto hide after 3s
    }
  }, []);

  if (!images.length)
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div
              className={styles.grayBox}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ color: "#fff", fontSize: "20px" }}>
                Loading banners...
              </p>
            </div>
          </div>
        </main>
      </div>
    );

  return (
    <div className={styles.page}>
      {toast && <div className={styles.toast}>{toast}</div>}
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.grayBox}>
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
                  onClick={() => setCurrent(index)} // ✅ 클릭 시 슬라이드 이동
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
