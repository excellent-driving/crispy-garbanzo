import { prisma } from "@/lib/prisma";
import type { ErrorKey } from "@/lib/api-error";
import { dayOfWeekCode, formatSlotLabel, generateSlotMinutes, parseSlotLabel } from "@/lib/slots";

/** Students can cancel or reschedule a lesson up to this many hours before it starts. */
export const CHANGE_DEADLINE_HOURS = 24;

export function hoursUntilLesson(date: Date, timeSlot: string) {
  const lessonStart = new Date(date);
  lessonStart.setUTCMinutes(lessonStart.getUTCMinutes() + parseSlotLabel(timeSlot));
  return (lessonStart.getTime() - Date.now()) / (1000 * 60 * 60);
}

/** Why an instructor can't teach at this date and slot, or null when they can (bookings by others aside). */
export async function slotProblem(instructorId: string, date: Date, timeSlot: string): Promise<ErrorKey | null> {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const dayCode = dayOfWeekCode(date);
  if (dayCode === "SUN" || date < today) return "dateUnavailable";

  const schedule = await prisma.schedule.findFirst({ where: { instructorId, dayOfWeek: dayCode } });
  if (!schedule) return "instructorUnavailable";

  const validSlots = generateSlotMinutes(schedule.startTime, schedule.endTime, schedule.slotDurationMinutes).map(formatSlotLabel);
  return validSlots.includes(timeSlot) ? null : "slotUnavailable";
}
