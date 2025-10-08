"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./GlobalToast.module.css";

// ✅ hydration 전에 toast 초기화
if (typeof window !== "undefined") {
  const msg = localStorage.getItem("toast");
  if (msg) localStorage.removeItem("toast");
}

export default function GlobalToast() {
  const [toast, setToast] = useState<string | null>(null);
  const shownRef = useRef(false);

  const showToast = (msg: string) => {
    if (shownRef.current) return;
    shownRef.current = true;

    setToast(msg);
    setTimeout(() => {
      setToast(null);
      shownRef.current = false;
    }, 3000);
  };

  useEffect(() => {
    // ✅ 이제 페이지 로드 시에는 남은 toast 없음
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "toast" && e.newValue) {
        localStorage.removeItem("toast");
        showToast(e.newValue);
      }
    };

    const handleCustom = (e: CustomEvent<string>) => {
      if (e.detail) showToast(e.detail);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("toast", handleCustom as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("toast", handleCustom as EventListener);
    };
  }, []);

  if (!toast) return null;

  return <div className={styles.toast}>{toast}</div>;
}
