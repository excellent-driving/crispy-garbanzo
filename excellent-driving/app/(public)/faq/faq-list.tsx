"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FaqAccordion, type FaqItem } from "@/components/faq-accordion";
import styles from "./faq.module.css";

export function FaqList({ en, nl, initialLang }: { en: FaqItem[]; nl: FaqItem[]; initialLang: "en" | "nl" }) {
  const t = useTranslations("Faq");
  const [lang, setLang] = useState<"en" | "nl">(initialLang);
  const items = lang === "en" ? en : nl;

  return (
    <>
      <div className={styles["filter-bar"]}>
        <div className={styles["filter-label"]}>{t("filterLabel")}</div>
        <div className={styles["filter-tabs"]}>
          <button
            type="button"
            className={`${styles["filter-tab"]}${lang === "en" ? ` ${styles.active}` : ""}`}
            onClick={() => setLang("en")}
          >
            English
          </button>
          <button
            type="button"
            className={`${styles["filter-tab"]}${lang === "nl" ? ` ${styles.active}` : ""}`}
            onClick={() => setLang("nl")}
          >
            Nederlands
          </button>
        </div>
      </div>

      {items.length > 0 ? (
        <FaqAccordion key={lang} items={items} />
      ) : (
        <p style={{ color: "var(--gray-600)", fontSize: "0.9rem" }}>
          {t("none")}
        </p>
      )}
    </>
  );
}
