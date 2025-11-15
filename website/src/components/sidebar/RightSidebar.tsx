"use client";
import { useState, useEffect } from "react";
import { useSidebar } from "./SidebarProvider";
import styles from "./Sidebars.module.css";
import { TfiSearch } from "react-icons/tfi";
import { TfiClose } from "react-icons/tfi";
import { useAuth } from "../AuthProvider";

export default function RightSidebar() {
  const { rightView, closeAll, isAnyOpen } = useSidebar();
  const { user } = useAuth();

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
        {(rightView === "login" || rightView === "account") &&
          (user ? <AccountPanel /> : <LoginPanel />)}
        {rightView === "search" && <SearchPanel />}
        {rightView === "cart" && <CartPanel />}
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
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
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
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔎 디바운스 검색 (입력 300ms 후에 API 요청)
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className={styles.content2}>
      {/* 검색창 */}
      <div className={styles.searchbar}>
        <div className={styles.field}>
          <input
            id='search'
            type='text'
            placeholder='Search products, workshops...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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

      {/* 결과 */}
      <div className={styles.searchResults}>
        {!query ? (
          <p className={styles.placeholder}>Start typing to search...</p>
        ) : loading ? (
          <p className={styles.loadingText}>Searching...</p>
        ) : results ? (
          <>
            {/* 🛍️ Products */}
            {results.products?.length > 0 && (
              <div className={styles.resultSection}>
                <h3 className={styles.resultTitle}>Products</h3>
                <ul className={styles.resultList}>
                  {results.products.map((p: any) => (
                    <li key={p.id}>
                      <a
                        href={`/shop/product/${p.slug}`}
                        className={styles.resultItem}
                      >
                        <span>{p.name}</span>
                        <small className={styles.resultSub}>
                          {p.category?.name || "Uncategorized"}
                        </small>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 📂 Categories */}
            {results.categories?.length > 0 && (
              <div className={styles.resultSection}>
                <h3 className={styles.resultTitle}>Shop Categories</h3>
                <ul className={styles.resultList}>
                  {results.categories.map((c: any) => (
                    <li key={c.id}>
                      <a
                        href={`/shop?category=${c.slug}`}
                        className={styles.resultItem}
                      >
                        <span>{c.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 🎨 Workshops */}
            {results.workshops?.length > 0 && (
              <div className={styles.resultSection}>
                <h3 className={styles.resultTitle}>Workshops</h3>
                <ul className={styles.resultList}>
                  {results.workshops.map((w: any) => (
                    <li key={w.id}>
                      <a
                        href={`/workshop/${w.slug}`}
                        className={styles.resultItem}
                      >
                        <span>
                          {w.name || w.title || w.workshopName || "Untitled"}
                        </span>
                        {w.schedule && (
                          <small className={styles.resultSub}>
                            {w.schedule}
                          </small>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 아무 결과도 없을 때 */}
            {results.products?.length === 0 &&
              results.workshops?.length === 0 &&
              results.categories?.length === 0 && (
                <p className={styles.noResult}>No results found.</p>
              )}
          </>
        ) : null}
      </div>
    </div>
  );
}

import { useCart } from "../CartProvider";

function CartPanel() {
  const { user } = useAuth();
  const { openRight } = useSidebar();
  const { cart, refreshCart, updateCartLocally, loading } = useCart();

  const [processing, setProcessing] = useState(false);

  if (!user) {
    return (
      <div className={styles.content}>
        <div className={styles.cartNone}>
          <p className={styles.emptyText}>Please log in to view your cart.</p>
          <button
            className={styles.loginBtn}
            onClick={() => openRight("login")}
          >
            LOG IN
          </button>
        </div>
      </div>
    );
  }

  // ✅ 로딩 중 상태 처리
  if (loading) {
    return (
      <div className={styles.content}>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className={styles.content}>
        <p className={styles.emptyText}>Your cart is empty.</p>
      </div>
    );
  }

  const handleQuantityChange = async (productId: string, newQty: number) => {
    if (newQty < 1) return;

    const res = await fetch("/api/update-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, quantity: newQty }),
    });
    if (!res.ok) return;

    updateCartLocally(
      cart.map((item) =>
        item.productId === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemove = async (productId: string) => {
    const res = await fetch("/api/update-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, quantity: 0 }),
    });
    if (!res.ok) return;

    updateCartLocally(cart.filter((item) => item.productId !== productId));
  };

  const handleCheckout = async () => {
    try {
      setProcessing(true);

      const currentUrl = window.location.href;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          cancelUrl: currentUrl,
        }),
      });

      const data = await res.json();

      // ❗ 실패 시 → alert 대신 toast 띄우기
      if (!res.ok) {
        setProcessing(false);

        if (data.soldOut?.length) {
          window.dispatchEvent(
            new CustomEvent("toast", {
              detail: `Some items are out of stock: ${data.soldOut.join(", ")}`,
            })
          );
        } else {
          window.dispatchEvent(
            new CustomEvent("toast", {
              detail: data.message || "Checkout failed.",
            })
          );
        }
        return;
      }

      // 성공 → Stripe 이동
      window.location.href = data.url;
    } catch (err) {
      console.error("❌ Checkout error:", err);

      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: "Server error. Please try again later.",
        })
      );

      setProcessing(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles.contentCart}>
      <div className={styles.contentCartSub}>
        <ul className={styles.cartList}>
          {cart.map((item) => (
            <li key={item.productId} className={styles.cartItem}>
              <img
                src={item.thumbnail}
                alt={item.name}
                className={styles.cartImage}
              />
              <div className={styles.cartInfo}>
                <p className={styles.productName}>{item.name}</p>
                <p className={styles.productCategory}>{item.category}</p>
                <p className={styles.productPrice}>${item.price.toFixed(2)}</p>
                <div className={styles.cartAction}>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity - 1)
                      }
                    >
                      –
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.totalSection}>
        <p>Total:</p>
        <p>${total.toFixed(2)}</p>
      </div>

      <div className={styles.buttonBack}>
        <button
          className={styles.checkoutBtn}
          onClick={handleCheckout}
          disabled={processing}
        >
          {processing ? "PROCESSING..." : "PROCEED TO CHECKOUT"}
        </button>
      </div>
    </div>
  );
}

function AccountPanel() {
  const handleLogout = async () => {
    try {
      await fetch("/api/login-users/logout", {
        method: "POST",
        credentials: "include", // ✅ 세션 쿠키 전송
      });
      window.location.reload(); // ✅ 쿠키 만료 후 새로고침
    } catch (err) {
      console.error("Logout failed:", err);
    }
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
