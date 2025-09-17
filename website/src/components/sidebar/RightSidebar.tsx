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
        {rightView === "account" && <AccountPanel />}
      </aside>
    </>
  );
}

function LoginPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    try {
      const res = await fetch("/api/login-users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.reload();
      } else {
        setMsg(data.errors?.[0]?.message || "Invalid credentials");
      }
    } catch (err) {
      setMsg("Server error. Please try again later.");
    }
  };

  return (
    <div className={styles.content}>
      <form className={styles.login} onSubmit={handleLogin}>
        <div className={styles.field}>
          <input
            id='email'
            type='email'
            placeholder=' '
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor='email'>EMAIL</label>
        </div>

        <div className={styles.field}>
          <input
            id='password'
            type='password'
            placeholder=' '
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor='password'>PASSWORD</label>
        </div>

        <a href='/retrive' className={styles.forgot}>
          Forgot your password?
        </a>
        {msg && <p className={styles.error}>{msg}</p>}
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

function AccountPanel() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload(); // 로그아웃 후 새로고침
  };

  return (
    <div className={styles.content}>
      <ul className={styles.accountMenu}>
        <li>
          <a href='/profile'>MY PROFILE</a>
        </li>
        <li>
          <a href='/orders'>MY ORDERS</a>
        </li>
        <li>
          <button onClick={handleLogout} className={styles.linklike}>
            LOG OUT
          </button>
        </li>
      </ul>
    </div>
  );
}
