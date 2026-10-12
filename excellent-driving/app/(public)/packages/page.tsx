import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { PackagesGrid } from "./packages-grid";
import styles from "./packages.module.css";

const displayOrder = ["Starter", "Standard", "Premium", "Refresher"];

export default async function PackagesPage() {
  const t = await getTranslations("Packages");
  const locale = await getLocale();
  const isNl = locale === "nl";

  const packages = await prisma.package.findMany({ where: { isActive: true } });
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
                  <td><span className={styles.check}>✓</span> {t("fullVideo")}</td>
                  <td><span className={styles.check}>✓</span> {t("days30")}</td>
                </tr>
                <tr>
                  <td><strong>{t("rowMock")}</strong></td>
                  <td><span className={styles.cross}>—</span></td>
                  <td className={styles.highlight}>{t("sessions2")}</td>
                  <td>{t("unlimited")}</td>
                  <td>{t("session1")}</td>
                </tr>
                <tr>
                  <td><strong>{t("rowPriority")}</strong></td>
                  <td><span className={styles.cross}>—</span></td>
                  <td className={styles.highlight}><span className={styles.check}>✓</span></td>
                  <td><span className={styles.check}>✓</span></td>
                  <td><span className={styles.cross}>—</span></td>
                </tr>
                <tr>
                  <td><strong>{t("rowWhatsapp")}</strong></td>
                  <td><span className={styles.check}>✓</span></td>
                  <td className={styles.highlight}><span className={styles.check}>✓</span></td>
                  <td><span className={styles.check}>✓</span></td>
                  <td><span className={styles.check}>✓</span></td>
                </tr>
                <tr>
                  <td><strong>{t("rowDedicated")}</strong></td>
                  <td><span className={styles.cross}>—</span></td>
                  <td className={styles.highlight}><span className={styles.cross}>—</span></td>
                  <td><span className={styles.check}>✓</span></td>
                  <td><span className={styles.cross}>—</span></td>
                </tr>
                <tr>
                  <td><strong>{t("rowExamDay")}</strong></td>
                  <td><span className={styles.cross}>—</span></td>
                  <td className={styles.highlight}><span className={styles.cross}>—</span></td>
                  <td><span className={styles.check}>✓</span></td>
                  <td><span className={styles.cross}>—</span></td>
                </tr>
                <tr>
                  <td><strong>{t("rowPrice")}</strong></td>
                  <td><strong>SRD {Number(byName.Starter?.price ?? 0).toLocaleString(isNl ? "nl-NL" : "en-US")}</strong></td>
                  <td className={styles.highlight}><strong>SRD {Number(byName.Standard?.price ?? 0).toLocaleString(isNl ? "nl-NL" : "en-US")}</strong></td>
                  <td><strong>SRD {Number(byName.Premium?.price ?? 0).toLocaleString(isNl ? "nl-NL" : "en-US")}</strong></td>
                  <td><strong>SRD {Number(byName.Refresher?.price ?? 0).toLocaleString(isNl ? "nl-NL" : "en-US")}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className={styles["cta-banner"]}>
        <h2>{t("ctaTitle")}</h2>
        <p>{t("ctaSubtitle")}</p>
        <div className={styles["cta-actions"]}>
          <Link href="/booking" className="btn btn-primary btn-lg">{t("bookFirstLesson")}</Link>
          <Link href="/contact" className="btn btn-white btn-lg">{t("askQuestion")}</Link>
        </div>
      </div>
    </>
  );
}
