"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import styles from "./bookings.module.css";
import { displaySlot } from "@/lib/slots";

export type BookingRow = {
  id: string;
  date: string; // ISO
  timeSlot: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  paymentMethod: "CASH" | "BANK_TRANSFER";
  paymentStatus: "PENDING" | "CONFIRMED";
  packageName: string;
  instructorName: string;
  instructorId: string;
  canChange: boolean;
};

type Slot = { label: string; booked: boolean };

/** YYYY-MM-DD of a local date, as the slots API expects. */
function isoDay(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function ReschedulePanel({ booking, onMoved, onClose }: { booking: BookingRow; onMoved: (date: string, timeSlot: string) => void; onClose: () => void }) {
  const t = useTranslations("Bookings");
  const locale = useLocale();
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<{ date: string; list: Slot[] } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) return;
    let ignore = false;
    fetch(`/api/bookings/slots?instructorId=${booking.instructorId}&date=${date}`)
      .then((res) => res.json())
      .then((data) => { if (!ignore) setSlots({ date, list: data.slots ?? [] }); })
      .catch(() => { if (!ignore) setSlots({ date, list: [] }); });
    return () => { ignore = true; };
  }, [date, booking.instructorId]);

  async function move(timeSlot: string) {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/bookings/${booking.id}/reschedule`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, timeSlot }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? t("rescheduleError"));
      return;
    }
    onMoved(data.booking.date, data.booking.timeSlot);
  }

  const loading = date !== "" && slots?.date !== date;
  const free = slots?.date === date ? slots.list.filter((s) => !s.booked) : [];

  return (
    <div className={styles.reschedule}>
      <div className={styles.title}>{t("rescheduleTitle", { instructor: booking.instructorName })}</div>
      <label className={styles.field}>
        <span>{t("newDate")}</span>
        <input type="date" value={date} min={isoDay(new Date())} onChange={(e) => setDate(e.target.value)} />
      </label>
      {loading && <p className={styles.hint}>{t("loadingSlots")}</p>}
      {!loading && date && free.length === 0 && <p className={styles.hint}>{t("noSlots")}</p>}
      {!loading && free.length > 0 && (
        <div className={styles.slots}>
          {free.map((s) => (
            <button key={s.label} className="btn btn-outline" disabled={saving} onClick={() => move(s.label)}>
              {displaySlot(s.label, locale)}
            </button>
          ))}
        </div>
      )}
      {error && <p className={styles["error-banner"]}>{error}</p>}
      <div>
        <button className="btn btn-outline" onClick={onClose} disabled={saving}>
          {saving ? t("rescheduling") : t("close")}
        </button>
      </div>
    </div>
  );
}

const badgeClass: Record<BookingRow["status"], string> = {
  PENDING: "badge-pending",
  CONFIRMED: "badge-confirmed",
  CANCELLED: "badge-cancelled",
};

function Row({ booking, onCancelled, onMoved }: { booking: BookingRow; onCancelled: (id: string) => void; onMoved: (id: string, date: string, timeSlot: string) => void }) {
  const t = useTranslations("Bookings");
  const locale = useLocale();
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState(false);
  const [moved, setMoved] = useState(false);
  const date = new Date(booking.date);

  async function handleCancel() {
    setCancelling(true);
    setError(null);
    const res = await fetch(`/api/bookings/${booking.id}/cancel`, { method: "PATCH" });
    const data = await res.json();
    setCancelling(false);
    if (!res.ok) {
      setError(data.error ?? t("cancelError"));
      return;
    }
    onCancelled(booking.id);
  }

  return (
    <div>
      <div className={styles.row}>
        <div className={styles["date-box"]}>
          <div className={styles.month}>{date.toLocaleDateString(locale === "nl" ? "nl-NL" : "en-US", { month: "short", timeZone: "UTC" })}</div>
          <div className={styles.day}>{date.getUTCDate()}</div>
          <div className={styles.year}>{date.getUTCFullYear()}</div>
        </div>
        <div className={styles.info}>
          <div className={styles.title}>{t("packageLesson", { name: booking.packageName })}</div>
          <div className={styles.meta}>
            <span>⏰ {displaySlot(booking.timeSlot, locale)}</span>
            <span>👨‍🏫 {booking.instructorName}</span>
            <span>{booking.paymentMethod === "CASH" ? `💵 ${t("cash")}` : `🏦 ${t("bankTransfer")}`}</span>
          </div>
        </div>
        <span className={`${styles.badge} ${styles[badgeClass[booking.status]]}`}>
          {booking.status === "CONFIRMED" ? `✓ ${t("statusConfirmed")}` : booking.status === "PENDING" ? t("statusPendingPayment") : t("statusCancelled")}
        </span>
        {booking.canChange && (
          <div className={styles.actions}>
            <button className="btn btn-outline" onClick={() => { setRescheduling(true); setMoved(false); }} disabled={cancelling || rescheduling}>
              {t("reschedule")}
            </button>
            <button className="btn btn-outline" onClick={handleCancel} disabled={cancelling || rescheduling}>
              {cancelling ? t("cancelling") : t("cancel")}
            </button>
          </div>
        )}
      </div>
      {rescheduling && (
        <ReschedulePanel
          booking={booking}
          onClose={() => setRescheduling(false)}
          onMoved={(newDate, timeSlot) => {
            setRescheduling(false);
            setMoved(true);
            onMoved(booking.id, newDate, timeSlot);
          }}
        />
      )}
      {moved && <p className={styles.success} role="status">{t("rescheduled")}</p>}
      {error && <p className={styles["error-banner"]} style={{ marginTop: 8 }}>{error}</p>}
    </div>
  );
}

export function BookingsList({ initial }: { initial: BookingRow[] }) {
  const t = useTranslations("Bookings");
  const [bookings, setBookings] = useState(initial);

  function handleCancelled(id: string) {
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, status: "CANCELLED", canChange: false } : b)));
  }

  function handleMoved(id: string, date: string, timeSlot: string) {
    setBookings((list) =>
      list
        .map((b) => (b.id === id ? { ...b, date, timeSlot } : b))
        .sort((a, b) => b.date.localeCompare(a.date)),
    );
  }

  const upcoming = bookings.filter((b) => b.status !== "CANCELLED" && new Date(b.date).getTime() >= new Date().setUTCHours(0, 0, 0, 0));
  const history = bookings.filter((b) => !upcoming.includes(b));

  return (
    <div>
      <div className={styles["section-label"]}>{t("upcoming")}</div>
      {upcoming.length === 0 ? (
        <div className={styles["empty-state"]}>{t("noUpcoming")} <a href="/booking">{t("bookALesson")} →</a></div>
      ) : (
        <div className={styles.list}>
          {upcoming.map((b) => (
            <Row key={b.id} booking={b} onCancelled={handleCancelled} onMoved={handleMoved} />
          ))}
        </div>
      )}

      {history.length > 0 && (
        <>
          <div className={styles["section-label"]}>{t("history")}</div>
          <div className={styles.list}>
            {history.map((b) => (
              <Row key={b.id} booking={b} onCancelled={handleCancelled} onMoved={handleMoved} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
