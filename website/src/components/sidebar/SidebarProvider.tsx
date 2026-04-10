"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type LeftView = "shop" | "workshop" | "menu" | null;
type RightView = "login" | "search" | "cart" | "account" | null;

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
    if (any) {
      const sw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = "hidden";
      // navbar는 right를 scrollbarWidth만큼 줄여서 보정
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${sw}px`,
      );
    } else {
      document.documentElement.style.overflow = "";
      document.documentElement.style.setProperty("--scrollbar-width", "0px");
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    };
  }, [leftView, rightView]);

  useEffect(() => {
    // 사이드바 열려 있을 때만 리스너 활성화
    if (!leftView && !rightView) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest("[data-sidebar-panel]")) return;
      if (t && t.closest("[data-sidebar-trigger]")) return; // ← add this line
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
