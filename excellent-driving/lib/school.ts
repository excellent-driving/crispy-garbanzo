import { prisma } from "@/lib/prisma";

export type SchoolContact = {
  address: string;
  /** Null while the admin settings still hold the placeholder number. */
  phone: string | null;
  email: string;
  /** Contact person and owner; null when not filled in. */
  person: string | null;
  /** A wa.me chat link, or null when no WhatsApp number is set. */
  whatsappUrl: string | null;
  /** Opening hours in each language, e.g. "Ma–Za: 7:00–18:00". */
  hours: { nl: string; en: string };
};

export type BankDetails = { name: string; holder: string; number: string };

export type School = {
  name: string;
  contact: SchoolContact;
  /** Null until an account number is set; bank transfer isn't offered until then. */
  bank: BankDetails | null;
  lessonsAfterPayment: boolean;
  /** Homepage numbers; null when not filled in, so nothing made up is shown. */
  stats: { students: string | null; passRate: string | null };
  openingTimes: string;
  openingDays: { nl: string; en: string };
};

/** Everything the site shows about the school, as entered under Admin › Settings. */
export async function getSchool(): Promise<School> {
  const s = await prisma.schoolSettings.findUnique({ where: { id: "school" } });
  const phone = s?.phone?.trim() ?? "";
  const whatsappDigits = (s?.whatsappNumber ?? "").replace(/\D/g, "");
  const days = { nl: s?.openingDaysNl || "Ma–Za", en: s?.openingDaysEn || "Mon–Sat" };
  const times = s?.openingTimes || "7:00–18:00";
  const text = (v: string | undefined) => (v?.trim() ? v.trim() : null);
  return {
    name: s?.schoolName || "Excellent Driving",
    contact: {
      address: s?.address || "Bonistraat 44, Paramaribo",
      phone: phone && !/X/i.test(phone) ? phone : null,
      email: s?.email || "info@excellentdriving.sr",
      person: text(s?.contactName),
      whatsappUrl: whatsappDigits ? `https://wa.me/${whatsappDigits}` : null,
      hours: { nl: `${days.nl}: ${times}`, en: `${days.en}: ${times}` },
    },
    bank: s?.bankAccountNumber?.trim()
      ? { name: s.bankName.trim(), holder: s.bankAccountHolder.trim(), number: s.bankAccountNumber.trim() }
      : null,
    lessonsAfterPayment: s?.lessonsAfterPayment ?? false,
    stats: { students: text(s?.statStudents), passRate: text(s?.statPassRate) },
    openingTimes: times,
    openingDays: days,
  };
}

/** The school's contact details as entered under Admin › Settings. */
export async function getSchoolContact(): Promise<SchoolContact> {
  return (await getSchool()).contact;
}

/** The contact form shows only when CONTACT_FORM_ENABLED is "true" and Resend
 * has a key. Resend's test mode only delivers to its own account's address, so
 * keep the flag off until the school's own Resend account sends the mail. */
export function contactFormEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY) && process.env.CONTACT_FORM_ENABLED === "true";
}
