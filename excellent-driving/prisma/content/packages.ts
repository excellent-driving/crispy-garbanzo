/**
 * The school's three theory packages, as agreed with the owner on 2026-10-29
 * (advice page: Basis, Volledig, Opfriscursus). Premium was merged into
 * Volledig and is switched off; its row stays because old bookings point at it.
 *
 * `modules` lists the seeded module ids a student with the package sees. The
 * admin can change this later under Admin > Content.
 */

const lessons1to6 = [
  "seed-module-0",
  "seed-module-maquette-les-1a",
  "seed-module-maquette-les-2",
  "seed-module-maquette-les-3",
  "seed-module-maquette-les-4",
  "seed-module-maquette-les-5",
  "seed-module-maquette-les-6",
];
const signs = ["seed-module-1"];
const examQuestions = ["seed-module-theorie-algemeen", "seed-module-theorie-c", "seed-module-theorie-d"];

export const packageSeeds = [
  {
    id: "seed-pkg-starter",
    nameEn: "Basic",
    nameNl: "Basis",
    descriptionEn: "For beginners: the online theory course with practice quizzes.",
    descriptionNl: "Voor beginners: de online theoriecursus met oefenquizzen.",
    price: 2500,
    featured: false,
    isActive: true,
    modules: [...lessons1to6, ...signs],
  },
  {
    id: "seed-pkg-standard",
    nameEn: "Complete",
    nameNl: "Volledig",
    descriptionEn: "The complete theory course, from the first right-of-way lesson to the exam questions.",
    descriptionNl: "De complete theoriecursus, van de eerste voorrangsles tot de examenvragen.",
    price: 3000,
    featured: true,
    isActive: true,
    modules: [...lessons1to6, ...signs, ...examQuestions],
  },
  {
    id: "seed-pkg-premium",
    nameEn: "Premium",
    nameNl: "Premium",
    descriptionEn: "Intensive program designed to get you exam-ready in minimum time.",
    descriptionNl: "Intensief programma om je in minimale tijd examenklaar te maken.",
    price: 3500,
    featured: false,
    isActive: false,
    modules: [] as string[],
  },
  {
    id: "seed-pkg-refresher",
    nameEn: "Refresher",
    nameNl: "Opfriscursus",
    descriptionEn: "A short refresher before the exam, for those who already know the rules.",
    descriptionNl: "Kort opfrissen voor het examen, voor wie de regels al kent.",
    price: 650,
    featured: false,
    isActive: true,
    modules: examQuestions,
  },
];
