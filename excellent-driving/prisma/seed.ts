import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { maquetteLes1aLessons } from "./content/maquette-les-1a";
import { maquetteLes2Lessons } from "./content/maquette-les-2";
import { maquetteLes3Lessons } from "./content/maquette-les-3";
import { maquetteLes4Lessons } from "./content/maquette-les-4";
import { maquetteLes5Lessons } from "./content/maquette-les-5";
import { maquetteLes6Lessons } from "./content/maquette-les-6";
import { theorieAlgemeenLessons, theorieCategorieCLessons, theorieCategorieDLessons } from "./content/theorie-vragen";
import { verkeersbordenLessons } from "./content/verkeersborden";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("ChangeMe123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@excellentdriving.sr" },
    update: {},
    create: {
      email: "admin@excellentdriving.sr",
      name: "School Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      language: "EN",
    },
  });

  const instructorSeeds = [
    {
      email: "carlos@excellentdriving.sr",
      name: "Carlos Martinus",
      yearsExperience: 12,
      bio: "Specializes in nervous beginners. Calm, patient teaching style with focus on road safety.",
      bioNl: "Gespecialiseerd in nerveuze beginners. Rustige, geduldige manier van lesgeven, met de nadruk op verkeersveiligheid.",
      schedule: ["MON", "TUE", "WED", "THU", "FRI", "SAT"] as const,
    },
    {
      email: "sandra@excellentdriving.sr",
      name: "Sandra Pengel",
      yearsExperience: 8,
      bio: "Expert in city driving and parking techniques. Available Monday through Friday.",
      bioNl: "Expert in rijden in de stad en parkeertechnieken. Beschikbaar van maandag tot en met vrijdag.",
      schedule: ["MON", "TUE", "WED", "THU", "FRI"] as const,
    },
    {
      email: "roy@excellentdriving.sr",
      name: "Roy Apensa",
      yearsExperience: 15,
      bio: "Former driving examiner. Knows exactly what examiners look for. 97% pass rate.",
      bioNl: "Voormalig rijexaminator. Weet precies waar examinatoren op letten. 97% slagingspercentage.",
      schedule: ["MON", "TUE", "WED", "THU", "FRI", "SAT"] as const,
    },
  ];

  const instructorPasswordHash = await bcrypt.hash("ChangeMe123!", 10);
  const instructors = [];

  for (const seed of instructorSeeds) {
    const user = await prisma.user.upsert({
      where: { email: seed.email },
      update: {},
      create: {
        email: seed.email,
        name: seed.name,
        passwordHash: instructorPasswordHash,
        role: "INSTRUCTOR",
        language: "EN",
      },
    });

    const existing = await prisma.instructor.findUnique({ where: { userId: user.id } });
    const instructor =
      existing ??
      (await prisma.instructor.create({
        data: {
          userId: user.id,
          bio: seed.bio,
          bioNl: seed.bioNl,
          yearsExperience: seed.yearsExperience,
          isActive: true,
        },
      }));

    // Only for an instructor created just now. schedules has no unique key, so
    // re-running the seed would add every day again, and an existing
    // instructor's hours are the admin's to change.
    if (!existing) {
      await prisma.schedule.createMany({
        data: seed.schedule.map((dayOfWeek) => ({
          instructorId: instructor.id,
          dayOfWeek,
          startTime: dayOfWeek === "SAT" ? "09:00" : "08:00",
          endTime: dayOfWeek === "SAT" ? "13:00" : "17:00",
        })),
      });
    }

    instructors.push(instructor);
  }

  const packageSeeds = [
    {
      id: "seed-pkg-starter",
      nameEn: "Starter",
      nameNl: "Starter",
      descriptionEn: "Perfect for beginners with no prior driving experience.",
      descriptionNl: "Perfect voor beginners zonder eerdere rijervaring.",
      price: 2500,
      featured: false,
    },
    {
      id: "seed-pkg-standard",
      nameEn: "Standard",
      nameNl: "Standaard",
      descriptionEn: "Our most popular package — comprehensive training for confident drivers.",
      descriptionNl: "Ons populairste pakket — uitgebreide training voor zelfverzekerde bestuurders.",
      price: 3000,
      featured: true,
    },
    {
      id: "seed-pkg-premium",
      nameEn: "Premium",
      nameNl: "Premium",
      descriptionEn: "Intensive program designed to get you exam-ready in minimum time.",
      descriptionNl: "Intensief programma om je in minimale tijd examenklaar te maken.",
      price: 3500,
      featured: false,
    },
    {
      id: "seed-pkg-refresher",
      nameEn: "Refresher",
      nameNl: "Opfriscursus",
      descriptionEn: "Already know how to drive? Brush up your skills for the exam.",
      descriptionNl: "Kun je al autorijden? Fris je vaardigheden op voor het examen.",
      price: 650,
      featured: false,
    },
  ];

  for (const pkg of packageSeeds) {
    await prisma.package.upsert({
      where: { id: pkg.id },
      update: {},
      create: {
        id: pkg.id,
        nameEn: pkg.nameEn,
        nameNl: pkg.nameNl,
        descriptionEn: pkg.descriptionEn,
        descriptionNl: pkg.descriptionNl,
        price: pkg.price,
        currency: "SRD",
        lessonCount: 0,
        includesTheory: true,
        featured: pkg.featured,
        isActive: true,
      },
    });
  }

  const faqSeeds = [
    {
      question: "How many lessons do I need to pass my exam?",
      answer:
        "Most students pass after 15–20 lessons, depending on their prior experience. Our instructors will guide you and let you know when you're ready for the exam.",
      language: "EN" as const,
      orderIndex: 1,
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept cash payments at our location (Bonistraat 44) and bank transfers. After payment is confirmed by our admin, you'll receive a WhatsApp message with your course access details.",
      language: "EN" as const,
      orderIndex: 2,
    },
    {
      question: "Can I cancel or reschedule a lesson?",
      answer:
        "Yes! You can cancel or reschedule a lesson up to 24 hours before the scheduled time, directly from your student dashboard.",
      language: "EN" as const,
      orderIndex: 3,
    },
    {
      question: "Is the theory course available in Dutch?",
      answer:
        "Yes! Our full platform is available in both English and Dutch. You can switch languages at any time from your profile settings.",
      language: "EN" as const,
      orderIndex: 4,
    },
    {
      question: "Where are lessons conducted?",
      answer:
        "Lessons start and end at our school at Bonistraat 44, Paramaribo. Your instructor will drive through various routes around the city.",
      language: "EN" as const,
      orderIndex: 5,
    },
    {
      question: "Moet ik mijn eigen auto meenemen?",
      answer: "Nee — alle praktijklessen gebruiken onze volledig verzekerde lesauto's.",
      language: "NL" as const,
      orderIndex: 1,
    },
    {
      question: "Welke betaalmethoden accepteren jullie?",
      answer:
        "Wij accepteren contante betalingen op onze locatie (Bonistraat 44) en bankoverschrijvingen. Zodra de betaling is bevestigd, ontvang je een WhatsApp-bericht.",
      language: "NL" as const,
      orderIndex: 2,
    },
    // Each language has the same six questions; added 2026-10-12.
    {
      question: "Do I need to bring my own car?",
      answer: "No. All practical lessons use our fully insured driving school cars.",
      language: "EN" as const,
      orderIndex: 6,
    },
    {
      question: "Hoeveel lessen heb ik nodig om te slagen voor mijn examen?",
      answer:
        "De meeste leerlingen slagen na 15 tot 20 lessen, afhankelijk van hun eerdere ervaring. Onze instructeurs begeleiden je en laten je weten wanneer je klaar bent voor het examen.",
      language: "NL" as const,
      orderIndex: 3,
    },
    {
      question: "Kan ik een les annuleren of verzetten?",
      answer:
        "Ja! Je kunt een les tot 24 uur voor de geplande tijd annuleren of verzetten, direct vanuit je studentendashboard.",
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
      question: "Waar worden de lessen gegeven?",
      answer:
        "De lessen beginnen en eindigen bij onze rijschool aan de Bonistraat 44 in Paramaribo. Je instructeur rijdt met je verschillende routes door de stad.",
      language: "NL" as const,
      orderIndex: 6,
    },
  ];

  for (const faq of faqSeeds) {
    const existing = await prisma.fAQ.findFirst({
      where: { question: faq.question, language: faq.language },
    });
    if (!existing) {
      await prisma.fAQ.create({ data: faq });
    }
  }

  // Real course content, sourced from materiaalrijonderricht/Maquette les 1.pdf.
  const maquetteLes1Lessons = [
    {
      title: "Wat is de Maquette?",
      type: "TEXT" as const,
      content: {
        type: "TEXT",
        body:
          "<p>In moderne theorie-rijlessen wordt de traditionele maquette ook toegepast binnen e-learning. Een digitale maquette is een interactieve weergave van verkeerssituaties waarmee leerlingen online verkeersregels en verkeersinzicht kunnen oefenen. In plaats van een fysiek schaalmodel gebruikt de cursist een computer, tablet of smartphone om verkeersscenario's te bekijken en te analyseren.</p>" +
          "<p>Binnen e-learning helpt de digitale maquette leerlingen om:</p>" +
          "<ul>" +
          "<li>voorrangssituaties beter te begrijpen;</li>" +
          "<li>verkeersborden en wegmarkeringen correct toe te passen;</li>" +
          "<li>gevaarlijke situaties te herkennen;</li>" +
          "<li>inzicht te krijgen in verkeersstromen en rijgedrag;</li>" +
          "<li>zelfstandig en op eigen tempo te oefenen.</li>" +
          "</ul>" +
          "<p>Door animaties, interactieve opdrachten en simulaties wordt de leerstof duidelijker en realistischer weergegeven. Leerlingen kunnen verschillende verkeerssituaties herhalen totdat zij de regels volledig begrijpen. Hierdoor wordt theorie leren niet alleen eenvoudiger, maar ook aantrekkelijker en praktischer.</p>" +
          "<p>De digitale maquette vormt daarom een belangrijk hulpmiddel binnen moderne e-learning voor theorie rijles, omdat het theorie en praktijk op een visuele en interactieve manier met elkaar verbindt.</p>",
      },
    },
    {
      title: "Linksverkeer & Wettelijke Definities",
      type: "TEXT" as const,
      content: {
        type: "TEXT",
        body:
          "<h3>Verkeer in Suriname</h3>" +
          "<p>In Suriname hebben wij <strong>linksverkeer</strong>. Behoudens het bepaalde in de rijwet is de bestuurder verplicht op de door hem gevolgde weg links te houden. Hij mag zich daarbij niet verder van de linkerkant bevinden dan door de omstandigheden gerechtvaardigd wordt.</p>" +
          "<h3>Wegen, bestuurder en motorrijtuig</h3>" +
          "<p>In de rijwet worden verstaan:</p>" +
          "<ol>" +
          "<li>onder <strong>wegen</strong>: alle voor het openbaar verkeer openstaande wegen;</li>" +
          "<li>onder <strong>bestuurder van een motorrijtuig</strong>: hij die het motorrijtuig bestuurt, of hij die overeenkomstig de voorwaarden — te stellen bij het in artikel 17 lid 1 bedoeld staatsbesluit — geacht wordt het motorrijtuig onder zijn onmiddellijk toezicht te doen besturen;</li>" +
          "<li>onder <strong>motorrijtuigen</strong>: alle rij- of voertuigen, bestemd om uitsluitend of mede door een krachtwerktuig, op of aan het rij- of voertuig zelf aanwezig, anders dan langs spoorstaven te worden voortbewogen.</li>" +
          "</ol>",
      },
    },
    {
      title: "Oplossingsmethode voor Maquette-opgaven",
      type: "TEXT" as const,
      content: {
        type: "TEXT",
        body:
          "<p>Bij het oplossen van maquette problemen wordt de volgende volgorde toegepast:</p>" +
          "<ol>" +
          "<li>Bekijk en stel de wegsituatie vast.</li>" +
          "<li>Bespreek elk voertuig afzonderlijk.</li>" +
          "<li>Kijk naar de rijrichting van elk voertuig.</li>" +
          "<li>Bepaal de voorrang aan de hand van de wegsituatie en de rijrichting van de voertuigen.</li>" +
          "</ol>" +
          "<p>Volg deze vier stappen bij elke maquette-opgave, in deze volgorde — dat voorkomt dat je een voertuig of een wegkenmerk over het hoofd ziet.</p>",
      },
    },
    {
      title: "Voorrangsregels — LET OP",
      type: "TEXT" as const,
      content: {
        type: "TEXT",
        body:
          "<p>Let bij het bepalen van voorrang altijd op de volgende regels:</p>" +
          "<ol>" +
          "<li><strong>Zelfde richting behouden:</strong> verkeer dat dezelfde richting blijft volgen, heeft meestal voorrang. Dit geldt bijvoorbeeld voor voertuigen die op een voorrangsweg rijden of die hun richting behouden. Voorbeeld: twee voertuigen die elkaar tegemoetkomen en allebei rechtdoor rijden, mogen allebei doorrijden.</li>" +
          "<li><strong>Beide linksaf, tegenover elkaar:</strong> twee bestuurders die allebei linksaf slaan en tegenover elkaar staan, mogen tegelijkertijd afslaan.</li>" +
          "<li><strong>Kruisend verkeer:</strong> als een bestuurder het verkeer dat rechtdoor gaat wil kruisen, moet hij voorrang verlenen aan voertuigen die op dezelfde weg rijden en hun richting behouden. Dit geldt ook bij kruispunten en wanneer wegen samenkomen.</li>" +
          "<li><strong>Auto + (brom)fiets, beide linksaf:</strong> rijdt de auto niet samen met de (brom)fiets als er geen rijwielpad is in de richting waarin wordt afgeslagen.</li>" +
          "<li><strong>Auto + (brom)fiets, beide rechtsaf:</strong> rijdt de (brom)fiets niet samen met de auto als er geen rijwielpad is in de richting waarin wordt afgeslagen.</li>" +
          "<li><strong>Voorrangsweg:</strong> als je rijdt op een weg die door de Minister is aangewezen als voorrangsweg, heb je voorrang op het verkeer dat vanaf een andere weg komt.</li>" +
          "<li><strong>T-kruising:</strong> bij een T-kruising, waarbij één weg ophoudt en de andere weg doorloopt, heeft het verkeer op de doorgaande weg voorrang, als er geen andere verkeersregels of borden zijn.</li>" +
          "<li><strong>Verharde vs. onverharde weg:</strong> bij een kruising tussen een verharde weg en een onverharde weg heeft het verkeer op de verharde weg voorrang. Bij een T-kruising geldt echter dat het verkeer op de doorgaande weg voorrang heeft, als er geen andere aanwijzingen zijn.</li>" +
          "<li><strong>Verkeer van links:</strong> als geen van de bovenstaande regels van toepassing is, heeft het verkeer dat van links komt voorrang.</li>" +
          "<li><strong>Bijzondere voertuigen en colonnes:</strong> politie- en brandweervoertuigen en voertuigen van een ziekeninrichting hebben voorrang wanneer zij bij het naderen van een kruising of splitsing een sirene, bel, meertonige hoorn of een rood, oranjerood of blauw zwaailicht gebruiken. Ook begrafenisstoeten, militaire colonnes en politiecolonnes hebben voorrang op ander verkeer. Volgorde: politie-/brandweervoertuigen en voertuigen van een ziekeninrichting met de genoemde signalen gaan eerst.</li>" +
          "</ol>" +
          "<div class=\"callout\"><strong>Goudenregel:</strong> een rechtsaffer moet altijd voorrang verlenen aan een linksaffer en aan rechtdoorgaand verkeer dat tegenover hem staat.</div>",
      },
    },
    {
      title: "Legenda & Symbolen",
      type: "TEXT" as const,
      content: {
        type: "TEXT",
        body:
          "<p>Gebruik deze afkortingen en symbolen bij het lezen van een maquette-situatieschets:</p>" +
          "<table class=\"legend-table\">" +
          "<tr><td>Z.R.P.</td><td>zonder rijwielpad</td></tr>" +
          "<tr><td>M.R.P.</td><td>met rijwielpad</td></tr>" +
          "<tr><td>f</td><td>fiets</td></tr>" +
          "<tr><td>bf</td><td>bromfiets</td></tr>" +
          "<tr><td>mf</td><td>motorfiets</td></tr>" +
          "<tr><td>PS</td><td>politie met sirene</td></tr>" +
          "<tr><td>BS</td><td>brandweer met sirene</td></tr>" +
          "<tr><td>AS</td><td>ambulance met sirene</td></tr>" +
          "<tr><td>S</td><td>smalle weg</td></tr>" +
          "<tr><td>B</td><td>brede weg</td></tr>" +
          "<tr><td><span class=\"legend-dot\"></span></td><td>zandweg</td></tr>" +
          "<tr><td>1+2</td><td>1 en 2 rijden samen (1+2 is hetzelfde als 2+1)</td></tr>" +
          "<tr><td>1-2</td><td>1 rijdt eerst, daarna 2 (1-2 is niet hetzelfde als 2-1)</td></tr>" +
          "<tr><td>Linksaffer</td><td>bestuurder die links afslaat</td></tr>" +
          "<tr><td>Rechtsaffer</td><td>bestuurder die rechts afslaat</td></tr>" +
          "</table>" +
          "<p>Een <strong>zwarte cirkel</strong> in een situatietekening betekent altijd: <strong>zandweg</strong>.</p>",
      },
    },
  ];

  const moduleSeeds = [
    {
      titleEn: "Maquette — Right of Way (Lesson 1)",
      titleNl: "Maquette — Voorrangsregels (Les 1)",
      id: "seed-module-0",
      orderIndex: 0,
      lessons: maquetteLes1Lessons,
    },
    {
      id: "seed-module-maquette-les-1a",
      titleEn: "Maquette — Right of Way Practice (Lesson 1a)",
      titleNl: "Maquette — Voorrangsoefeningen (Les 1a)",
      orderIndex: 1,
      lessons: maquetteLes1aLessons,
    },
    {
      id: "seed-module-maquette-les-2",
      titleEn: "Maquette — Narrow Roads (Lesson 2)",
      titleNl: "Maquette — Smalle wegen (Les 2)",
      orderIndex: 2,
      lessons: maquetteLes2Lessons,
    },
    {
      id: "seed-module-maquette-les-3",
      titleEn: "Maquette — Wide Roads (Lesson 3)",
      titleNl: "Maquette — Brede wegen (Les 3)",
      orderIndex: 3,
      lessons: maquetteLes3Lessons,
    },
    {
      // Regel 2–6 answers are worked out from the rules, pending the instructor.
      id: "seed-module-maquette-les-4",
      titleEn: "Maquette — T-Junctions and Driveways (Lesson 4)",
      titleNl: "Maquette — T-kruisingen en inritten (Les 4)",
      orderIndex: 4,
      lessons: maquetteLes4Lessons,
    },
    {
      id: "seed-module-maquette-les-5",
      titleEn: "Maquette — Roads of Equal Rank (Lesson 5)",
      titleNl: "Maquette — Wegen van gelijke rangorde (Les 5)",
      orderIndex: 5,
      lessons: maquetteLes5Lessons,
    },
    {
      id: "seed-module-maquette-les-6",
      titleEn: "Maquette — Priority Vehicles (Lesson 6)",
      titleNl: "Maquette — Bevoorrechte weggebruikers (Les 6)",
      orderIndex: 6,
      lessons: maquetteLes6Lessons,
    },
    {
      // Was a placeholder "Road Rules & Signs" module; replaced on the live
      // database by prisma/replace-verkeersborden.ts.
      titleEn: "Traffic Signs",
      titleNl: "Verkeersborden",
      id: "seed-module-1",
      orderIndex: 7,
      lessons: verkeersbordenLessons,
    },
    {
      // The school's question list for the theory exam, the part every category shares.
      id: "seed-module-theorie-algemeen",
      titleEn: "Theory Exam Questions",
      titleNl: "Theorie-examenvragen",
      orderIndex: 8,
      lessons: theorieAlgemeenLessons,
    },
    {
      // Only for students taking the truck (C) or bus (D) licence; last, so they hold nobody up.
      id: "seed-module-theorie-c",
      titleEn: "Theory Exam Questions: Trucks (Category C)",
      titleNl: "Theorie-examenvragen: vrachtauto (categorie C)",
      orderIndex: 9,
      lessons: theorieCategorieCLessons,
    },
    {
      id: "seed-module-theorie-d",
      titleEn: "Theory Exam Questions: Buses (Category D)",
      titleNl: "Theorie-examenvragen: autobus (categorie D)",
      orderIndex: 10,
      lessons: theorieCategorieDLessons,
    },
  ];

  for (const mod of moduleSeeds) {
    const seeded = await prisma.module.upsert({
      where: { id: mod.id },
      // Keep existing rows in step when a module is inserted before them.
      update: { orderIndex: mod.orderIndex },
      create: {
        id: mod.id,
        titleEn: mod.titleEn,
        titleNl: mod.titleNl,
        orderIndex: mod.orderIndex,
        isPublished: true,
      },
    });

    for (let i = 0; i < mod.lessons.length; i++) {
      const lesson = mod.lessons[i];
      await prisma.lesson.upsert({
        where: { id: `${seeded.id}-lesson-${i + 1}` },
        update: {},
        create: {
          id: `${seeded.id}-lesson-${i + 1}`,
          moduleId: seeded.id,
          title: lesson.title,
          type: lesson.type,
          content: lesson.content,
          orderIndex: i + 1,
        },
      });
    }
  }

  console.log({
    admin: admin.email,
    instructors: instructors.length,
    packages: packageSeeds.length,
    faqs: faqSeeds.length,
    modules: moduleSeeds.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
