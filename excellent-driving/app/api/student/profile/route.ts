import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";

const profileSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  language: z.enum(["EN", "NL"]),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return await apiError("unauthorized", 401);

  const body = await request.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return await apiError("invalidProfile", 400);
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: { id: true, name: true, phone: true, language: true, email: true },
  });

  return NextResponse.json({ user });
}
