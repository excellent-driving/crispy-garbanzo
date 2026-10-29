import { prisma } from "@/lib/prisma";
import { ContentManager } from "./content-manager";

export default async function AdminContentPage() {
  const [modules, packages] = await Promise.all([
    prisma.module.findMany({
      include: { lessons: { orderBy: { orderIndex: "asc" } }, packages: { select: { id: true } } },
      orderBy: { orderIndex: "asc" },
    }),
    prisma.package.findMany({ where: { isActive: true }, select: { id: true, nameEn: true }, orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <ContentManager
      packages={packages}
      initial={modules.map((m) => ({
        id: m.id,
        titleEn: m.titleEn,
        titleNl: m.titleNl,
        orderIndex: m.orderIndex,
        isPublished: m.isPublished,
        packageIds: m.packages.map((p) => p.id),
        lessons: m.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          type: l.type,
          orderIndex: l.orderIndex,
          content: l.content as Record<string, unknown>,
        })),
      }))}
    />
  );
}
