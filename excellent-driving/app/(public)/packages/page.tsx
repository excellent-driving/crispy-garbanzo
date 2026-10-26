import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getSchool } from "@/lib/school";
import { BOOKING_ENABLED, SHOW_PRICES } from "@/lib/features";
import { PackagesGrid } from "./packages-grid";
import styles from "./packages.module.css";

const displayOrder = ["Starter", "Standard", "Premium", "Refresher"];

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Meta"))("packages") };
}

export default async function PackagesPage() {
  const t = await getTranslations("Packages");
  const locale = await getLocale();
  const isNl = locale === "nl";

  const [packages, school] = await Promise.all([prisma.package.findMany({ where: { isActive: true } }), getSchool()]);
  const money = (price: unknown) =>
    SHOW_PRICES ? `SRD ${Number(price ?? 0).toLocaleString(isNl ? "nl-NL" : "en-US")}` : t("onRequest");
  const orderOf = (name: string) => {
    const i = displayOrder.indexOf(name);
    return i === -1 ? displayOrder.length : i; // unknown packages sort last, not first
  };
  const sorted = [...packages].sort((a, b) => orderOf(a.nameEn) - orderOf(b.nameEn));
  const byName = Object.fromEntries(sorted.map((p) => [p.nameEn, p]));

  return (
    <>
      <div className={styles["page-header"]}>
        <div className={styles["page-header-inner"]}>
          <div className={styles.breadcrumb}>
            <Link href="/">{t("breadcrumbHome")}</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>{t("breadcrumbPackages")}</span>
          </div>
          <h1>{t("pageTitle")}</h1>
          <p>{t("pageSubtitle")}</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles["content-inner"]}>
          <PackagesGrid
            contactHref={school.contact.whatsappUrl ?? "/contact"}
            packages={sorted.map((p) => ({
              id: p.id,
              nameEn: p.nameEn,
              nameNl: p.nameNl,
              descriptionEn: p.descriptionEn,
              descriptionNl: p.descriptionNl,
              price: Number(p.price),
              featured: p.featured,
            }))}
          />
        </div>
      </div>

      <section className={styles.comparison}>
        <div className={styles["comparison-inner"]}>
          <h2 className={styles["comparison-title"]}>{t("comparisonTitle")}</h2>
          <p className={styles["comparison-sub"]}>{t("comparisonSubtitle")}</p>

          <div style={{ overflowX: "auto" }}>
            <table className={styles["comp-table"]}>
              <thead>
                <tr>
                  <th>{t("featureCol")}</th>
                  <th>{isNl ? byName.Starter?.nameNl : "Starter"}</th>
                  <th className={styles.highlight}>{(isNl ? byName.Standard?.nameNl : "Standard") ?? "Standard"} ⭐</th>
                  <th>{isNl ? byName.Premium?.nameNl : "Premium"}</th>
                  <th>{isNl ? byName.Refresher?.nameNl : "Refresher"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>{t("rowPractical")}</strong></td>
                  <td><span className={styles.cross}>—</span> {t("notIncluded")}</td>
                  <td className={styles.highlight}><span className={styles.cross}>—</span> {t("notIncluded")}</td>
                  <td><span className={styles.cross}>—</span> {t("notIncluded")}</td>
                  <td><span className={styles.cross}>—</span> {t("notIncluded")}</td>
                </tr>
                <tr>
                  <td><strong>{t("rowTheory")}</strong></td>
                  <td><span className={styles.check}>✓</span> {t("basic")}</td>
                  <td className={styles.highlight}><span className={styles.check}>✓</span> {t("full")}</td>
                  <td><span className={styles.check}>✓</span> {t("full")}</td>
                  <td><span className={styles.check}>✓</span> {t("days7")}</td>
                </tr>
                <tr>
                  <td><strong>{t("rowWhatsapp")}</strong></td>
                  <td><span className={styles.check}>✓</span></td>
                  <td className={styles.highlight}><span className={styles.check}>✓</span></td>
                  <td><span className={styles.check}>✓</span></td>
                  <td><span className={styles.check}>✓</span></td>
                </tr>
                <tr>
                  <td><strong>{t("rowPrice")}</strong></td>
                  <td><strong>{money(byName.Starter?.price)}</strong></td>
                  <td className={styles.highlight}><strong>{money(byName.Standard?.price)}</strong></td>
                  <td><strong>{money(byName.Premium?.price)}</strong></td>
                  <td><strong>{money(byName.Refresher?.price)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className={styles["cta-banner"]}>
        <h2>{t("ctaTitle")}</h2>
        <div className={styles["cta-actions"]}>
          {BOOKING_ENABLED ? (
            <Link href="/booking" className="btn btn-primary btn-lg">{t("bookFirstLesson")}</Link>
          ) : (
            <Link href="/register" className="btn btn-primary btn-lg">{t("createAccount")}</Link>
          )}
          <Link href="/contact" className="btn btn-white btn-lg">{t("askQuestion")}</Link>
        </div>
      </div>
    </>
  );
}
