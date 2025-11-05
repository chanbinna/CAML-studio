"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", lastName: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  // ✅ 유저 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/users/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setForm({
          name: data.user.name || "",
          lastName: data.user.lastName || "",
          email: data.user.email || "",
        });
      }
    };
    fetchUser();
  }, []);

  // ✅ 전역 토스트 트리거 함수
  const showGlobalToast = (message: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("toast", { detail: message }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.id]: e.target.value });

  // ✅ 프로필 업데이트
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      showGlobalToast("Profile updated successfully");
      setEditMode(false);
    } else {
      setMessage("Update failed. Please try again.");
    }
  };

  // ✅ 비밀번호 변경
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // ✅ 클라이언트 측 검증
    if (
      !passwordForm.current ||
      !passwordForm.newPass ||
      !passwordForm.confirm
    ) {
      return setMessage("Please fill in all password fields.");
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      return setMessage("New passwords do not match.");
    }

    const res = await fetch("/api/users/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.newPass,
      }),
    });

    if (res.ok) {
      showGlobalToast("Password changed successfully!");
      setPasswordForm({ current: "", newPass: "", confirm: "" });
      setShowPassword(false);
      return;
    }

    const data = await res.json();
    if (data?.error === "Incorrect current password") {
      setMessage("Current password is incorrect.");
    } else {
      setMessage("Failed to change password. Please try again.");
    }
  };

  if (!user) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h1 className={styles.title}>My Profile</h1>
        <form onSubmit={handleSave} className={styles.profileForm}>
          <fieldset className={styles.fieldset}>
            <p className={styles.fieldLabel}>First Name *</p>
            <input
              id='name'
              type='text'
              placeholder='First Name'
              value={form.name}
              onChange={handleChange}
              disabled={!editMode}
              className={styles.input}
            />
          </fieldset>

          <fieldset className={styles.fieldset}>
            <p className={styles.fieldLabel}>Last Name *</p>
            <input
              id='lastName'
              type='text'
              placeholder='Last Name'
              value={form.lastName}
              onChange={handleChange}
              disabled={!editMode}
              className={styles.input}
            />
          </fieldset>

          <fieldset className={styles.fieldset}>
            <p className={styles.fieldLabel}>Email *</p>
            <input
              id='email'
              type='email'
              placeholder='Email'
              value={form.email}
              onChange={handleChange}
              disabled={!editMode}
              className={styles.input}
            />
          </fieldset>

          {editMode ? (
            <div className={styles.buttons}>
              <button type='submit' className={styles.submitButton}>
                SAVE
              </button>
              <button
                type='button'
                className={styles.cancelButton}
                onClick={() => setEditMode(false)}
              >
                CANCEL
              </button>
            </div>
          ) : (
            <button
              type='button'
              className={styles.submitButton}
              onClick={() => setEditMode(true)}
            >
              EDIT PROFILE
            </button>
          )}
        </form>
      </div>

      {/* Password Section */}
      <div className={styles.passwordSection}>
        <button
          type='button'
          className={styles.toggleButton}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "CANCEL PASSWORD CHANGE" : "CHANGE PASSWORD"}
        </button>

        {showPassword && (
          <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
            <fieldset className={styles.fieldset}>
              <p className={styles.fieldLabel}>Current Password *</p>
              <input
                type='password'
                placeholder='Current Password'
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, current: e.target.value })
                }
                className={styles.input}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <p className={styles.fieldLabel}>New Password *</p>
              <input
                type='password'
                placeholder='New Password'
                value={passwordForm.newPass}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPass: e.target.value })
                }
                className={styles.input}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <p className={styles.fieldLabel}>Confirm Password *</p>
              <input
                type='password'
                placeholder='Confirm New Password'
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirm: e.target.value })
                }
                className={styles.input}
              />
            </fieldset>

            <button type='submit' className={styles.submitButton2}>
              UPDATE PASSWORD
            </button>
          </form>
        )}
      </div>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
