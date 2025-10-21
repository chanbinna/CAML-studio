"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CiCircleInfo, CiCircleAlert } from "react-icons/ci";
import styles from "./signup.module.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    setSubmitted(true); // ✅ 버튼 눌렀음을 표시

    const hasError = !email || !password || !name || !lastName;
    if (hasError) return; // ✅ 값 비어있으면 여기서 끝, 에러들 표시됨

    try {
      const res = await fetch("/api/login-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, lastName }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "toast",
          "Account created successfully! Please log in."
        );
        router.push("/");
      } else {
        setMsg(data.errors?.[0]?.message || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error. Please try again later.");
    }
  };

  const hints: Record<string, string> = {
    email: "Enter your Email",
    password: "Enter a secure password",
    name: "Enter your First Name",
    lastname: "Enter your Last Name",
  };

  const renderField = (
    id: string,
    type: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const isFocused = focusedField === id;
    const isTouched = touched[id];
    const isEmpty = !value;

    return (
      <div className={styles.field}>
        <input
          id={id}
          type={type}
          placeholder=' '
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocusedField(id)}
          onBlur={() => {
            setFocusedField(null);
            setTouched((prev) => ({ ...prev, [id]: true }));
          }}
          required
        />
        <label htmlFor={id}>{id.toUpperCase()}</label>

        {submitted && isEmpty ? ( // ✅ 제출 후 빈 값이면 무조건 에러
          <div className={styles.error}>
            <CiCircleAlert size={16} />
            <span>Required field</span>
          </div>
        ) : isFocused ? ( // ✅ 포커스 중이면 힌트
          <div className={styles.helper}>
            <CiCircleInfo size={16} />
            <span>{hints[id]}</span>
          </div>
        ) : isTouched && isEmpty ? ( // ✅ 터치 후 비었으면 에러
          <div className={styles.error}>
            <CiCircleAlert size={16} />
            <span>Required field</span>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <form className={styles.signup} onSubmit={handleSignup}>
        <h2>SIGN UP</h2>

        {renderField("email", "email", email, setEmail)}
        {renderField("password", "password", password, setPassword)}
        {renderField("name", "text", name, setName)}
        {renderField("lastname", "text", lastName, setLastName)}

        <button type='submit' className={styles.signupbtn}>
          CREATE ACCOUNT
        </button>
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}
