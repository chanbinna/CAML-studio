"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./success.module.css";

export default function WorkshopSuccess() {
  const [reservation, setReservation] = useState<any>(null);

  useEffect(() => {
    // ✅ 최근 예약 내역 가져오기 (로그인된 유저 기준)
    const fetchReservation = async () => {
      try {
        const res = await fetch("/api/login-users/me", {
          credentials: "include",
        });
        const data = await res.json();
        const workshops = data?.user?.workshops;
        if (workshops?.length > 0) {
          setReservation(workshops[workshops.length - 1]); // 마지막 예약
        }
      } catch (err) {
        console.error("Failed to fetch workshop reservation:", err);
      }
    };
    fetchReservation();
  }, []);

  if (!reservation) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Reservation Confirmed!</h1>
        <p>Your workshop reservation is being processed...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reservation Confirmed!</h1>
      <p className={styles.thankyou}>
        Thank you for joining <strong>CRML Studio Workshop</strong>.
      </p>

      <div className={styles.card}>
        <p>
          <strong>Workshop:</strong> {reservation.workshopName}
        </p>
        <p>
          <strong>Schedule:</strong> {reservation.schedule}
        </p>
        <p>
          <strong>Fee:</strong> ${reservation.fee.toFixed(2)}
        </p>
        <p>
          <strong>Reserved At:</strong>{" "}
          {new Date(reservation.reservedAt).toLocaleString()}
        </p>
      </div>

      <div className={styles.actions}>
        <Link href='/workshop' className={styles.btn}>
          Explore More Workshops
        </Link>
        <Link href='/my-workshops' className={styles.btnSecondary}>
          View My Reservations
        </Link>
      </div>
    </div>
  );
}
