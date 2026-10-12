"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setSubmitting(false);

    if (result?.error) {
      setError(result.error === "locked" ? t("locked") : t("invalidLogin"));
      return;
    }

    const session = await getSession();
    router.push(session?.user.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-[var(--color-navy)]/10 p-8 shadow-sm"
      >
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)]">
          {t("loginTitle")}
        </h1>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <label className="block text-sm font-medium text-[var(--color-navy)]">
          {t("email")}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-navy)]/20 px-3 py-2 focus:border-[var(--color-amber)] focus:outline-none"
          />
        </label>

        <label className="block text-sm font-medium text-[var(--color-navy)]">
          {t("password")}
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-navy)]/20 px-3 py-2 focus:border-[var(--color-amber)] focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[var(--color-amber)] px-6 py-3 font-semibold text-[var(--color-navy)] transition hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? t("loggingIn") : t("logIn")}
        </button>

        <p className="text-center text-sm text-[var(--color-navy)]/60">
          {t("noAccount")}{" "}
          <a href="/register" className="font-semibold text-[var(--color-navy)] underline">
            {t("register")}
          </a>
        </p>
      </form>
    </main>
  );
}
