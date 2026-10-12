import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/request";
import type en from "@/messages/en.json";

export type ErrorKey = keyof (typeof en)["Errors"];

/** A JSON error response whose message is in the visitor's language (messages "Errors" section). */
export async function apiError(key: ErrorKey, status: number) {
  const t = await getTranslations({ locale: await resolveLocale(), namespace: "Errors" });
  return NextResponse.json({ error: t(key) }, { status });
}
