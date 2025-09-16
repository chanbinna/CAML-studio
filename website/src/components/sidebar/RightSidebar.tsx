"use client";
import { useState } from "react";
import { useSidebar } from "./SidebarProvider";
import styles from "./Sidebars.module.css";
import { TfiSearch } from "react-icons/tfi";
import { TfiClose } from "react-icons/tfi";

export default function RightSidebar() {
  const { rightView, closeAll, isAnyOpen } = useSidebar();

  return (
    <>
      {/* Overlay */}
      {isAnyOpen && (
        <div
          className={`${styles.overlay} ${isAnyOpen ? styles.open : ""}`}
          onClick={closeAll}
          aria-hidden='true'
        />
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
        <div className={styles.field}>
          <input id='email' type='email' placeholder=' ' required />
          <label htmlFor='email'>EMAIL</label>
        </div>
        <div className={styles.field}>
          <input id='password' type='password' placeholder=' ' required />
          <label htmlFor='password'>PASSWORD</label>
        </div>
        <a href='/retrive' className={styles.forgot}>
          Forgot your password?
        </a>
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
  const [query, setQuery] = useState("");

  return (
    <div className={styles.content}>
      <div className={styles.searchbar}>
        <div className={styles.field}>
          <input
            id='search'
            type='text'
            placeholder='Search...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          {query && (
            <button
              type='button'
              className={styles.clearBtn}
              onClick={() => setQuery("")}
              aria-label='Clear search'
            >
              <TfiClose size={14} />
            </button>
          )}
        </div>
        <button>
          <TfiSearch size={17} />
        </button>
      </div>
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
