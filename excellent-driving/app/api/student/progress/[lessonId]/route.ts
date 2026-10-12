import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStudentModuleStates } from "@/lib/progress";
import { scoreQuiz } from "@/lib/quiz";
import { apiError } from "@/lib/api-error";

const submitSchema = z.object({
  answers: z.array(z.number().nullable()).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return await apiError("unauthorized", 401);

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { courseAccess: true } });
  if (!user?.courseAccess) {
    return await apiError("accessOnHold", 403);
  }

  const { lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return await apiError("lessonNotFound", 404);

  const moduleStates = await getStudentModuleStates(session.user.id);
  const lessonState = moduleStates
    .flatMap((m) => m.lessons)
    .find((l) => l.lesson.id === lessonId);

  if (!lessonState?.unlocked) {
    return await apiError("lessonLocked", 403);
  }

  const body = await request.json().catch(() => ({}));
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return await apiError("invalidSubmission", 400);
  }

  const moduleId = lesson.moduleId;

  if (lesson.type === "QUIZ") {
    const content = lesson.content as {
      questions: { correct: number }[];
      passingScore?: number;
    };
    const answers = parsed.data.answers ?? [];
    const { score, correctCount, total, passed } = scoreQuiz(
      content.questions,
      answers,
      content.passingScore ?? 70
    );
    const status = passed ? "PASSED" : "FAILED";

    const progress = await prisma.studentProgress.upsert({
      where: { studentId_lessonId: { studentId: session.user.id, lessonId } },
      update: { status, score, completedAt: status === "PASSED" ? new Date() : null },
      create: { studentId: session.user.id, lessonId, moduleId, status, score, completedAt: status === "PASSED" ? new Date() : null },
    });

    return NextResponse.json({ progress, score, correctCount, total, passed: status === "PASSED" });
  }

  // TEXT / VIDEO lessons: submitting marks them complete, no scoring.
  const progress = await prisma.studentProgress.upsert({
    where: { studentId_lessonId: { studentId: session.user.id, lessonId } },
    update: { status: "PASSED", completedAt: new Date() },
    create: { studentId: session.user.id, lessonId, moduleId, status: "PASSED", completedAt: new Date() },
  });

  return NextResponse.json({ progress, passed: true });
}
