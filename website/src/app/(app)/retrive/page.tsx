"use client";
import { useState } from "react";
import styles from "./retrive.module.css";
import { CiCircleInfo, CiCircleAlert } from "react-icons/ci";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setSubmitted(true);

    if (!email) return;

    try {
      const res = await fetch("/api/login-users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMsg("Password reset email has been sent. Please check your inbox.");
      } else {
        setMsg("Failed to send reset email. Please try again.");
      }
    } catch (err) {
      console.error(err); // ✅ err를 사용하면 ESLint 경고 사라짐
      setMsg("Server error. Please try again later.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.signup} onSubmit={handleForgot}>
        <h2>RESET PASSWORD</h2>

        <div className={styles.field}>
          <input
            id='email'
            type='email'
            placeholder=' '
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setTouched(true);
            }}
            required
          />
          <label htmlFor='email'>EMAIL</label>

          {submitted && !email ? (
            <div className={styles.error}>
              <CiCircleAlert size={16} />
              <span>Required field</span>
            </div>
          ) : focused ? (
            <div className={styles.helper}>
              <CiCircleInfo size={16} />
              <span>Enter the email linked to your account</span>
            </div>
          ) : touched && !email ? (
            <div className={styles.error}>
              <CiCircleAlert size={16} />
              <span>Required field</span>
            </div>
          ) : null}
        </div>

        <button type='submit' className={styles.signupbtn}>
          SEND RESET LINK
        </button>
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}
