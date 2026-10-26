import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./settings-form";
import { PasswordForm } from "./password-form";

export default async function AdminSettingsPage() {
  const settings = await prisma.schoolSettings.upsert({
    where: { id: "school" },
    update: {},
    create: { id: "school" },
  });

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <SettingsForm
        initial={{
          schoolName: settings.schoolName,
          address: settings.address,
          phone: settings.phone,
          email: settings.email,
          whatsappNumber: settings.whatsappNumber,
          contactName: settings.contactName,
          whatsappBotEnabled: settings.whatsappBotEnabled,
          bankName: settings.bankName,
          bankAccountHolder: settings.bankAccountHolder,
          bankAccountNumber: settings.bankAccountNumber,
          lessonsAfterPayment: settings.lessonsAfterPayment,
          statStudents: settings.statStudents,
          statPassRate: settings.statPassRate,
          openingDaysNl: settings.openingDaysNl,
          openingDaysEn: settings.openingDaysEn,
          openingTimes: settings.openingTimes,
          defaultLanguage: settings.defaultLanguage,
        }}
      />
      <PasswordForm />
    </div>
  );
}
