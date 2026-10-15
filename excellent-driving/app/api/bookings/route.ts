import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slotProblem } from "@/lib/bookings";
import { notify, templates } from "@/lib/whatsapp";
import { apiError } from "@/lib/api-error";
import { getSchool } from "@/lib/school";

const bookingSchema = z.object({
  packageId: z.string().min(1),
  instructorId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.string().min(1),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER"]),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return await apiError("loginToBook", 401);
  }

  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return await apiError("invalidBooking", 400);
  }

  const { packageId, instructorId, date: dateParam, timeSlot, paymentMethod } = parsed.data;
  if (paymentMethod === "BANK_TRANSFER" && !(await getSchool()).bank) {
    return await apiError("bankTransferUnavailable", 400);
  }
  const date = new Date(`${dateParam}T00:00:00Z`);

  const [pkg, instructor] = await Promise.all([
    prisma.package.findUnique({ where: { id: packageId, isActive: true } }),
    prisma.instructor.findUnique({ where: { id: instructorId, isActive: true } }),
  ]);

  if (!pkg) return await apiError("packageNotFound", 404);
  if (!instructor) return await apiError("instructorNotFound", 404);

  const problem = await slotProblem(instructorId, date, timeSlot);
  if (problem) return await apiError(problem, 400);

  const booking = await prisma.$transaction(async (tx) => {
    const clash = await tx.booking.findFirst({
      where: { instructorId, date, timeSlot, status: { not: "CANCELLED" } },
    });
    if (clash) return null;

    return tx.booking.create({
      data: {
        studentId: session.user.id,
        instructorId,
        packageId,
        date,
        timeSlot,
        paymentMethod,
        status: "PENDING",
        paymentStatus: "PENDING",
      },
      include: {
        package: true,
        instructor: { include: { user: true } },
        student: true,
      },
    });
  });

  if (!booking) {
    return await apiError("slotTaken", 409);
  }

  await notify({
    phone: booking.student.phone,
    email: booking.student.email,
    ...templates.bookingConfirmation(booking.student.language, {
      name: booking.student.name,
      instructor: booking.instructor.user.name,
      date: booking.date,
      timeSlot: booking.timeSlot,
      method: booking.paymentMethod,
    }),
  });

  await notify({
    phone: null, // instructor phone isn't collected yet — falls back to email
    email: booking.instructor.user.email,
    ...templates.instructorNewBooking(booking.instructor.user.language, {
      studentName: booking.student.name,
      date: booking.date,
      timeSlot: booking.timeSlot,
    }),
  });

  return NextResponse.json({ booking }, { status: 201 });
}
