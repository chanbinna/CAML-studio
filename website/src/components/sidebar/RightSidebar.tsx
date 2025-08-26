"use client";
import { useSidebar } from "./SidebarProvider";
import styles from "./Sidebars.module.css";

export default function RightSidebar() {
  const { rightView, closeAll, isAnyOpen } = useSidebar();

  return (
    <>
      {/* Overlay */}
      {isAnyOpen && (
        <div className={styles.overlay} onClick={closeAll} aria-hidden='true' />
      )}

      {/* Panel */}
      <aside
        data-sidebar-panel
        className={`${styles.panel} ${styles.right} ${
          rightView ? styles.open : ""
        }`}
        role='dialog'
        aria-modal='true'
        aria-label='Right sidebar'
        onPointerDown={(e) => e.stopPropagation()}
      >
        {rightView === "login" && <LoginPanel />}
        {rightView === "search" && <SearchPanel />}
        {rightView === "cart" && <CartPanel />}
      </aside>
    </>
  );
}

function LoginPanel() {
  return (
    <div className={styles.content}>
      <form className={styles.login}>
        <label>
          <input id='email' type='email' placeholder='EMAIL' />
        </label>
        <label>
          <input id='password' type='password' placeholder='PASSWORD' />
        </label>
        <button type='submit' className={styles.signinbtn}>
          LOG IN
        </button>
      </form>
      <div className={styles.signup}>
        <a href='/signup' className={styles.signupbtn}>
          SIGN UP
        </a>
      </div>
    </div>
  );
}

function SearchPanel() {
  return (
    <div className={styles.content}>
      <input placeholder='Search products...' />
    </div>
  );
}

function CartPanel() {
  return (
    <div className={styles.content}>
      <h3>Cart</h3>
      <p>Your cart is empty.</p>
    </div>
  );
}
