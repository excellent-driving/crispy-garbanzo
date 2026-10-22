"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
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
  { icon: string; tags: string[]; stats: { num: string; key: "statPractical" | "statTheory" }[]; includes: Feature[] }
> = {
  Starter: {
    icon: "🚀",
    tags: ["beginner"],
    stats: [
      { num: "0", key: "statPractical" },
      { num: "✓", key: "statTheory" },
    ],
    includes: [
      { key: "noPractical", included: false },
      { key: "onlineTheory", included: true },
      { key: "quizzesUnlimited", included: true },
      { key: "whatsappBooking", included: true },
      { key: "certificate", included: true },
    ],
  },
  Standard: {
    icon: "🎯",
    tags: ["beginner", "theory"],
    stats: [
      { num: "0", key: "statPractical" },
      { num: "✓", key: "statTheory" },
    ],
    includes: [
      { key: "noPractical", included: false },
      { key: "fullTheory", included: true },
      { key: "whatsappReminders", included: true },
      { key: "certificate", included: true },
    ],
  },
  Premium: {
    icon: "💎",
    tags: ["theory", "exam"],
    stats: [
      { num: "0", key: "statPractical" },
      { num: "✓", key: "statTheory" },
    ],
    includes: [
      { key: "noPractical", included: false },
      { key: "fullTheory", included: true },
    ],
  },
  Refresher: {
    icon: "🔄",
    tags: ["exam"],
    stats: [],
    includes: [
      { key: "noPractical", included: false },
      { key: "quiz30", included: true },
      { key: "fullTheory", included: false },
    ],
  },
};

const fallbackIncludes: Feature[] = [
  { key: "noPractical", included: false },
  { key: "onlineTheory", included: true },
  { key: "whatsappSupport", included: true },
  { key: "certificate", included: true },
];

/** Every known package has hand-tuned copy above; anything else (e.g. a
 * package created later in the admin panel) falls back to generic content
 * derived from real fields, instead of crashing on an unrecognized name. */
function getMeta(name: string) {
  return packageMeta[name] ?? { icon: "🚗", tags: [] as string[], stats: [] as { num: string; key: "statPractical" }[], includes: fallbackIncludes };
}

export function PackagesGrid({ packages }: { packages: Pkg[] }) {
  const t = useTranslations("Packages");
  const locale = useLocale();
  const isNl = locale === "nl";
  const [filter, setFilter] = useState("all");

  const filters = [
    { value: "all", label: t("filterAll") },
    { value: "beginner", label: t("filterBeginner") },
    { value: "theory", label: t("filterTheory") },
    { value: "exam", label: t("filterExam") },
  ];

  const regular = packages.filter((p) => p.nameEn !== "Refresher");
  const refresher = packages.find((p) => p.nameEn === "Refresher");

  const matchesFilter = (name: string) => filter === "all" || getMeta(name).tags.includes(filter);

  const visibleRegular = regular.filter((p) => matchesFilter(p.nameEn));
  const visibleRefresher = refresher && matchesFilter(refresher.nameEn) ? refresher : null;
  const totalVisible = visibleRegular.length + (visibleRefresher ? 1 : 0);

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
          {t("showing")} <strong>{totalVisible}</strong> {t("packagesWord")}
        </div>
      </div>

      <div className={styles["packages-grid"]}>
        {visibleRegular.map((pkg) => {
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
                <div className={styles["pkg-price-row"]}>
                  <div className={styles["pkg-price"]}>{pkg.price.toLocaleString(isNl ? "nl-NL" : "en-US")}</div>
                  <div className={styles["pkg-currency"]}>SRD</div>
                  <div className={styles["pkg-period"]}>{t("perPackage")}</div>
                </div>
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
                  href="/booking"
                  className={`btn ${pkg.featured ? "btn-primary" : "btn-outline"} ${styles["pkg-cta"]}`}
                >
                  {t("bookPackage", { name: isNl ? pkg.nameNl : pkg.nameEn })}
                </Link>
              </div>
            </div>
          );
        })}

        {visibleRefresher && (
          <div className={`${styles["package-card"]} ${styles["refresher-card"]}`}>
            <div className={styles["refresher-inner"]}>
              <div className={`${styles["package-header"]} ${styles["refresher-header"]}`}>
                <div className={styles["pkg-icon"]} aria-hidden="true">🔄</div>
                <div className={styles["pkg-name"]}>{isNl ? visibleRefresher.nameNl : "Refresher"}</div>
                <div className={styles["pkg-tagline"]}>{isNl ? visibleRefresher.descriptionNl : visibleRefresher.descriptionEn}</div>
                <div className={styles["pkg-price-row"]}>
                  <div className={styles["pkg-price"]}>{visibleRefresher.price.toLocaleString(isNl ? "nl-NL" : "en-US")}</div>
                  <div className={styles["pkg-currency"]}>SRD</div>
                  <div className={styles["pkg-period"]}>{t("perPackage")}</div>
                </div>
              </div>
              <div className={styles["package-body"]}>
                <div className={styles["includes-title"]}>{t("whatsIncluded")}</div>
                <div className={styles["includes-list"]}>
                  {getMeta("Refresher").includes.map((item) => (
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
                  href="/booking"
                  className={`btn btn-outline ${styles["pkg-cta"]}`}
                  style={{ marginTop: "auto" }}
                >
                  {t("bookRefresher")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
