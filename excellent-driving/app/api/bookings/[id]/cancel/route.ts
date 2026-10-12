import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseSlotLabel } from "@/lib/slots";
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

  const lessonStart = new Date(booking.date);
  lessonStart.setUTCMinutes(lessonStart.getUTCMinutes() + parseSlotLabel(booking.timeSlot));
  const hoursUntilLesson = (lessonStart.getTime() - Date.now()) / (1000 * 60 * 60);

  if (hoursUntilLesson < 24) {
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
