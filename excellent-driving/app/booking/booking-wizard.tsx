"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { displaySlot } from "@/lib/slots";
import styles from "./booking.module.css";

type Pkg = { id: string; name: string; price: number };
type Instructor = { id: string; name: string; yearsExperience: number | null; availableDays: string };
type Slot = { label: string; booked: boolean };
type ConfirmedBooking = { timeSlot: string; instructor: { user: { name: string } } };

const stepKeys = ["stepPackage", "stepInstructor", "stepDate", "stepTime", "stepPayment"] as const;
const bold = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function BookingWizard({ packages, instructors }: { packages: Pkg[]; instructors: Instructor[] }) {
  const router = useRouter();
  const t = useTranslations("Booking");
  const locale = useLocale();
  const dateLocale = locale === "nl" ? "nl-NL" : "en-US";
  const [step, setStep] = useState(1);

  const [packageId, setPackageId] = useState(packages[0]?.id ?? "");
  const [instructorId, setInstructorId] = useState(instructors[0]?.id ?? "");
  const [payment, setPayment] = useState<"CASH" | "BANK_TRANSFER">("CASH");

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const [slotsResult, setSlotsResult] = useState<{ key: string; slots: Slot[] } | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

  const selectedPackage = packages.find((p) => p.id === packageId);
  const selectedInstructor = instructors.find((i) => i.id === instructorId);
  const dateStr = selectedDay ? `${calYear}-${pad(calMonth + 1)}-${pad(selectedDay)}` : null;
  const dateLabel = selectedDay
    ? new Date(calYear, calMonth, selectedDay).toLocaleDateString(dateLocale, { weekday: "long", month: "short", day: "numeric" })
    : null;
  // Week starts on Sunday; 2026-01-04 is a Sunday.
  const dayNamesShort = useMemo(
    () => Array.from({ length: 7 }, (_, i) => new Date(2026, 0, 4 + i).toLocaleDateString(dateLocale, { weekday: "short" })),
    [dateLocale],
  );
  const slot = (label: string) => displaySlot(label, locale);
  const price = (n: number) => n.toLocaleString(dateLocale);

  // Slots belong to one instructor + date; anything fetched for another
  // combination is treated as not loaded yet.
  const slotsKey = instructorId && dateStr ? `${instructorId}|${dateStr}` : null;
  const slotsLoaded = slotsKey !== null && slotsResult?.key === slotsKey;
  const slots = slotsLoaded ? slotsResult.slots : [];
  const slotsLoading = slotsKey !== null && !slotsLoaded;

  useEffect(() => {
    if (!slotsKey) return;
    let ignore = false;
    fetch(`/api/bookings/slots?instructorId=${instructorId}&date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setSlotsResult({ key: slotsKey, slots: data.slots ?? [] });
      })
      .catch(() => {
        if (!ignore) setSlotsResult({ key: slotsKey, slots: [] });
      });
    return () => {
      ignore = true;
    };
  }, [slotsKey, instructorId, dateStr]);

  // A chosen time slot is only valid for the instructor and date it was picked for.
  function selectInstructor(id: string) {
    if (id !== instructorId) setTimeSlot(null);
    setInstructorId(id);
  }

  function selectDay(day: number | null) {
    if (day !== selectedDay) setTimeSlot(null);
    setSelectedDay(day);
  }

  function goStep(n: number) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleConfirm() {
    if (!dateStr || !timeSlot) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          instructorId,
          date: dateStr,
          timeSlot,
          paymentMethod: payment,
        }),
      });

      // A crashed route answers with a non-JSON error page.
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.booking) {
        setError(data?.error ?? t("genericError"));
        return;
      }

      setConfirmedBooking(data.booking);
      goStep(6);
    } catch {
      setError(t("networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  const monthCells = useMemo(() => {
    const first = new Date(calYear, calMonth, 1).getDay();
    const total = new Date(calYear, calMonth + 1, 0).getDate();
    const cells: { day: number | null; kind: string }[] = [];
    for (let i = 0; i < first; i++) cells.push({ day: null, kind: "empty" });
    for (let d = 1; d <= total; d++) {
      const date = new Date(calYear, calMonth, d);
      let kind = "available";
      if (date.getDay() === 0) kind = "sunday";
      else if (date < today) kind = "past";
      if (
        d === today.getDate() &&
        calMonth === today.getMonth() &&
        calYear === today.getFullYear()
      ) {
        kind += " today";
      }
      cells.push({ day: d, kind });
    }
    return cells;
  }, [calYear, calMonth, today]);

  const isPastMonth =
    calYear < today.getFullYear() ||
    (calYear === today.getFullYear() && calMonth <= today.getMonth());

  return (
    <div className={styles["booking-wrap"]}>
      <div className={styles["booking-header"]}>
        <h1>{t("title")}</h1>
        <p>{t("intro")}</p>
      </div>

      <div className={styles["progress-bar"]}>
        {stepKeys.map((key, i) => {
          const label = t(key);
          const n = i + 1;
          const state = n < step ? "done" : n === step ? "active" : "pending";
          return (
            <div key={key} style={{ display: "contents" }}>
              <div className={`${styles["step-item"]} ${styles[state]}`}>
                <div className={styles["step-circle"]}>{n < step ? "✓" : n}</div>
                <div className={styles["step-label"]}>{label}</div>
              </div>
              {n < 5 && (
                <div className={`${styles["step-connector"]} ${styles[n < step ? "done" : "pending"]}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className={styles["booking-layout"]}>
        <div>
          {step === 1 && (
            <div className={styles["step-panel"]}>
              <div className={styles["step-card"]}>
                <div className={styles["step-card-title"]}>{t("choosePackage")}</div>
                <div className={styles["step-card-sub"]}>{t("choosePackageSub")}</div>
                <div className={styles["pkg-options"]}>
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      role="button"
                      tabIndex={0}
                      className={`${styles["pkg-option"]}${pkg.id === packageId ? ` ${styles.selected}` : ""}`}
                      onClick={() => setPackageId(pkg.id)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPackageId(pkg.id)}
                    >
                      <div className={styles["pkg-opt-name"]}>{pkg.name}</div>
                      <div className={styles["pkg-opt-lessons"]}>{t("packageIncludes")}</div>
                      <div className={styles["pkg-opt-price"]}>
                        SRD {price(pkg.price)} <span>{t("perPackage")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles["nav-btns"]}>
                <span></span>
                <button className="btn btn-primary btn-lg" onClick={() => goStep(2)} disabled={!packageId}>
                  {t("continue")}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles["step-panel"]}>
              <div className={styles["step-card"]}>
                <div className={styles["step-card-title"]}>{t("chooseInstructor")}</div>
                <div className={styles["step-card-sub"]}>{t("chooseInstructorSub")}</div>
                <div className={styles["instructor-options"]}>
                  {instructors.map((inst) => (
                    <div
                      key={inst.id}
                      role="button"
                      tabIndex={0}
                      className={`${styles["instructor-option"]}${inst.id === instructorId ? ` ${styles.selected}` : ""}`}
                      onClick={() => selectInstructor(inst.id)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && selectInstructor(inst.id)}
                    >
                      <div className={styles["inst-avatar"]} aria-hidden="true">👤</div>
                      <div className={styles["inst-name"]}>{inst.name}</div>
                      <div className={styles["inst-exp"]}>{t("yearsExperience", { years: inst.yearsExperience ?? 0 })}</div>
                      <div className={styles["inst-avail"]}>{inst.availableDays}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles["nav-btns"]}>
                <button className="btn btn-outline" onClick={() => goStep(1)}>{t("back")}</button>
                <button className="btn btn-primary btn-lg" onClick={() => goStep(3)} disabled={!instructorId}>
                  {t("continue")}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles["step-panel"]}>
              <div className={styles["step-card"]}>
                <div className={styles["step-card-title"]}>{t("chooseDate")}</div>
                <div className={styles["step-card-sub"]}>{t("chooseDateSub")}</div>
                <div className={styles["calendar-wrap"]}>
                  <div className={styles["cal-header"]}>
                    <button
                      className={styles["cal-nav"]}
                      disabled={isPastMonth}
                      onClick={() => {
                        setCalMonth((m) => (m === 0 ? 11 : m - 1));
                        if (calMonth === 0) setCalYear((y) => y - 1);
                        selectDay(null);
                      }}
                      aria-label={t("previousMonth")}
                    >
                      ‹
                    </button>
                    <h3>{new Date(calYear, calMonth, 1).toLocaleDateString(dateLocale, { month: "long", year: "numeric" })}</h3>
                    <button
                      className={styles["cal-nav"]}
                      onClick={() => {
                        setCalMonth((m) => (m === 11 ? 0 : m + 1));
                        if (calMonth === 11) setCalYear((y) => y + 1);
                        selectDay(null);
                      }}
                      aria-label={t("nextMonth")}
                    >
                      ›
                    </button>
                  </div>
                  <div className={styles["cal-grid"]}>
                    {dayNamesShort.map((d) => (
                      <div className={styles["cal-day-name"]} key={d}>{d}</div>
                    ))}
                    {monthCells.map((cell, idx) => {
                      if (cell.day === null) {
                        return <div className={`${styles["cal-day"]} ${styles.empty}`} key={idx} />;
                      }
                      const clickable = cell.kind.startsWith("available");
                      const kindClasses = cell.kind
                        .split(" ")
                        .map((k) => styles[k])
                        .filter(Boolean)
                        .join(" ");
                      const isSelected = selectedDay === cell.day;
                      return (
                        <div
                          key={idx}
                          className={`${styles["cal-day"]} ${kindClasses}${isSelected ? ` ${styles.selected}` : ""}`}
                          role={clickable ? "button" : undefined}
                          tabIndex={clickable ? 0 : undefined}
                          onClick={() => clickable && selectDay(cell.day)}
                          onKeyDown={(e) =>
                            clickable && (e.key === "Enter" || e.key === " ") && selectDay(cell.day)
                          }
                        >
                          {cell.day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className={styles["nav-btns"]}>
                <button className="btn btn-outline" onClick={() => goStep(2)}>{t("back")}</button>
                <button className="btn btn-primary btn-lg" onClick={() => goStep(4)} disabled={!selectedDay}>
                  {t("continue")}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className={styles["step-panel"]}>
              <div className={styles["step-card"]}>
                <div className={styles["step-card-title"]}>{t("chooseTime")}</div>
                <div className={styles["step-card-sub"]}>
                  {slotsLoading
                    ? t("loadingSlots")
                    : t("slotsFor", { instructor: selectedInstructor?.name ?? "", date: dateLabel ?? "" })}
                </div>
                {!slotsLoading && slots.length === 0 && (
                  <p style={{ color: "var(--gray-600)", fontSize: "0.875rem" }}>
                    {t("noSlots")}
                  </p>
                )}
                {!slotsLoading && slots.length > 0 && (
                  <div className={styles["time-groups"]}>
                    <div>
                      <div className={styles["time-group-label"]}>🌅 {t("morning")}</div>
                      <div className={styles["time-slots"]}>
                        {slots.filter((s) => s.label.endsWith("AM")).map((s) => (
                          <button
                            key={s.label}
                            className={`${styles["time-slot"]}${s.booked ? ` ${styles.booked}` : ""}${timeSlot === s.label ? ` ${styles.selected}` : ""}`}
                            disabled={s.booked}
                            onClick={() => setTimeSlot(s.label)}
                          >
                            {slot(s.label)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className={styles["time-group-label"]}>☀️ {t("afternoon")}</div>
                      <div className={styles["time-slots"]}>
                        {slots.filter((s) => s.label.endsWith("PM")).map((s) => (
                          <button
                            key={s.label}
                            className={`${styles["time-slot"]}${s.booked ? ` ${styles.booked}` : ""}${timeSlot === s.label ? ` ${styles.selected}` : ""}`}
                            disabled={s.booked}
                            onClick={() => setTimeSlot(s.label)}
                          >
                            {slot(s.label)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 16, padding: "12px 16px", background: "var(--gray-50)", borderRadius: 8, fontSize: "0.78rem", color: "var(--gray-600)" }}>
                  {t.rich("slotsNote", { b: (chunks) => <strong style={{ color: "var(--navy)" }}>{chunks}</strong> })}
                </div>
              </div>
              <div className={styles["nav-btns"]}>
                <button className="btn btn-outline" onClick={() => goStep(3)}>{t("back")}</button>
                <button className="btn btn-primary btn-lg" onClick={() => goStep(5)} disabled={!timeSlot}>
                  {t("continue")}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className={styles["step-panel"]}>
              <div className={styles["step-card"]}>
                <div className={styles["step-card-title"]}>{t("choosePayment")}</div>
                <div className={styles["step-card-sub"]}>{t("choosePaymentSub")}</div>
                <div className={styles["payment-options"]}>
                  <div
                    role="button"
                    tabIndex={0}
                    className={`${styles["pay-option"]}${payment === "CASH" ? ` ${styles.selected}` : ""}`}
                    onClick={() => setPayment("CASH")}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPayment("CASH")}
                  >
                    <div className={styles["pay-icon"]} aria-hidden="true">💵</div>
                    <div className={styles["pay-name"]}>{t("cashTitle")}</div>
                    <div className={styles["pay-desc"]}>{t("cashDesc")}</div>
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    className={`${styles["pay-option"]}${payment === "BANK_TRANSFER" ? ` ${styles.selected}` : ""}`}
                    onClick={() => setPayment("BANK_TRANSFER")}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPayment("BANK_TRANSFER")}
                  >
                    <div className={styles["pay-icon"]} aria-hidden="true">🏦</div>
                    <div className={styles["pay-name"]}>{t("bankTitle")}</div>
                    <div className={styles["pay-desc"]}>{t("bankDesc")}</div>
                  </div>
                </div>
                <div style={{ marginTop: 20, padding: 16, background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.25)", borderRadius: 10 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>💡 {t("paymentNoteTitle")}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--gray-600)", lineHeight: 1.5 }}>
                    {t.rich("paymentNote", { b: bold })}
                  </div>
                </div>
                {error && <p className={styles["error-banner"]} style={{ marginTop: 16 }}>{error}</p>}
              </div>
              <div className={styles["nav-btns"]}>
                <button className="btn btn-outline" onClick={() => goStep(4)}>{t("back")}</button>
                <button className="btn btn-primary btn-lg" onClick={handleConfirm} disabled={submitting}>
                  {submitting ? t("confirming") : t("confirm")}
                </button>
              </div>
            </div>
          )}

          {step === 6 && confirmedBooking && (
            <div className={styles["step-panel"]}>
              <div className={styles["confirm-header"]}>
                <div className={styles["confirm-check"]}>
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="4 12.5 9.5 18 20 6"></polyline>
                  </svg>
                </div>
                <h2>{t("confirmedTitle")}</h2>
                <p>{t("confirmedText")}</p>
              </div>

              <div className={styles["confirm-details"]}>
                <div className={styles["confirm-row"]}>
                  <div className={styles["confirm-key"]}>📦 {t("package")}</div>
                  <div className={styles["confirm-val"]}>{selectedPackage?.name}</div>
                </div>
                <div className={styles["confirm-row"]}>
                  <div className={styles["confirm-key"]}>👨‍🏫 {t("instructor")}</div>
                  <div className={styles["confirm-val"]}>{confirmedBooking.instructor.user.name}</div>
                </div>
                <div className={styles["confirm-row"]}>
                  <div className={styles["confirm-key"]}>📅 {t("date")}</div>
                  <div className={styles["confirm-val"]}>
                    {new Date(calYear, calMonth, selectedDay ?? 1).toLocaleDateString(dateLocale, { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <div className={styles["confirm-row"]}>
                  <div className={styles["confirm-key"]}>⏰ {t("time")}</div>
                  <div className={styles["confirm-val"]}>{slot(confirmedBooking.timeSlot)}</div>
                </div>
                <div className={styles["confirm-row"]}>
                  <div className={styles["confirm-key"]}>💵 {t("payment")}</div>
                  <div className={styles["confirm-val"]}>
                    {payment === "CASH" ? t("cash") : t("bankTransfer")} · SRD {price(selectedPackage?.price ?? 0)}
                  </div>
                </div>
                <div className={styles["confirm-row"]}>
                  <div className={styles["confirm-key"]}>🔖 {t("status")}</div>
                  <div className={styles["confirm-val"]}>
                    <span style={{ background: "rgba(245,166,35,0.15)", color: "#b45309", padding: "4px 10px", borderRadius: 100, fontSize: "0.8rem" }}>
                      {t("pendingPayment")}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles["wa-notice"]}>
                <div className={styles["wa-notice-icon"]} aria-hidden="true">📱</div>
                <p>
                  {t.rich("whatsappNotice", { b: bold })}
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => router.push("/student/dashboard")}
                >
                  {t("goToDashboard")}
                </button>
                <button
                  className="btn btn-outline btn-lg"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => router.push("/")}
                >
                  {t("backHome")}
                </button>
              </div>
            </div>
          )}
        </div>

        {step < 6 && (
          <div>
            <div className={styles["summary-card"]}>
              <div className={styles["summary-title"]}>{t("summary")}</div>
              <div className={styles["summary-item"]}>
                <div className={styles["summary-key"]}>{t("package")}</div>
                <div className={styles["summary-val"]}>{selectedPackage?.name ?? "—"}</div>
              </div>
              <div className={styles["summary-item"]}>
                <div className={styles["summary-key"]}>{t("instructor")}</div>
                <div className={styles["summary-val"]}>{selectedInstructor?.name ?? "—"}</div>
              </div>
              <div className={styles["summary-item"]}>
                <div className={styles["summary-key"]}>{t("date")}</div>
                <div className={`${styles["summary-val"]}${!dateLabel ? ` ${styles.empty}` : ""}`}>
                  {dateLabel ?? t("notSelected")}
                </div>
              </div>
              <div className={styles["summary-item"]}>
                <div className={styles["summary-key"]}>{t("time")}</div>
                <div className={`${styles["summary-val"]}${!timeSlot ? ` ${styles.empty}` : ""}`}>
                  {timeSlot ? slot(timeSlot) : t("notSelected")}
                </div>
              </div>
              <div className={styles["summary-item"]}>
                <div className={styles["summary-key"]}>{t("payment")}</div>
                <div className={styles["summary-val"]}>{payment === "CASH" ? t("cash") : t("bankTransfer")}</div>
              </div>
              <div className={styles["summary-total"]}>
                <div className={styles["summary-total-label"]}>{t("total")}</div>
                <div className={styles["summary-total-price"]}>
                  SRD {price(selectedPackage?.price ?? 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
