import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import styles from "./instructors.module.css";

const dayLabels: Record<string, Record<string, string>> = {
  en: { MON: "Mon", TUE: "Tue", WED: "Wed", THU: "Thu", FRI: "Fri", SAT: "Sat" },
  nl: { MON: "ma", TUE: "di", WED: "wo", THU: "do", FRI: "vr", SAT: "za" },
};
const dayOrder = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Meta"))("instructors") };
}

export default async function InstructorsPage() {
  const [t, locale] = await Promise.all([getTranslations("Instructors"), getLocale()]);
  const days = dayLabels[locale] ?? dayLabels.en;
  const instructors = await prisma.instructor.findMany({
    where: { isActive: true },
    include: { user: true, schedules: true },
    orderBy: { yearsExperience: "desc" },
  });

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
          <div className={styles["instructors-grid"]}>
            {instructors.map((instructor) => {
              const workDays = dayOrder.filter((d) =>
                instructor.schedules.some((s) => s.dayOfWeek === d)
              );
              return (
                <div className={styles["instructor-card"]} key={instructor.id}>
                  <div className={styles["instructor-photo"]}>
                    <div className={styles["instructor-avatar"]} aria-hidden="true">👤</div>
                  </div>
                  <div className={styles["instructor-info"]}>
                    <div className={styles["instructor-name"]}>{instructor.user.name}</div>
                    <div className={styles["instructor-years"]}>
                      {t("years", { years: instructor.yearsExperience ?? 0 })}
                    </div>
                    <div className={styles["instructor-bio"]}>
                      {(locale === "nl" && instructor.bioNl) || instructor.bio}
                    </div>
                    {workDays.length > 0 && (
                      <div className={styles["instructor-days"]}>
                        {t("available", { days: workDays.map((d) => days[d]).join(", ") })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
