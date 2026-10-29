import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getSchool } from "@/lib/school";
import { BOOKING_ENABLED, SHOW_PRICES } from "@/lib/features";
import { PackagesGrid } from "./packages-grid";
import styles from "./packages.module.css";

const displayOrder = ["Basic", "Complete", "Refresher"];

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

  // One row per feature; a package the table doesn't know (added in the admin) shows "—".
  type Cell = { mark?: "yes" | "no"; text?: string; bold?: boolean };
  const pick = (values: Record<string, Cell>) => (p: { nameEn: string }) => values[p.nameEn] ?? { mark: "no" as const };
  const rows: { label: string; cell: (p: (typeof sorted)[number]) => Cell }[] = [
    { label: t("rowPractical"), cell: () => ({ mark: "no", text: t("notIncluded") }) },
    {
      label: t("rowTheory"),
      cell: pick({ Basic: { mark: "yes", text: t("lessons1to6Short") }, Complete: { mark: "yes", text: t("allLessonsShort") }, Refresher: { mark: "no" } }),
    },
    {
      label: t("rowExamQuestions"),
      cell: pick({ Basic: { mark: "no" }, Complete: { mark: "yes" }, Refresher: { mark: "yes", text: t("days7") } }),
    },
    { label: t("rowWhatsapp"), cell: () => ({ mark: "yes" }) },
    { label: t("rowPrice"), cell: (p) => ({ text: money(p.price), bold: true }) },
  ];

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
                  {sorted.map((p) => (
                    <th key={p.id} className={p.featured ? styles.highlight : undefined}>
                      {isNl ? p.nameNl : p.nameEn}{p.featured ? " ⭐" : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <td><strong>{row.label}</strong></td>
                    {sorted.map((p) => {
                      const cell = row.cell(p);
                      return (
                        <td key={p.id} className={p.featured ? styles.highlight : undefined}>
                          {cell.mark === "yes" && <span className={styles.check}>✓</span>}
                          {cell.mark === "no" && <span className={styles.cross}>—</span>}
                          {cell.mark && cell.text ? " " : ""}
                          {cell.bold ? <strong>{cell.text}</strong> : cell.text}
                        </td>
                      );
                    })}
                  </tr>
                ))}
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
