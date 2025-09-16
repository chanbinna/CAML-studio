"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

const images = ["/page1.jpg", "/page2.jpg", "/page3.jpg", "/page4.jpg"];

export default function Home() {
  const [current, setCurrent] = useState(0);

  // 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // 3초마다 변경
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.grayBox}>
            <div className={styles.imageWrapper}>
              <Image
                src={images[current]}
                alt={`Slide ${current + 1}`}
                fill
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
