import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { FaqAccordion } from "@/components/faq-accordion";
import { getSchool } from "@/lib/school";
import { BOOKING_ENABLED, SHOW_PRICES } from "@/lib/features";
import styles from "./home.module.css";

const packageIcons: Record<string, string> = {
  Starter: "🚀",
  Standard: "⭐",
  Premium: "💎",
  Refresher: "🔄",
};

export default async function HomePage() {
  const t = await getTranslations("Home");
  const locale = await getLocale();
  const isNl = locale === "nl";

  const [packages, instructors, faqs, instructorCount, school] = await Promise.all([
    prisma.package.findMany({
      where: { isActive: true, nameEn: { in: ["Starter", "Standard", "Premium"] } },
      orderBy: { price: "asc" },
    }),
    prisma.instructor.findMany({
      where: { isActive: true },
      include: { user: true },
      take: 3,
      orderBy: { yearsExperience: "desc" },
    }),
    prisma.fAQ.findMany({
      where: { language: isNl ? "NL" : "EN" },
      orderBy: { orderIndex: "asc" },
      take: 5,
    }),
    prisma.instructor.count({ where: { isActive: true } }),
    getSchool(),
  ]);

  const steps = [
    { num: 1, title: t("step1Title"), body: t("step1Body") },
    { num: 2, title: t("step2Title"), body: t("step2Body") },
    { num: 3, title: t("step3Title"), body: t("step3Body") },
  ];

  const journeyItems = BOOKING_ENABLED
    ? [
        { icon: "📚", label: t("journeyTheory"), sub: t("journeyTheorySub") },
        { icon: "🚗", label: t("journeyPractical"), sub: t("journeyPracticalSub") },
        { icon: "🎓", label: t("journeyExam"), sub: t("journeyExamSub") },
        { icon: "📱", label: t("journeyWhatsapp"), sub: t("journeyWhatsappSub") },
      ]
    : [
        { icon: "📚", label: t("journeyTheory"), sub: t("journeyTheorySub") },
        { icon: "🚦", label: t("journeySigns"), sub: t("journeySignsSub") },
        { icon: "🎓", label: t("journeyExam"), sub: t("journeyExamSub") },
        { icon: "📱", label: t("journeyPhone"), sub: t("journeyPhoneSub") },
      ];
  // Without booking, a package's button asks for the price (WhatsApp when set, else the contact page).
  const packageHref = BOOKING_ENABLED ? "/booking" : school.contact.whatsappUrl ?? "/contact";

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles["hero-inner"]}>
          <div>
            <div className={styles["hero-badge"]}>
              <span aria-hidden="true">🏆</span> <span>{t("badge")}</span>
            </div>
            <h1>
              {t("heroTitle1")}
              <br />
              {t("heroWith")} <span>{t("heroConfidence")}</span>
            </h1>
            <p>{t("heroSubtitle")}</p>
            <div className={styles["hero-ctas"]}>
              {BOOKING_ENABLED ? (
                <Link href="/booking" className="btn btn-primary btn-lg">{t("bookALesson")}</Link>
              ) : (
                <Link href="/register" className="btn btn-primary btn-lg">{t("getStarted")}</Link>
              )}
              <Link href="/packages" className="btn btn-white btn-lg">{t("viewPackages")}</Link>
            </div>
          </div>

          <div className={styles["hero-visual"]}>
            <div className={styles["hero-card"]}>
              <div className={styles["hero-card-title"]}>{t("journeyTitle")}</div>
              {journeyItems.map((item) => (
                <div className={styles["cert-item"]} key={item.label}>
                  <div className={styles["cert-icon"]} aria-hidden="true">{item.icon}</div>
                  <div>
                    <div className={styles["cert-label"]}>{item.label}</div>
                    <div className={styles["cert-sub"]}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className={styles["stats-bar"]}>
        <div className={styles["stats-inner"]}>
          {/* Students trained and pass rate come from Admin › Settings and stay hidden until filled in. */}
          {school.stats.students && (
            <div className={styles.stat}>
              <div className={styles["stat-number"]}>{school.stats.students}</div>
              <div className={styles["stat-label"]}>{t("statsStudents")}</div>
            </div>
          )}
          {BOOKING_ENABLED && (
            <div className={styles.stat}>
              <div className={styles["stat-number"]}>{instructorCount}</div>
              <div className={styles["stat-label"]}>{t("statsInstructors")}</div>
            </div>
          )}
          <div className={styles.stat}>
            <div className={styles["stat-number"]}>{school.openingDays[isNl ? "nl" : "en"]}</div>
            <div className={styles["stat-label"]}>{t("statsAvailable", { times: school.openingTimes })}</div>
          </div>
          {school.stats.passRate && (
            <div className={styles.stat}>
              <div className={styles["stat-number"]}>{school.stats.passRate}</div>
              <div className={styles["stat-label"]}>{t("statsPassRate")}</div>
            </div>
          )}
        </div>
      </div>

      {/* PACKAGES PREVIEW */}
      <section className={styles["packages-section"]}>
        <div className="section-inner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="section-tag">{t("packagesTag")}</div>
              <h2 className="section-title">
                {t("packagesTitle1")}
                <br />
                {t("packagesTitle2")}
              </h2>
              <p className="section-sub">{t("packagesSubtitle")}</p>
            </div>
            <Link href="/packages" className="btn btn-outline">{t("seeAllPackages")} →</Link>
          </div>

          <div className={styles["packages-grid"]}>
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`${styles["package-card"]}${pkg.featured ? ` ${styles.featured}` : ""}`}
              >
                {pkg.featured && <div className={styles["package-badge"]}>{t("mostPopular")}</div>}
                <div className={styles["package-icon"]} aria-hidden="true">
                  {packageIcons[pkg.nameEn] ?? "🚗"}
                </div>
                <div className={styles["package-name"]}>{isNl ? pkg.nameNl : pkg.nameEn}</div>
                <div className={styles["package-desc"]}>{isNl ? pkg.descriptionNl : pkg.descriptionEn}</div>
                <div className={`${styles["package-price"]}${SHOW_PRICES ? "" : ` ${styles["on-request"]}`}`}>
                  {SHOW_PRICES ? (
                    <>SRD {Number(pkg.price).toLocaleString(isNl ? "nl-NL" : "en-US")} <span>{t("perPackage")}</span></>
                  ) : (
                    t("priceOnRequest")
                  )}
                </div>
                <div className={styles["package-includes"]}>
                  <div className={`${styles["include-item"]} ${styles.excluded}`}>
                    {t("includeNoPractical")}
                  </div>
                  <div className={styles["include-item"]}>{t("includeTheory")}</div>
                  <div className={styles["include-item"]}>{t("includeWhatsapp")}</div>
                </div>
                <Link
                  href={packageHref}
                  className={`btn ${pkg.featured ? "btn-primary" : "btn-outline"} ${styles["full-width-cta"]}`}
                  {...(packageHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {BOOKING_ENABLED ? t("bookThisPackage") : t("askPrice")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section>
        <div className="section-inner" style={{ textAlign: "center" }}>
          <div className="section-tag">{t("processTag")}</div>
          <h2 className="section-title">{t("howItWorks")}</h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>{t("threeSteps")}</p>

          <div className={styles["steps-grid"]}>
            {steps.map((step) => (
              <div className={styles.step} key={step.num}>
                <div className={styles["step-num"]}>{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTORS */}
      {BOOKING_ENABLED && (
      <section style={{ background: "var(--gray-50)" }}>
        <div className="section-inner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 0 }}>
            <div>
              <div className="section-tag">{t("instructorsTag")}</div>
              <h2 className="section-title">{t("meetOurTeam")}</h2>
              <p className="section-sub">{t("instructorsSubtitle")}</p>
            </div>
            <Link href="/instructors" className="btn btn-outline">{t("viewAllInstructors")} →</Link>
          </div>

          <div className={styles["instructors-scroll"]}>
            {instructors.map((instructor) => (
              <div className={styles["instructor-card"]} key={instructor.id}>
                <div className={styles["instructor-photo"]}>
                  <div className={styles["instructor-avatar"]}>👤</div>
                </div>
                <div className={styles["instructor-info"]}>
                  <div className={styles["instructor-name"]}>{instructor.user.name}</div>
                  <div className={styles["instructor-years"]}>
                    {t("years", { years: instructor.yearsExperience ?? 0 })}
                  </div>
                  <div className={styles["instructor-bio"]}>{(isNl && instructor.bioNl) || instructor.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* FAQ */}
      <section className={styles["faq-section"]}>
        <div className="section-inner">
          <div className={styles["faq-grid"]}>
            <div>
              <div className="section-tag">{t("faqTag")}</div>
              <h2 className="section-title">{t("faqTitle")}</h2>
              <p className="section-sub">{t("faqSubtitle")}</p>
              <br />
              <Link href="/faq" className="btn btn-primary" style={{ marginTop: 8 }}>{t("viewAllQuestions")} →</Link>
            </div>
            <div className={styles["faq-list"]}>
              <FaqAccordion
                items={faqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
