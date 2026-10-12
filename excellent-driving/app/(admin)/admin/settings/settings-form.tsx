"use client";

import { useState } from "react";

type Settings = {
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  whatsappBotEnabled: boolean;
  bankName: string;
  bankAccountHolder: string;
  bankAccountNumber: string;
  lessonsAfterPayment: boolean;
  statStudents: string;
  statPassRate: string;
  openingDaysNl: string;
  openingDaysEn: string;
  openingTimes: string;
  defaultLanguage: "EN" | "NL";
};

export function SettingsForm({ initial }: { initial: Settings }) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not save settings.");
      setStatus("error");
      return;
    }
    setStatus("saved");
  }

  return (
    <form className="card" onSubmit={save} style={{ maxWidth: 560 }}>
      <div className="card-header">
        <div className="card-title">School Settings</div>
      </div>
      <div className="card-body">
        {status === "saved" && <p className="status-banner-success">Settings saved.</p>}
        {status === "error" && <p className="status-banner-error">{error}</p>}

        <div className="field">
          <label htmlFor="school-name">School name</label>
          <input id="school-name" required value={form.schoolName} onChange={(e) => setForm((f) => ({ ...f, schoolName: e.target.value }))} />
        </div>
        <div className="field">
          <label htmlFor="school-address">Address</label>
          <input id="school-address" required value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="school-phone">Phone</label>
            <input id="school-phone" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="field">
            <label htmlFor="school-whatsapp">WhatsApp number</label>
            <input id="school-whatsapp" value={form.whatsappNumber} onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))} placeholder="+597…" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="school-email">Email (shown on the site; contact-form messages go here)</label>
          <input id="school-email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
        <h3 className="settings-section">Opening hours</h3>
        <div className="field-row">
          <div className="field">
            <label htmlFor="school-days-nl">Days (Dutch)</label>
            <input id="school-days-nl" required value={form.openingDaysNl} onChange={(e) => setForm((f) => ({ ...f, openingDaysNl: e.target.value }))} placeholder="Ma–Za" />
          </div>
          <div className="field">
            <label htmlFor="school-days-en">Days (English)</label>
            <input id="school-days-en" required value={form.openingDaysEn} onChange={(e) => setForm((f) => ({ ...f, openingDaysEn: e.target.value }))} placeholder="Mon–Sat" />
          </div>
          <div className="field">
            <label htmlFor="school-times">Times</label>
            <input id="school-times" required value={form.openingTimes} onChange={(e) => setForm((f) => ({ ...f, openingTimes: e.target.value }))} placeholder="7:00–18:00" />
          </div>
        </div>

        <h3 className="settings-section">Bank details for bank transfer</h3>
        <p className="settings-hint">Students can choose bank transfer only once the account number is filled in; the details are shown when they book.</p>
        <div className="field-row">
          <div className="field">
            <label htmlFor="school-bank">Bank</label>
            <input id="school-bank" value={form.bankName} onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))} />
          </div>
          <div className="field">
            <label htmlFor="school-bank-holder">Account holder</label>
            <input id="school-bank-holder" value={form.bankAccountHolder} onChange={(e) => setForm((f) => ({ ...f, bankAccountHolder: e.target.value }))} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="school-bank-number">Account number</label>
          <input id="school-bank-number" value={form.bankAccountNumber} onChange={(e) => setForm((f) => ({ ...f, bankAccountNumber: e.target.value }))} />
        </div>

        <h3 className="settings-section">Online lessons</h3>
        <div className="field">
          <label>
            <input
              type="checkbox"
              style={{ width: "auto", marginRight: 8 }}
              checked={form.lessonsAfterPayment}
              onChange={(e) => setForm((f) => ({ ...f, lessonsAfterPayment: e.target.checked }))}
            />
            New students get the online lessons only after their payment is confirmed
          </label>
          <p className="settings-hint">Off: lessons open right after registering. On: they open when you confirm a payment under Bookings. Students who already have access keep it.</p>
        </div>

        <h3 className="settings-section">Numbers on the homepage</h3>
        <p className="settings-hint">Leave empty to hide. The number of instructors is counted automatically.</p>
        <div className="field-row">
          <div className="field">
            <label htmlFor="school-stat-students">Students trained</label>
            <input id="school-stat-students" value={form.statStudents} onChange={(e) => setForm((f) => ({ ...f, statStudents: e.target.value }))} placeholder="e.g. 500+" />
          </div>
          <div className="field">
            <label htmlFor="school-stat-pass">Pass rate</label>
            <input id="school-stat-pass" value={form.statPassRate} onChange={(e) => setForm((f) => ({ ...f, statPassRate: e.target.value }))} placeholder="e.g. 95%" />
          </div>
        </div>

        <h3 className="settings-section">Other</h3>
        <div className="field">
          <label htmlFor="school-lang">Default language</label>
          <select id="school-lang" value={form.defaultLanguage} onChange={(e) => setForm((f) => ({ ...f, defaultLanguage: e.target.value as "EN" | "NL" }))}>
            <option value="EN">English</option>
            <option value="NL">Nederlands</option>
          </select>
        </div>
        <div className="field">
          <label>
            <input
              type="checkbox"
              style={{ width: "auto", marginRight: 8 }}
              checked={form.whatsappBotEnabled}
              onChange={(e) => setForm((f) => ({ ...f, whatsappBotEnabled: e.target.checked }))}
            />
            WhatsApp bot notifications enabled
          </label>
          <p style={{ fontSize: "0.75rem", color: "var(--gray-600)", marginTop: 6 }}>
            Notifications only actually send once WHATSAPP_API_KEY / WHATSAPP_PHONE_NUMBER_ID are configured in the
            environment — this toggle controls intent, not credentials.
          </p>
        </div>

        <button type="submit" className="btn btn-primary" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
