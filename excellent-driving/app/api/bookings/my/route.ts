import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return await apiError("unauthorized", 401);

  const bookings = await prisma.booking.findMany({
    where: { studentId: session.user.id },
    include: { package: true, instructor: { include: { user: true } } },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ bookings });
}
