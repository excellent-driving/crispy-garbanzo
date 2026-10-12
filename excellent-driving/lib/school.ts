import { prisma } from "@/lib/prisma";

export type SchoolContact = {
  address: string;
  /** Null while the admin settings still hold the placeholder number. */
  phone: string | null;
  /** A wa.me chat link, or null when no WhatsApp number is set. */
  whatsappUrl: string | null;
};

/** The school's contact details as entered under Admin › Settings. */
export async function getSchoolContact(): Promise<SchoolContact> {
  const settings = await prisma.schoolSettings.findUnique({ where: { id: "school" } });
  const phone = settings?.phone?.trim() ?? "";
  const whatsappDigits = (settings?.whatsappNumber ?? "").replace(/\D/g, "");
  return {
    address: settings?.address || "Bonistraat 44, Paramaribo",
    phone: phone && !/X/i.test(phone) ? phone : null,
    whatsappUrl: whatsappDigits ? `https://wa.me/${whatsappDigits}` : null,
  };
}
