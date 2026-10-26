/**
 * One-off update of the live database for the theory-only school (2026-10-26):
 * the owner's answers of that day. Sets the phone and WhatsApp number and the
 * contact person, and replaces the FAQ about driving lessons with prisma/content/faq.ts.
 * FAQ rows the admin added themselves are kept. Safe to run twice.
 *
 *   DATABASE_URL=<session pooler> npx tsx prisma/theory-only-update.ts
 */
import { PrismaClient } from "@prisma/client";
import { faqSeeds } from "./content/faq";

const prisma = new PrismaClient();

/** The seeded FAQ before 2026-10-26: driving lessons, cars, instructors, rescheduling. */
const oldQuestions = [
  "How many lessons do I need to pass my exam?",
  "What payment methods do you accept?",
  "Can I cancel or reschedule a lesson?",
  "Is the theory course available in Dutch?",
  "Where are lessons conducted?",
  "Moet ik mijn eigen auto meenemen?",
  "Welke betaalmethoden accepteren jullie?",
  "Do I need to bring my own car?",
  "Hoeveel lessen heb ik nodig om te slagen voor mijn examen?",
  "Kan ik een les annuleren of verzetten?",
  "Is de theoriecursus beschikbaar in het Nederlands?",
  "Waar worden de lessen gegeven?",
];

async function main() {
  const contact = { phone: "+597 868-0936", whatsappNumber: "+597 868-0936", contactName: "Astrando Pas" };
  const settings = await prisma.schoolSettings.upsert({
    where: { id: "school" },
    update: contact,
    create: { id: "school", ...contact },
  });
  console.log("settings:", { phone: settings.phone, whatsapp: settings.whatsappNumber, contact: settings.contactName });

  const newQuestions = new Set(faqSeeds.map((f) => f.question));
  const removed = await prisma.fAQ.deleteMany({
    where: { question: { in: oldQuestions.filter((q) => !newQuestions.has(q)) } },
  });
  console.log("old FAQ rows removed:", removed.count);

  for (const faq of faqSeeds) {
    const existing = await prisma.fAQ.findFirst({ where: { question: faq.question, language: faq.language } });
    if (existing) await prisma.fAQ.update({ where: { id: existing.id }, data: faq });
    else await prisma.fAQ.create({ data: faq });
  }

  const all = await prisma.fAQ.findMany({ orderBy: [{ language: "asc" }, { orderIndex: "asc" }] });
  for (const f of all) console.log(`${f.language} ${f.orderIndex} ${f.question}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
