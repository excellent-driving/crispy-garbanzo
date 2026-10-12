"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./contact.module.css";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErrorMessage(data.error ?? t("genericError"));
      setStatus("error");
      return;
    }

    setStatus("sent");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className={styles["form-card"]}>
      <h2>{t("formTitle")}</h2>

      {status === "sent" && (
        <p className={styles["status-success"]}>{t("sent")}</p>
      )}
      {status === "error" && <p className={styles["status-error"]}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="contact-name">{t("name")}</label>
          <input
            id="contact-name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-email">{t("email")}</label>
          <input
            id="contact-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-message">{t("message")}</label>
          <textarea
            id="contact-message"
            required
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? t("sending") : t("send")}
        </button>
      </form>
    </div>
  );
}
