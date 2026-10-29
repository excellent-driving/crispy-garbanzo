import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify, templates } from "@/lib/whatsapp";
import { packageName } from "@/lib/progress";
import { getSchool } from "@/lib/school";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { student: true, package: true },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

  const updated = await prisma.booking.update({
    where: { id },
    data: { paymentStatus: "CONFIRMED", status: "CONFIRMED" },
  });
  if ((await getSchool()).lessonsAfterPayment) {
    // A student without a package gets the one they paid for.
    await prisma.user.update({
      where: { id: booking.studentId },
      data: { courseAccess: true, packageId: booking.student.packageId ?? booking.packageId },
    });
  }

  await notify({
    phone: booking.student.phone,
    email: booking.student.email,
    ...templates.paymentConfirmed(booking.student.language, {
      packageName: packageName(booking.package, booking.student.language === "NL" ? "nl" : "en"),
    }),
  });

  return NextResponse.json({ booking: updated });
}
