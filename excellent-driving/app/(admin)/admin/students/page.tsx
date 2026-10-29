import { prisma } from "@/lib/prisma";
import { StudentsManager, type StudentRow } from "./students-manager";

export default async function AdminStudentsPage() {
  const [students, modules, allProgress, packages] = await Promise.all([
    prisma.user.findMany({
      where: { role: "STUDENT" },
      include: { _count: { select: { bookings: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.module.findMany({
      where: { isPublished: true },
      include: { lessons: { select: { id: true } }, packages: { select: { id: true } } },
      orderBy: { orderIndex: "asc" },
    }),
    // One query for every student's progress, instead of N queries.
    prisma.studentProgress.findMany({ where: { status: "PASSED" }, select: { studentId: true, lessonId: true } }),
    prisma.package.findMany({ where: { isActive: true }, select: { id: true, nameEn: true }, orderBy: { createdAt: "asc" } }),
  ]);

  const passedByStudent = new Map<string, Set<string>>();
  for (const p of allProgress) {
    if (!passedByStudent.has(p.studentId)) passedByStudent.set(p.studentId, new Set());
    passedByStudent.get(p.studentId)!.add(p.lessonId);
  }

  const rows: StudentRow[] = students.map((s) => {
    const passedLessonIds = passedByStudent.get(s.id) ?? new Set<string>();
    const completedPerModule = modules.map((m) => m.lessons.filter((l) => passedLessonIds.has(l.id)).length);

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone ?? "",
      language: s.language,
      courseAccess: s.courseAccess,
      packageId: s.packageId,
      createdAt: s.createdAt.toISOString(),
      bookingsCount: s._count.bookings,
      completedPerModule,
    };
  });

  return (
    <StudentsManager
      initial={rows}
      packages={packages}
      modules={modules.map((m) => ({ title: m.titleEn, total: m.lessons.length, packageIds: m.packages.map((p) => p.id) }))}
    />
  );
}
