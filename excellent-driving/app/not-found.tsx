import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import styles from "./not-found.module.css";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Meta"))("notFound") };
}

export default async function NotFound() {
  const t = await getTranslations("Meta");
  return (
    <main className={styles.wrap}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>{t("notFound")}</h1>
      <p className={styles.text}>{t("notFoundText")}</p>
      <Link href="/" className={styles.button}>{t("notFoundHome")} →</Link>
    </main>
  );
}
