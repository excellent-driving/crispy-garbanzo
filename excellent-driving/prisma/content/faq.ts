/**
 * The FAQ for the theory-only school (2026-10-26). Replaces the earlier questions
 * about driving lessons, instructors, cars and rescheduling. Each language has the
 * same five questions. prisma/theory-only-update.ts puts them on the live database.
 */
export const faqSeeds = [
  {
    question: "Hoe werkt de online theoriecursus?",
    answer:
      "Na je betaling zetten we je online lessen open. Je werkt de modules in volgorde door: uitleg, voorbeelden en oefenquizzen over voorrangsregels, verkeersborden en examenvragen. Een quiz mag je zo vaak opnieuw doen als je wilt.",
    language: "NL" as const,
    orderIndex: 1,
  },
  {
    question: "Wat kost een pakket en hoe betaal ik?",
    answer:
      "De prijs krijg je op aanvraag: stuur ons een WhatsApp-bericht of een e-mail. Je betaalt contant op onze locatie (Bonistraat 44). Zodra je betaling binnen is, zetten we je online lessen open.",
    language: "NL" as const,
    orderIndex: 2,
  },
  {
    question: "Zijn er ook praktijklessen?",
    answer: "Nee. Onze pakketten bevatten alleen theorie: je bereidt je online voor op het theorie-examen.",
    language: "NL" as const,
    orderIndex: 3,
  },
  {
    question: "Kan ik op mijn telefoon leren?",
    answer: "Ja. De app werkt op je telefoon, tablet en computer. Je hoeft niets te installeren; log in en ga verder waar je gebleven was.",
    language: "NL" as const,
    orderIndex: 4,
  },
  {
    question: "Is de theoriecursus beschikbaar in het Nederlands?",
    answer:
      "Ja! Ons hele platform is beschikbaar in het Engels en het Nederlands. Je kunt op elk moment van taal wisselen via je profielinstellingen.",
    language: "NL" as const,
    orderIndex: 5,
  },
  {
    question: "How does the online theory course work?",
    answer:
      "Once you have paid, we open your online lessons. You work through the modules in order: explanations, examples and practice quizzes on right of way, road signs and exam questions. You can retake a quiz as often as you like.",
    language: "EN" as const,
    orderIndex: 1,
  },
  {
    question: "What does a package cost and how do I pay?",
    answer:
      "Prices are given on request: send us a WhatsApp message or an email. You pay cash at our location (Bonistraat 44). As soon as your payment is in, we open your online lessons.",
    language: "EN" as const,
    orderIndex: 2,
  },
  {
    question: "Are there practical driving lessons?",
    answer: "No. Our packages are theory only: you prepare for the theory exam online.",
    language: "EN" as const,
    orderIndex: 3,
  },
  {
    question: "Can I study on my phone?",
    answer: "Yes. The app works on your phone, tablet and computer. There's nothing to install; log in and carry on where you left off.",
    language: "EN" as const,
    orderIndex: 4,
  },
  {
    question: "Is the theory course available in Dutch?",
    answer:
      "Yes! Our full platform is available in both English and Dutch. You can switch languages at any time from your profile settings.",
    language: "EN" as const,
    orderIndex: 5,
  },
];
