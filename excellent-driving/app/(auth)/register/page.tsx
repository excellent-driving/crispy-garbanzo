"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("Auth");
  const locale = useLocale();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    language: locale === "nl" ? "NL" : "EN",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : t("registrationFailed"));
      setSubmitting(false);
      return;
    }

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setSubmitting(false);

    if (result?.error) {
      router.push("/login");
      return;
    }

    router.push("/student/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-[var(--color-navy)]/10 p-8 shadow-sm"
      >
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)]">
          {t("registerTitle")}
        </h1>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <label className="block text-sm font-medium text-[var(--color-navy)]">
          {t("fullName")}
          <input
            required
            value={form.name}
            onChange={update("name")}
            className="mt-1 w-full rounded-lg border border-[var(--color-navy)]/20 px-3 py-2 focus:border-[var(--color-amber)] focus:outline-none"
          />
        </label>

        <label className="block text-sm font-medium text-[var(--color-navy)]">
          {t("email")}
          <input
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            className="mt-1 w-full rounded-lg border border-[var(--color-navy)]/20 px-3 py-2 focus:border-[var(--color-amber)] focus:outline-none"
          />
        </label>

        <label className="block text-sm font-medium text-[var(--color-navy)]">
          {t("phone")}
          <input
            value={form.phone}
            onChange={update("phone")}
            className="mt-1 w-full rounded-lg border border-[var(--color-navy)]/20 px-3 py-2 focus:border-[var(--color-amber)] focus:outline-none"
          />
        </label>

        <label className="block text-sm font-medium text-[var(--color-navy)]">
          {t("password")}
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={update("password")}
            className="mt-1 w-full rounded-lg border border-[var(--color-navy)]/20 px-3 py-2 focus:border-[var(--color-amber)] focus:outline-none"
          />
        </label>

        <label className="block text-sm font-medium text-[var(--color-navy)]">
          {t("language")}
          <select
            value={form.language}
            onChange={update("language")}
            className="mt-1 w-full rounded-lg border border-[var(--color-navy)]/20 px-3 py-2 focus:border-[var(--color-amber)] focus:outline-none"
          >
            <option value="EN">English</option>
            <option value="NL">Nederlands</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[var(--color-amber)] px-6 py-3 font-semibold text-[var(--color-navy)] transition hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? t("creatingAccount") : t("createAccount")}
        </button>

        <p className="text-center text-sm text-[var(--color-navy)]/60">
          {t("haveAccount")}{" "}
          <a href="/login" className="font-semibold text-[var(--color-navy)] underline">
            {t("logIn")}
          </a>
        </p>
      </form>
    </main>
  );
}
