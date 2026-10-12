import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { FaqList } from "./faq-list";
import styles from "./faq.module.css";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Meta"))("faq") };
}

export default async function FaqPage() {
  const [t, locale] = await Promise.all([getTranslations("Faq"), getLocale()]);
  const [en, nl] = await Promise.all([
    prisma.fAQ.findMany({ where: { language: "EN" }, orderBy: { orderIndex: "asc" } }),
    prisma.fAQ.findMany({ where: { language: "NL" }, orderBy: { orderIndex: "asc" } }),
  ]);

  return (
    <>
      <div className={styles["page-header"]}>
        <div className={styles["page-header-inner"]}>
          <div className={styles.breadcrumb}>
            <Link href="/">{t("home")}</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>{t("breadcrumb")}</span>
          </div>
          <h1>{t("title")}</h1>
          <p>{t("intro")}</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles["content-inner"]}>
          <FaqList
            initialLang={locale === "nl" ? "nl" : "en"}
            en={en.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))}
            nl={nl.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))}
          />
        </div>
      </div>
    </>
  );
}
