"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { BOOKING_ENABLED, SHOW_PRICES } from "@/lib/features";
import styles from "./packages.module.css";

type Pkg = {
  id: string;
  nameEn: string;
  nameNl: string;
  descriptionEn: string;
  descriptionNl: string;
  price: number;
  featured: boolean;
};

// Feature lists per package; the texts are message keys under Packages.features.
type Feature = { key: string; included: boolean };
const packageMeta: Record<
  string,
  { icon: string; tags: string[]; stats: { num: string; key: "statPractical" | "statTheory" | "statDays" }[]; includes: Feature[] }
> = {
  Basic: {
    icon: "🚀",
    tags: ["beginner"],
    stats: [
      { num: "0", key: "statPractical" },
      { num: "✓", key: "statTheory" },
    ],
    includes: [
      { key: "noPractical", included: false },
      { key: "lessons1to6", included: true },
      { key: "quizzesUnlimited", included: true },
      { key: "whatsappSupport", included: true },
      { key: "examQuestions", included: false },
    ],
  },
  Complete: {
    icon: "🎯",
    tags: ["beginner", "theory", "exam"],
    stats: [
      { num: "0", key: "statPractical" },
      { num: "✓", key: "statTheory" },
    ],
    includes: [
      { key: "noPractical", included: false },
      { key: "allLessons", included: true },
      { key: "quizzesUnlimited", included: true },
      { key: "examQuestions", included: true },
      { key: "whatsappSupport", included: true },
    ],
  },
  Refresher: {
    icon: "🔄",
    tags: ["exam"],
    stats: [
      { num: "0", key: "statPractical" },
      { num: "7", key: "statDays" },
    ],
    includes: [
      { key: "noPractical", included: false },
      { key: "examQuestions7", included: true },
      { key: "whatsappSupport", included: true },
      { key: "fullTheory", included: false },
    ],
  },
};

const fallbackIncludes: Feature[] = [
  { key: "noPractical", included: false },
  { key: "onlineTheory", included: true },
  { key: "whatsappSupport", included: true },
];

/** Every known package has hand-tuned copy above; anything else (e.g. a
 * package created later in the admin panel) falls back to generic content
 * derived from real fields, instead of crashing on an unrecognized name. */
function getMeta(name: string) {
  return packageMeta[name] ?? { icon: "🚗", tags: [] as string[], stats: [] as { num: string; key: "statPractical" }[], includes: fallbackIncludes };
}

/** The price, or "price on request" while prices are hidden. */
function PriceRow({ price, label }: { price: number; label: { perPackage: string; onRequest: string; locale: string } }) {
  if (!SHOW_PRICES) {
    return (
      <div className={styles["pkg-price-row"]}>
        <div className={`${styles["pkg-price"]} ${styles["on-request"]}`}>{label.onRequest}</div>
      </div>
    );
  }
  return (
    <div className={styles["pkg-price-row"]}>
      <div className={styles["pkg-price"]}>{price.toLocaleString(label.locale)}</div>
      <div className={styles["pkg-currency"]}>SRD</div>
      <div className={styles["pkg-period"]}>{label.perPackage}</div>
    </div>
  );
}

/** Without booking, a package's button asks for the price: WhatsApp when set, else the contact page. */
export function PackagesGrid({ packages, contactHref }: { packages: Pkg[]; contactHref: string }) {
  const t = useTranslations("Packages");
  const locale = useLocale();
  const isNl = locale === "nl";
  const [filter, setFilter] = useState("all");
  const priceLabel = { perPackage: t("perPackage"), onRequest: t("priceOnRequest"), locale: isNl ? "nl-NL" : "en-US" };
  const ctaHref = BOOKING_ENABLED ? "/booking" : contactHref;
  const ctaExtra = ctaHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

  const filters = [
    { value: "all", label: t("filterAll") },
    { value: "beginner", label: t("filterBeginner") },
    { value: "theory", label: t("filterTheory") },
    { value: "exam", label: t("filterExam") },
  ];

  const visible = packages.filter((p) => filter === "all" || getMeta(p.nameEn).tags.includes(filter));

  return (
    <>
      <div className={styles["filter-bar"]}>
        <div>
          <div className={styles["filter-label"]}>{t("filterLabel")}</div>
        </div>
        <div className={styles["filter-tabs"]}>
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`${styles["filter-tab"]}${filter === f.value ? ` ${styles.active}` : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className={styles["result-count"]}>
          {t("showing")} <strong>{visible.length}</strong> {t("packagesWord")}
        </div>
      </div>

      <div className={styles["packages-grid"]}>
        {visible.map((pkg) => {
          const meta = getMeta(pkg.nameEn);
          return (
            <div
              key={pkg.id}
              className={`${styles["package-card"]}${pkg.featured ? ` ${styles.featured}` : ""}`}
            >
              <div className={styles["package-header"]}>
                {pkg.featured && <div className={styles["popular-badge"]}>⭐ {t("mostPopular")}</div>}
                <div className={styles["pkg-icon"]} aria-hidden="true">{meta.icon}</div>
                <div className={styles["pkg-name"]}>{isNl ? pkg.nameNl : pkg.nameEn}</div>
                <div className={styles["pkg-tagline"]}>{isNl ? pkg.descriptionNl : pkg.descriptionEn}</div>
                <PriceRow price={pkg.price} label={priceLabel} />
              </div>
              <div className={styles["package-body"]}>
                <div className={styles["pkg-stats"]}>
                  {meta.stats.map((stat) => (
                    <div className={styles["pkg-stat"]} key={stat.key}>
                      <div className={styles["pkg-stat-num"]}>{stat.num}</div>
                      <div className={styles["pkg-stat-label"]}>{t(stat.key)}</div>
                    </div>
                  ))}
                </div>
                <div className={styles["includes-title"]}>{t("whatsIncluded")}</div>
                <div className={styles["includes-list"]}>
                  {meta.includes.map((item) => (
                    <div
                      key={item.key}
                      className={`${styles["include-item"]}${item.included ? "" : ` ${styles.unavailable}`}`}
                    >
                      <div className={item.included ? styles["check-icon"] : styles["cross-icon"]}>
                        {item.included ? "✓" : "✗"}
                      </div>
                      {t(`features.${item.key}`)}
                    </div>
                  ))}
                </div>
                <Link
                  href={ctaHref}
                  {...ctaExtra}
                  className={`btn ${pkg.featured ? "btn-primary" : "btn-outline"} ${styles["pkg-cta"]}`}
                >
                  {BOOKING_ENABLED ? t("bookPackage", { name: isNl ? pkg.nameNl : pkg.nameEn }) : t("askPrice")}
                </Link>
              </div>
            </div>
          );
        })}

      </div>
    </>
  );
}
