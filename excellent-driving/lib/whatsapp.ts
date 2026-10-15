import { Resend } from "resend";
import { displaySlot } from "@/lib/slots";

type SendResult = { success: boolean; channel: "whatsapp" | "email" | "none"; error?: string };

/**
 * Sends a WhatsApp message via the Meta WhatsApp Business Cloud API.
 * Requires a verified Meta Business account + registered message templates
 * in production (see Claude.md's WhatsApp notes) — this calls the same
 * Graph API shape, but cannot be exercised end-to-end without real
 * WHATSAPP_API_KEY / WHATSAPP_PHONE_NUMBER_ID credentials.
 */
async function sendWhatsAppMessage(to: string, body: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.WHATSAPP_API_KEY;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!apiKey || !phoneNumberId) {
    return { ok: false, error: "WhatsApp is not configured (missing WHATSAPP_API_KEY / WHATSAPP_PHONE_NUMBER_ID)." };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      return { ok: false, error: `WhatsApp API error (${res.status}): ${errText}` };
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown WhatsApp send error" };
  }
}

async function sendEmailFallback(to: string, subject: string, body: string): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { ok: false, error: "Email fallback is not configured (missing RESEND_API_KEY)." };
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Excellent Driving <onboarding@resend.dev>",
      to,
      subject,
      text: body,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown email send error" };
  }
}

/**
 * Sends a notification via WhatsApp; on failure, falls back to email per
 * Claude.md's spec ("if WhatsApp fails, log error and send email via Resend").
 * Never throws — a notification failure should never break the calling
 * request (booking creation, payment confirmation, etc).
 */
export async function notify(params: {
  phone: string | null;
  email: string;
  subject: string;
  message: string;
}): Promise<SendResult> {
  const { phone, email, subject, message } = params;

  if (phone) {
    const waResult = await sendWhatsAppMessage(phone, message);
    if (waResult.ok) return { success: true, channel: "whatsapp" };
    console.error(`[whatsapp] send failed for ${phone}: ${waResult.error}`);
  }

  const emailResult = await sendEmailFallback(email, subject, message);
  if (emailResult.ok) return { success: true, channel: "email" };
  console.error(`[whatsapp] email fallback also failed for ${email}: ${emailResult.error}`);

  return { success: false, channel: "none", error: emailResult.error };
}

type Lang = "EN" | "NL";
type Message = { subject: string; message: string };

/** A lesson date as the recipient reads it: "Monday, November 2" or "maandag 2 november". */
export function lessonDate(date: Date, lang: Lang) {
  return date.toLocaleDateString(lang === "NL" ? "nl-NL" : "en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
}

const lessonTime = (timeSlot: string, lang: Lang) => displaySlot(timeSlot, lang === "NL" ? "nl" : "en");

type Slot = { date: Date; timeSlot: string };

/**
 * Every notification in the recipient's language (their account's language).
 * The English texts are the ones from Claude.md; register the same wording
 * as WhatsApp templates in Meta Business Manager.
 */
export const templates = {
  bookingConfirmation: (lang: Lang, p: { name: string; instructor: string; date: Date; timeSlot: string; method: "CASH" | "BANK_TRANSFER" }): Message =>
    lang === "NL"
      ? {
          subject: "Je boeking bij Excellent Driving is bevestigd",
          message: `Hoi ${p.name}, je les bij ${p.instructor} op ${lessonDate(p.date, lang)} om ${lessonTime(p.timeSlot, lang)} is bevestigd. Betaling: ${p.method === "CASH" ? "contant" : "bankoverschrijving"}.`,
        }
      : {
          subject: "Your Excellent Driving booking is confirmed",
          message: `Hi ${p.name}, your booking with ${p.instructor} on ${lessonDate(p.date, lang)} at ${lessonTime(p.timeSlot, lang)} is confirmed. Payment: ${p.method === "CASH" ? "Cash" : "Bank Transfer"}.`,
        },

  bookingReminder: (lang: Lang, p: { timeSlot: string; instructor: string }): Message =>
    lang === "NL"
      ? {
          subject: "Herinnering: je rijles is morgen",
          message: `Herinnering: je rijles is morgen om ${lessonTime(p.timeSlot, lang)} bij ${p.instructor}. Tot dan!`,
        }
      : {
          subject: "Reminder: your driving lesson is tomorrow",
          message: `Reminder: Your driving lesson is tomorrow at ${lessonTime(p.timeSlot, lang)} with ${p.instructor}. See you there!`,
        },

  paymentConfirmed: (lang: Lang, p: { packageName: string }): Message =>
    lang === "NL"
      ? {
          subject: "Betaling bevestigd: Excellent Driving",
          message: `Je betaling voor ${p.packageName} is bevestigd. Je hebt nu toegang tot je online lessen!`,
        }
      : {
          subject: "Payment confirmed — Excellent Driving",
          message: `Your payment for ${p.packageName} has been confirmed. You now have access to your online lessons!`,
        },

  bookingCancelled: (lang: Lang, p: { date: Date; timeSlot: string }): Message =>
    lang === "NL"
      ? {
          subject: "Je boeking bij Excellent Driving is geannuleerd",
          message: `Je boeking op ${lessonDate(p.date, lang)} om ${lessonTime(p.timeSlot, lang)} is geannuleerd.`,
        }
      : {
          subject: "Your Excellent Driving booking was cancelled",
          message: `Your booking on ${lessonDate(p.date, lang)} at ${lessonTime(p.timeSlot, lang)} has been cancelled.`,
        },

  bookingRescheduled: (lang: Lang, p: { instructor: string; from: Slot; to: Slot }): Message =>
    lang === "NL"
      ? {
          subject: "Je les bij Excellent Driving is verzet",
          message: `Je les bij ${p.instructor} is verzet van ${lessonDate(p.from.date, lang)} om ${lessonTime(p.from.timeSlot, lang)} naar ${lessonDate(p.to.date, lang)} om ${lessonTime(p.to.timeSlot, lang)}.`,
        }
      : {
          subject: "Your Excellent Driving lesson was rescheduled",
          message: `Your lesson with ${p.instructor} has moved from ${lessonDate(p.from.date, lang)} at ${lessonTime(p.from.timeSlot, lang)} to ${lessonDate(p.to.date, lang)} at ${lessonTime(p.to.timeSlot, lang)}.`,
        },

  instructorRescheduled: (lang: Lang, p: { studentName: string; from: Slot; to: Slot }): Message =>
    lang === "NL"
      ? {
          subject: "Les verzet",
          message: `${p.studentName} heeft de les van ${lessonDate(p.from.date, lang)} om ${lessonTime(p.from.timeSlot, lang)} verzet naar ${lessonDate(p.to.date, lang)} om ${lessonTime(p.to.timeSlot, lang)}.`,
        }
      : {
          subject: "Lesson rescheduled",
          message: `${p.studentName} moved their lesson from ${lessonDate(p.from.date, lang)} at ${lessonTime(p.from.timeSlot, lang)} to ${lessonDate(p.to.date, lang)} at ${lessonTime(p.to.timeSlot, lang)}.`,
        },

  instructorNewBooking: (lang: Lang, p: { studentName: string; date: Date; timeSlot: string }): Message =>
    lang === "NL"
      ? {
          subject: "Nieuwe lesboeking",
          message: `Nieuwe boeking: ${p.studentName} heeft een les bij je geboekt op ${lessonDate(p.date, lang)} om ${lessonTime(p.timeSlot, lang)}.`,
        }
      : {
          subject: "New lesson booking",
          message: `New booking: ${p.studentName} booked a lesson with you on ${lessonDate(p.date, lang)} at ${lessonTime(p.timeSlot, lang)}.`,
        },
};
