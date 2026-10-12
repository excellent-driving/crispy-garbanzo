import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { packageName } from "@/lib/progress";
import { BookingWizard } from "./booking-wizard";

const dayOrder = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
const packageDisplayOrder = ["Starter", "Standard", "Premium", "Refresher"];

const shortDay: Record<string, Record<string, string>> = {
  en: { MON: "Mon", TUE: "Tue", WED: "Wed", THU: "Thu", FRI: "Fri", SAT: "Sat" },
  nl: { MON: "ma", TUE: "di", WED: "wo", THU: "do", FRI: "vr", SAT: "za" },
};

function describeAvailability(days: string[], t: Awaited<ReturnType<typeof getTranslations<"Booking">>>, locale: string) {
  const set = new Set(days);
  if (dayOrder.every((d) => set.has(d))) return t("availableMonSat");
  if (["MON", "TUE", "WED", "THU", "FRI"].every((d) => set.has(d)) && !set.has("SAT")) {
    return t("availableMonFri");
  }
  const short = shortDay[locale] ?? shortDay.en;
  return t("availableDays", { days: dayOrder.filter((d) => set.has(d)).map((d) => short[d]).join(", ") });
}

export default async function BookingPage() {
  const [locale, t] = [await getLocale(), await getTranslations("Booking")];
  const [packagesRaw, instructors] = await Promise.all([
    prisma.package.findMany({ where: { isActive: true } }),
    prisma.instructor.findMany({
      where: { isActive: true },
      include: { user: true, schedules: true },
      orderBy: { yearsExperience: "desc" },
    }),
  ]);

  const orderOf = (name: string) => {
    const i = packageDisplayOrder.indexOf(name);
    return i === -1 ? packageDisplayOrder.length : i; // unknown packages sort last, not first
  };
  const packages = [...packagesRaw].sort((a, b) => orderOf(a.nameEn) - orderOf(b.nameEn));

  return (
    <BookingWizard
      packages={packages.map((p) => ({ id: p.id, name: packageName(p, locale), price: Number(p.price) }))}
      instructors={instructors.map((i) => ({
        id: i.id,
        name: i.user.name,
        yearsExperience: i.yearsExperience,
        availableDays: describeAvailability(i.schedules.map((s) => s.dayOfWeek), t, locale),
      }))}
    />
  );
}
