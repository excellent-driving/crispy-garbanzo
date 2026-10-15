import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHANGE_DEADLINE_HOURS, hoursUntilLesson } from "@/lib/bookings";
import { notify, templates } from "@/lib/whatsapp";
import { apiError } from "@/lib/api-error";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return await apiError("unauthorized", 401);

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id }, include: { student: true } });

  if (!booking || booking.studentId !== session.user.id) {
    return await apiError("bookingNotFound", 404);
  }

  if (booking.status === "CANCELLED") {
    return await apiError("alreadyCancelled", 400);
  }

  if (hoursUntilLesson(booking.date, booking.timeSlot) < CHANGE_DEADLINE_HOURS) {
    return await apiError("cancelTooLate", 400);
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  await notify({
    phone: booking.student.phone,
    email: booking.student.email,
    ...templates.bookingCancelled(booking.student.language, { date: booking.date, timeSlot: booking.timeSlot }),
  });

  return NextResponse.json({ booking: updated });
}
