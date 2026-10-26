import { getServerSession } from "next-auth";
import { getLocale } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { packageName } from "@/lib/progress";
import { CHANGE_DEADLINE_HOURS, hoursUntilLesson } from "@/lib/bookings";
import { BookingsList, type BookingRow } from "./bookings-list";
import { notFound } from "next/navigation";
import { BOOKING_ENABLED } from "@/lib/features";

export default async function StudentBookingsPage() {
  if (!BOOKING_ENABLED) notFound();
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  const bookings = await prisma.booking.findMany({
    where: { studentId: session!.user.id },
    include: { package: true, instructor: { include: { user: true } } },
    orderBy: { date: "desc" },
  });

  const rows: BookingRow[] = bookings.map((b) => {
    return {
      id: b.id,
      date: b.date.toISOString(),
      timeSlot: b.timeSlot,
      status: b.status,
      paymentMethod: b.paymentMethod,
      paymentStatus: b.paymentStatus,
      packageName: packageName(b.package, locale),
      instructorName: b.instructor.user.name,
      instructorId: b.instructorId,
      canChange: b.status !== "CANCELLED" && hoursUntilLesson(b.date, b.timeSlot) >= CHANGE_DEADLINE_HOURS,
    };
  });

  return <BookingsList initial={rows} />;
}
