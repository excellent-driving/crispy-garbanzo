"use client";

import { useState } from "react";

/** Lets the logged-in admin choose a new password. */
export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== repeat) {
      setError("The new passwords don't match.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    const res = await fetch("/api/student/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Could not change the password.");
      setStatus("error");
      return;
    }
    setStatus("saved");
    setCurrentPassword("");
    setNewPassword("");
    setRepeat("");
  }

  return (
    <form className="card" onSubmit={save} style={{ maxWidth: 560 }}>
      <div className="card-header">
        <div className="card-title">Change Your Password</div>
      </div>
      <div className="card-body">
        {status === "saved" && <p className="status-banner-success">Password changed. Use the new password next time you log in.</p>}
        {status === "error" && <p className="status-banner-error">{error}</p>}
        <div className="field">
          <label htmlFor="admin-current-password">Current password</label>
          <input id="admin-current-password" type="password" autoComplete="current-password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="admin-new-password">New password (at least 12 characters)</label>
            <input id="admin-new-password" type="password" autoComplete="new-password" minLength={12} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="admin-repeat-password">Repeat new password</label>
            <input id="admin-repeat-password" type="password" autoComplete="new-password" minLength={12} required value={repeat} onChange={(e) => setRepeat(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Change Password"}
        </button>
      </div>
    </form>
  );
}
