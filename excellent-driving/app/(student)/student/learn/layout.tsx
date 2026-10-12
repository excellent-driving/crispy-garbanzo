import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSchool } from "@/lib/school";

export default async function LearnLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { courseAccess: true },
  });

  if (!user?.courseAccess) {
    const t = await getTranslations("Learn");
    // A student who never had access is waiting for a payment; otherwise the admin closed it.
    const waitingForPayment = (await getSchool()).lessonsAfterPayment &&
      !(await prisma.booking.count({ where: { studentId: session!.user.id, paymentStatus: "CONFIRMED" } }));
    return (
      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--gray-200)",
          padding: 32,
          textAlign: "center",
          color: "var(--gray-600)",
        }}
      >
        🔒 {waitingForPayment ? t("awaitingPayment") : t("accessOnHold")}
      </div>
    );
  }

  return <>{children}</>;
}
