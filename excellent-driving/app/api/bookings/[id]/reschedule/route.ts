import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHANGE_DEADLINE_HOURS, hoursUntilLesson, slotProblem } from "@/lib/bookings";
import { notify, templates } from "@/lib/whatsapp";
import { apiError } from "@/lib/api-error";

const rescheduleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.string().min(1),
});

/** Moves a student's own booking to another date and time with the same instructor. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return await apiError("unauthorized", 401);

  const parsed = rescheduleSchema.safeParse(await request.json());
  if (!parsed.success) return await apiError("invalidBooking", 400);

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { student: true, instructor: { include: { user: true } } },
  });

  if (!booking || booking.studentId !== session.user.id) {
    return await apiError("bookingNotFound", 404);
  }
  if (booking.status === "CANCELLED") {
    return await apiError("alreadyCancelled", 400);
  }
  if (hoursUntilLesson(booking.date, booking.timeSlot) < CHANGE_DEADLINE_HOURS) {
    return await apiError("rescheduleTooLate", 400);
  }

  const date = new Date(`${parsed.data.date}T00:00:00Z`);
  const { timeSlot } = parsed.data;
  const problem = await slotProblem(booking.instructorId, date, timeSlot);
  if (problem) return await apiError(problem, 400);
  if (hoursUntilLesson(date, timeSlot) <= 0) return await apiError("slotUnavailable", 400);

  const updated = await prisma.$transaction(async (tx) => {
    const clash = await tx.booking.findFirst({
      where: { instructorId: booking.instructorId, date, timeSlot, status: { not: "CANCELLED" }, id: { not: id } },
    });
    if (clash) return null;
    return tx.booking.update({ where: { id }, data: { date, timeSlot } });
  });

  if (!updated) return await apiError("slotTaken", 409);

  const change = { from: { date: booking.date, timeSlot: booking.timeSlot }, to: { date, timeSlot } };
  await notify({
    phone: booking.student.phone,
    email: booking.student.email,
    ...templates.bookingRescheduled(booking.student.language, { instructor: booking.instructor.user.name, ...change }),
  });
  await notify({
    phone: null, // instructor phone isn't collected yet — falls back to email
    email: booking.instructor.user.email,
    ...templates.instructorRescheduled(booking.instructor.user.language, { studentName: booking.student.name, ...change }),
  });

  return NextResponse.json({ booking: updated });
}
