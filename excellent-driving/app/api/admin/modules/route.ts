import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPackageIds } from "@/lib/module-packages";

const moduleSchema = z.object({
  titleEn: z.string().min(1),
  titleNl: z.string().min(1),
  orderIndex: z.number().int().min(1),
  /** The packages whose students see the module. */
  packageIds: z.array(z.string().min(1)).optional(),
  isPublished: z.boolean().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await request.json();
  const parsed = moduleSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the module details." }, { status: 400 });

  const { packageIds, ...fields } = parsed.data;
  const created = await prisma.module.create({
    data: { ...fields, isPublished: fields.isPublished ?? false, packages: { connect: (packageIds ?? []).map((id) => ({ id })) } },
    include: { lessons: true, packages: { select: { id: true } } },
  });
  return NextResponse.json({ module: withPackageIds(created) }, { status: 201 });
}
