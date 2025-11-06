"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";

export default function Contact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // ✅ 필수 입력 확인
    if (!form.firstName || !form.lastName || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess(true);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPic}>
        <Image
          src={"/contactImg.jpeg"}
          alt='Contact Image'
          className={styles.leftImage}
          priority
          width={385}
          height={685}
        />
      </div>

      <div className={styles.rightForm}>
        <p>
          Should you have any questions, our Ambassadors are here to assist you.
        </p>
        <p>Contact Form</p>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <fieldset className={styles.formSection}>
            <p>First Name: *</p>
            <input
              id='firstName'
              type='text'
              placeholder='Name'
              value={form.firstName}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className={styles.formSection}>
            <p>Last Name: *</p>
            <input
              id='lastName'
              type='text'
              placeholder='Last Name'
              value={form.lastName}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className={styles.formSection}>
            <p>Email: *</p>
            <input
              id='email'
              type='text'
              placeholder='Email'
              value={form.email}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className={styles.formSection}>
            <p>Phone: </p>
            <input
              id='phone'
              type='tel'
              placeholder='Phone'
              value={form.phone}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className={styles.formSection}>
            <p className={styles.message}>Message *</p>
            <textarea
              id='message'
              placeholder='Message'
              rows={8}
              value={form.message}
              onChange={handleChange}
            />
          </fieldset>

          {error && <p className={styles.error}>{error}</p>}
          {success && (
            <p className={styles.success}>
              Your message has been sent successfully.
            </p>
          )}

          <button className={styles.submitButton} type='submit'>
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
}
