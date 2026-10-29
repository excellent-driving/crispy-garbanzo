import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Opens or closes the lessons, and/or sets the student's package (null = no package, every module). */
const schema = z
  .object({ courseAccess: z.boolean().optional(), packageId: z.string().min(1).nullable().optional() })
  .refine((d) => d.courseAccess !== undefined || d.packageId !== undefined);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { courseAccess, packageId } = parsed.data;
  if (packageId && !(await prisma.package.findFirst({ where: { id: packageId, isActive: true } }))) {
    return NextResponse.json({ error: "Package not found." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id, role: "STUDENT" },
    data: { courseAccess, packageId },
    select: { id: true, courseAccess: true, packageId: true },
  });

  return NextResponse.json({ user });
}
