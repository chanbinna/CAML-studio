"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type LeftView = "shop" | "workshop" | null;
type RightView = "login" | "search" | "cart" | null;

type SidebarContextType = {
  openLeft: (view: Exclude<LeftView, null>) => void;
  openRight: (view: Exclude<RightView, null>) => void;
  closeAll: () => void;
  leftView: LeftView;
  rightView: RightView;
  isAnyOpen: boolean;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [leftView, setLeftView] = useState<LeftView>(null);
  const [rightView, setRightView] = useState<RightView>(null);

  const openLeft = useCallback((view: Exclude<LeftView, null>) => {
    setRightView(null);
    setLeftView(view);
  }, []);

  const openRight = useCallback((view: Exclude<RightView, null>) => {
    setLeftView(null);
    setRightView(view);
  }, []);

  const closeAll = useCallback(() => {
    setLeftView(null);
    setRightView(null);
  }, []);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeAll]);

  // Lock body scroll when a sidebar is open
  useEffect(() => {
    const any = leftView || rightView;
    document.documentElement.style.overflow = any ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [leftView, rightView]);

  useEffect(() => {
    // 사이드바 열려 있을 때만 리스너 활성화
    if (!leftView && !rightView) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;

      // 사이드바 패널 내부 클릭이면 무시
      if (t && t.closest("[data-sidebar-panel]")) return;

      // 패널 밖(네비바 포함) 클릭이면 닫기
      closeAll();
    };

    // 캡처 단계에서 먼저 가로챔: z-index와 관계없이 확실
    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, {
        capture: true,
      });
  }, [leftView, rightView, closeAll]);

  return (
    <SidebarContext.Provider
      value={{
        openLeft,
        openRight,
        closeAll,
        leftView,
        rightView,
        isAnyOpen: !!(leftView || rightView),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>");
  return ctx;
}
