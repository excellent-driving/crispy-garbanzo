import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentModuleStates } from "@/lib/progress";
import { apiError } from "@/lib/api-error";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return await apiError("unauthorized", 401);

  const modules = await getStudentModuleStates(session.user.id);
  return NextResponse.json({ modules });
}
