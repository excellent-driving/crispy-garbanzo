// Real course content, sourced from materiaalrijonderricht/Maquette les 4.pdf
// (T-kruisingen and inritsituaties). Its 10 diagrams are examples that go
// with the text, so they have no number; the student still solves each one
// ("Opl:"). Keys follow the PDF in page order:
//   t-kruising*       T-kruising (PDF page 1)
//   regel-1           inrit (PDF pages 1–2: the diagram is split by the page break)
//   regel-2           smalle inrit bezet (page 3)
//   regel-3-opl-1/2   verkeersfatsoen, "Opl 1" and "Opl 2" (page 3)
//   regel-4           fietser rechtdoor naar de inrit (page 3)
//   regel-5           voertuig rechtdoor naar de inrit (page 4)
//   regel-6           model 14 (page 4)
// Every "Opl:" in the PDF is blank. The answer key,
// materiaalrijonderricht/ANTWOORDEN MAQUETTES H4.docx, answers four of them:
// the T-kruising, the two brede T-kruisingen (in page order: with rijwielpad,
// then without) and regel 1 ("zogenaamde T-kruising inrit situatie smal").
// Regel 2–6 are not in the key. At the owner's request (2026-10-11) their
// answers are worked out from the PDF's rules and Oplossingsmodel A, checked
// against the two inrit answers the key does give (les 4 regel 1, les 6 V.B. 2).
// They are shown as worked examples, not quizzes. The instructor confirmed
// them on 2026-10-15 with two corrections: in regel 3 Opl 2, f5 and f4 ride
// together (no second V.F.), and regel 5's answer holds on a wide road only.
//
// All of them use the wide template: a T-kruising leaves out the north arm;
// with an inrit, the whole north arm is the inrit. Where the PDF draws a road user beside or
// behind another, `lane` and `behind` place it the same way.
import { withKey, type RoadUser, type Situation } from "../../lib/maquette";

type Extra = Pick<RoadUser, "lane" | "behind">;
const roadUser = (kind: RoadUser["kind"]) =>
  (label: string, from: RoadUser["from"], to: RoadUser["to"], extra: Extra = {}): RoadUser => ({
    label, kind, from, to, hasPriority: false, ...extra,
  });
const auto = roadUser("auto");
const fiets = roadUser("fiets");

// The two brede T-kruisingen are the same situation, with and without a rijwielpad. The
// PDF writes the cyclist on the rijwielpad as "F1"; both are "f1" here.
const tKruisingBreed = (bikeLanes: boolean): Situation => ({
  wide: true,
  missingArm: "noord",
  bikeLanes,
  users: [
    fiets("f1", "west", "oost"), auto("1", "west", "oost"), auto("2", "west", "zuid"),
    auto("6", "oost", "west"), auto("7", "oost", "zuid"),
    fiets("f3", "zuid", "oost"), auto("4", "zuid", "west"), auto("5", "zuid", "oost"),
  ],
});

const drawn: Record<string, Situation> = {
  "t-kruising": {
    wide: true,
    missingArm: "noord",
    roadWidth: "B/S",
    bikeLanes: false,
    users: [auto("1", "west", "zuid"), auto("2", "oost", "west"), auto("3", "zuid", "west")],
  },
  "t-kruising-breed-rijwielpad": tKruisingBreed(true),
  "t-kruising-breed": tKruisingBreed(false),
  // Rule 1: traffic to the inrit keeps to the far left, so 2 turns rechtsaf
  // from the kerb lane.
  "regel-1": {
    wide: true,
    inrit: "noord",
    inritWidth: "S",
    roadWidth: "B/S",
    bikeLanes: false,
    users: [
      auto("3", "west", "noord"), auto("4", "noord", "zuid"),
      auto("2", "oost", "noord", { lane: "kerb" }), auto("1", "zuid", "noord"),
    ],
  },
  // Rule 2: from every side one car waits at the kerb for the inrit and a
  // second one stands behind it, towards the centre.
  "regel-2": {
    wide: true,
    inrit: "noord",
    inritWidth: "S",
    roadWidth: "S",
    bikeLanes: false,
    users: [
      auto("7", "west", "noord"), auto("1", "west", "zuid", { lane: "inner", behind: true }),
      auto("4", "noord", "oost"),
      auto("6", "oost", "noord", { lane: "kerb" }), auto("2", "oost", "west", { lane: "inner", behind: true }),
      auto("5", "zuid", "noord"), auto("3", "zuid", "oost", { behind: true }),
    ],
  },
  // Rule 3, Opl 1: 3 and 4 both drive straight on and pass a car waiting
  // for the inrit (2 and 5).
  "regel-3-opl-1": {
    wide: true,
    inrit: "noord",
    inritWidth: "S",
    roadWidth: "S",
    bikeLanes: false,
    users: [
      auto("1", "noord", "zuid"),
      auto("2", "west", "noord"), auto("3", "west", "oost", { lane: "inner", behind: true }),
      auto("5", "oost", "noord", { lane: "kerb" }), auto("4", "oost", "west", { lane: "inner", behind: true }),
    ],
  },
  // Rule 3, Opl 2: f5 drives straight on and 3 turns linksaf, each passing a
  // car waiting for the inrit (2 and 6). f4 waits behind 3.
  "regel-3-opl-2": {
    wide: true,
    inrit: "noord",
    inritWidth: "S",
    roadWidth: "S",
    bikeLanes: false,
    users: [
      auto("1", "noord", "oost"),
      auto("2", "west", "noord"), fiets("f5", "west", "oost", { lane: "inner", behind: true }),
      auto("6", "oost", "noord", { lane: "kerb" }), auto("3", "oost", "zuid", { lane: "inner" }),
      fiets("f4", "oost", "west", { lane: "inner", behind: true }),
    ],
  },
  // Rule 4. The PDF labels the cyclist "F".
  "regel-4": {
    wide: true,
    inrit: "noord",
    inritWidth: "B/S",
    roadWidth: "B/S",
    bikeLanes: false,
    users: [fiets("f", "zuid", "noord"), auto("1", "zuid", "west")],
  },
  // Rule 5: 1 is at the front; 2 and 3 stand behind it.
  "regel-5": {
    wide: true,
    inrit: "noord",
    inritWidth: "B/S",
    roadWidth: "B/S",
    bikeLanes: false,
    users: [auto("1", "zuid", "noord"), auto("2", "zuid", "west"), auto("3", "zuid", "oost", { behind: true })],
  },
  // Rule 6: model 14 closes the west road to traffic heading west, so 4 can
  // wait beside 2 on the other half of the road and f3 cannot pass between.
  "regel-6": {
    wide: true,
    inrit: "noord",
    inritWidth: "S",
    roadWidth: "S",
    noEntryArm: "west",
    bikeLanes: false,
    users: [
      auto("1", "noord", "zuid"),
      auto("2", "west", "noord"), auto("4", "west", "zuid", { lane: "opposite" }),
      fiets("f3", "west", "oost", { lane: "inner", behind: true }),
    ],
  },
};

// Who rides in the first turn (green) and who is in verkeersfatsoen (purple),
// read off the answer key; everyone else waits (orange).
const KEY: Record<string, [go: string[], vf?: string[]]> = {
  "t-kruising": [["2"]],
  "t-kruising-breed-rijwielpad": [["6", "1", "f1"], ["f3", "4"]],
  "t-kruising-breed": [["6", "f1", "1"]],
  "regel-1": [["4"]],
  // Worked out from the rules, not from the key (see the top of this file).
  "regel-2": [["2"]],
  "regel-3-opl-1": [[], ["3", "4"]],
  "regel-3-opl-2": [[], ["f5", "3"]],
  "regel-4": [["1"]],
  "regel-5": [["1"]],
  "regel-6": [["4"]],
};

export const S: Record<string, Situation> = Object.fromEntries(
  Object.entries(drawn).map(([key, situation]) => [key, KEY[key] ? withKey(situation, ...KEY[key]) : situation]),
);

const ORDER_Q = "In welke volgorde mogen de weggebruikers rijden?";

const tKruisingGuide =
  "<p>Een <strong>T-kruising</strong> is een kruispunt waar een doorgaande weg samenkomt met een weg die daar eindigt. Verkeer op de <strong>doorgaande weg</strong> heeft voorrang. Bestuurders die uit de <strong>eindigende weg</strong> komen, moeten daarom altijd voorrang verlenen aan het verkeer op de doorgaande weg (LET OP-regel 7).</p>" +
  "<p>Op de doorgaande weg zelf gelden de gewone regels, zoals de <strong>Goudenregel</strong>: een rechtsaffer verleent voorrang aan een linksaffer en aan rechtdoorgaand verkeer dat tegenover hem staat.</p>" +
  "<ul>" +
  "<li>In de tekeningen loopt de doorgaande weg van links naar rechts; de eindigende weg komt van onder.</li>" +
  "<li><span style=\"color:#16a34a;font-weight:700\">Groen</span> = rijdt als eerste, <span style=\"color:#d97706;font-weight:700\">oranje</span> = moet wachten, <span style=\"color:#7c3aed;font-weight:700\">paars</span> = verkeersfatsoen (wie gewenkt wordt, rijdt eerst). Bij de oefeningen zie je de kleuren pas nadat je een antwoord hebt gekozen.</li>" +
  "</ul>";

const inritGuide =
  "<h3>Zogenaamde T-kruisingen (inritsituatie smal)</h3>" +
  "<p>Bij een inritsituatie werk je <strong>altijd als bij een T-kruising</strong>. De weg tegenover de inrit is de eindigende weg.</p>" +
  "<ol>" +
  "<li>Het verkeer naar de inrit mag <strong>nooit voorsorteren</strong>. Dat verkeer blijft uiterst links van de weg staan.</li>" +
  "<li>Bij een T-kruising met een <strong>smalle inrit die bezet is</strong>, moet eerst al het verkeer dat <strong>niet</strong> naar de inrit gaat oprijden. Wanneer alleen voertuigen zijn overgebleven die naar de inrit gaan, wordt de inrit vrijgemaakt.</li>" +
  "<li>Wanneer op een smalle doorgaande weg twee voertuigen elkaar tegemoetkomen — waarbij beide rechtdoor rijden of één rechtdoor rijdt en de ander links afslaat — en zij tegelijk een voertuig moeten passeren dat de inrit wil inrijden, dan wordt tussen deze twee voertuigen altijd <strong>V.F.</strong> toegepast, ook tussen een fietser, bromfiets of motorfiets en een auto. Dit is het <strong>3e verkeersfatsoen</strong>.</li>" +
  "<li>Staan op een eindigende weg een <strong>fietser en een auto naast elkaar</strong>, waarbij de fietser rechtdoor rijdt naar een vrije of brede inrit aan de overkant en de auto links afslaat, dan mag de auto eerst rijden. Het verkeer dat naar de inrit gaat, mag het afslaande voertuig niet hinderen.</li>" +
  "<li>Rijdt op een eindigende weg een voertuig met meer dan twee wielen <strong>rechtdoor naar een vrije of brede inrit</strong> direct aan de overkant, dan mag dit voertuig eerst oprijden, vóór de voertuigen die erachter staan.</li>" +
  "<li>Geldt bij een inritsituatie op smalle wegen voor een gedeelte van de doorgaande weg een <strong>geslotenverklaring (model 14)</strong>, en slaat op dat gedeelte een voertuig met meer dan twee wielen links af naar een smalle, bezette inrit terwijl daarnaast een ander voertuig rechts afslaat naar de eindigende weg, dan kan er geen ander voertuig tussendoor rijden.</li>" +
  "</ol>" +
  "<h3>Oplossingsmodel A: inrit smal (S) bezet, weg smal (S)</h3>" +
  "<ol>" +
  "<li>Eerst al het verkeer dat niet naar de inrit gaat laten oprijden (werken als een T-kruising).</li>" +
  "<li>Wie op de doorgaande weg rechtsaf naar de inrit gaat, rijdt als laatste op.</li>" +
  "<li>Inrit vrijmaken.</li>" +
  "<li>Daarna alle voertuigen in de inrit plaatsen (werken als een T-kruising).</li>" +
  "</ol>" +
  "<h3>Oplossingsmodel B: inrit breed (B) bezet; smal (S) of breed (B) onbezet</h3>" +
  "<ol>" +
  "<li>Altijd werken als een T-kruising. Er is <strong>nooit V.F.</strong> tussen voertuigen tegenover elkaar.</li>" +
  "<li>Wie op de doorgaande weg rechtsaf naar de inrit gaat, rijdt als laatste op.</li>" +
  "<li>Het voertuig uit de inrit rijdt als allerlaatste.</li>" +
  "</ol>";

export const maquetteLes4Lessons = [
  {
    title: "De T-kruising + uitwerking",
    type: "TEXT" as const,
    content: {
      type: "TEXT",
      body: tKruisingGuide,
      examples: [
        {
          situation: S["t-kruising"],
          solution: "2 – 1 – 3",
          explanation:
            "2 rijdt op de doorgaande weg rechtdoor en gaat als eerste. 1 slaat vanaf de doorgaande weg rechtsaf en moet de weg van 2 kruisen: volgens de <strong>Goudenregel</strong> wacht hij. 3 komt uit de <strong>eindigende weg</strong> en verleent voorrang aan al het verkeer op de doorgaande weg, dus 3 gaat als laatste. Oplossing: <strong>2 – 1 – 3</strong>.",
        },
      ],
    },
  },
  {
    title: "Oefenen: de brede T-kruising, met en zonder rijwielpad",
    type: "QUIZ" as const,
    content: {
      type: "QUIZ",
      passingScore: 70,
      questions: [
        {
          situation: S["t-kruising-breed-rijwielpad"],
          text: `Brede T-kruising, met rijwielpad (M.R.P.): ${ORDER_Q.toLowerCase()}`,
          options: [
            "6 + f1 + 1 – 7 – 2 – 4 + 5 – f3",
            "6 + 1 + f1 – 7 – 2 – VF f3+4 — (f3W4) 4 + 5 – f3 of (4Wf3) f3 + 5 – 4",
            "6 + 1 + f1 – 2 – 7 – VF f3+4 — (f3W4) 4 + 5 – f3 of (4Wf3) f3 + 5 – 4",
          ],
          correct: 1,
          explanation:
            "Eerst het verkeer op de <strong>doorgaande weg</strong>: 6, 1 en f1 gaan rechtdoor en rijden samen. Dan linksaffer 7; rechtsaffer 2 wacht op hem (<strong>Goudenregel</strong>). Daarna de <strong>eindigende weg</strong>: f3 en 4 staan naast elkaar en hun wegen kruisen, dus tussen hen wordt <strong>onderling verkeersfatsoen</strong> toegepast; 5 rijdt mee met wie eerst gaat. Oplossing: <strong>6 + 1 + f1 – 7 – 2 – VF f3+4 — (f3W4) 4 + 5 – f3 of (4Wf3) f3 + 5 – 4</strong>.",
        },
        {
          situation: S["t-kruising-breed"],
          text: `Dezelfde brede T-kruising, nu zonder rijwielpad (Z.R.P.): ${ORDER_Q.toLowerCase()}`,
          options: [
            "6 + f1 + 1 – 7 – 2 – 4 + 5 – f3",
            "6 + 1 + f1 – 7 – 2 – VF f3+4 — (f3W4) 4 + 5 – f3 of (4Wf3) f3 + 5 – 4",
            "6 + f1 + 1 – 7 – 2 – 4 + 5 + f3",
          ],
          correct: 0,
          explanation:
            "De doorgaande weg rijdt zoals bij de vorige vraag: eerst 6, f1 en 1, dan 7, dan 2. Op de eindigende weg rijden 4 en 5 samen. f3 slaat rechtsaf, maar zonder rijwielpad rijdt de fiets niet samen met de auto (LET OP-regel 5), dus f3 gaat als laatste. Oplossing: <strong>6 + f1 + 1 – 7 – 2 – 4 + 5 – f3</strong>. Vergelijk met de vorige vraag: het rijwielpad maakt het verschil.",
        },
      ],
    },
  },
  {
    title: "Inritsituaties + uitwerkingen regel 1–6",
    type: "TEXT" as const,
    content: {
      type: "TEXT",
      body: inritGuide,
      examples: [
        {
          situation: S["regel-1"],
          solution: "4 – 3 – 2 – 1",
          explanation:
            "Bovenaan is een smalle inrit. 4 komt uit de inrit en is de enige die er niet naartoe gaat: hij rijdt eerst en maakt de inrit vrij. Daarna gaan de anderen de inrit in, zoals bij een T-kruising: eerst 3 van de doorgaande weg, dan 2, die op de doorgaande weg rechtsaf naar de inrit gaat en daarom als laatste van de doorgaande weg oprijdt. 2 sorteert niet voor maar blijft uiterst links staan (regel 1). Als laatste 1 van de eindigende weg. Oplossing: <strong>4 – 3 – 2 – 1</strong>.",
        },
        {
          situation: S["regel-2"],
          solution: "2 – 1 – 3 – 4 – 7 – 6 – 5",
          explanation:
            "De smalle inrit is bezet door 4, en 7, 6 en 5 wachten om erin te gaan. Volgens <strong>regel 2</strong> rijdt eerst al het verkeer dat niet naar de inrit gaat, zoals bij een T-kruising: 2 gaat op de doorgaande weg rechtdoor, rechtsaffer 1 wacht op hem (<strong>Goudenregel</strong>), en 3 komt van de eindigende weg en gaat als laatste van hen. Dan maakt 4 de inrit vrij. Daarna gaan 7, 6 en 5 de inrit in zoals bij een T-kruising: eerst linksaffer 7, dan 6, die op de doorgaande weg rechtsaf naar de inrit gaat, en als laatste 5 van de eindigende weg. Oplossing: <strong>2 – 1 – 3 – 4 – 7 – 6 – 5</strong>.",
        },
        {
          situation: S["regel-3-opl-1"],
          solution: "VF 3+4 — (3W4) 4 – 3 – 1 – 2 – 5 of (4W3) 3 – 4 – 1 – 2 – 5",
          explanation:
            "3 en 4 komen elkaar tegemoet op een smalle doorgaande weg en gaan allebei rechtdoor. Allebei moeten ze een voertuig passeren dat naar de inrit wil (2 en 5). Volgens <strong>regel 3</strong> wordt tussen hen altijd <strong>V.F.</strong> toegepast: wie gewenkt wordt, rijdt eerst. Daarna maakt 1 de inrit vrij, en gaan 2 en 5 erin; 5 gaat op de doorgaande weg rechtsaf naar de inrit en rijdt daarom als laatste. Oplossing: <strong>VF 3+4 — (3W4) 4 – 3 – 1 – 2 – 5 of (4W3) 3 – 4 – 1 – 2 – 5</strong>.",
        },
        {
          situation: S["regel-3-opl-2"],
          solution: "VF f5+3 — (3Wf5) f5 – 3 – f4 – 1 – 2 – 6 of (f5W3) 3 – f5 + f4 – 1 – 2 – 6",
          explanation:
            "f5 gaat rechtdoor en 3 slaat linksaf; ze komen elkaar tegemoet en moeten allebei een voertuig passeren dat naar de inrit wil (2 en 6). Volgens <strong>regel 3</strong> is er dan <strong>V.F.</strong>, ook tussen een fietser en een auto. Wenkt 3 naar f5, dan rijdt f5, dan 3, en daarna f4, die achter 3 stond. Wenkt f5 naar 3, dan rijdt 3 eerst; daarna rijden f5 en f4 samen. Er is geen V.F. tussen die twee. Als al dat verkeer weg is, maakt 1 de inrit vrij, en gaan 2 en daarna 6 erin. Oplossing: <strong>VF f5+3 — (3Wf5) f5 – 3 – f4 – 1 – 2 – 6 of (f5W3) 3 – f5 + f4 – 1 – 2 – 6</strong>.",
        },
        {
          situation: S["regel-4"],
          solution: "1 – f",
          explanation:
            "f en 1 staan naast elkaar op de eindigende weg. f rijdt rechtdoor naar de inrit aan de overkant, 1 slaat linksaf. Volgens <strong>regel 4</strong> mag het verkeer naar de inrit het afslaande voertuig niet hinderen, dus 1 rijdt eerst. Oplossing: <strong>1 – f</strong>.",
        },
        {
          situation: S["regel-5"],
          solution: "Brede weg: 1 – 2 + 3",
          explanation:
            "1 staat vooraan op de eindigende weg en rijdt rechtdoor naar de vrije inrit aan de overkant. Volgens <strong>regel 5</strong> mag hij eerst oprijden, vóór de voertuigen achter hem. Daarna slaan 2 (linksaf) en 3 (rechtsaf) samen af; er is geen ander verkeer. Deze oplossing geldt bij een <strong>brede weg</strong>; bij een smalle weg niet. Oplossing (brede weg): <strong>1 – 2 + 3</strong>.",
        },
        {
          situation: S["regel-6"],
          solution: "4 – f3 – 1 – 2",
          explanation:
            "Door het bord <strong>model 14</strong> mag er geen verkeer de linkerweg in, dus staat 4 naast 2 op de andere weghelft. 2 slaat linksaf naar de bezette inrit en 4 rechtsaf naar de eindigende weg; volgens <strong>regel 6</strong> kan f3 er niet tussendoor. Eerst rijdt 4, die niet naar de inrit gaat. Nu kan f3 rechtdoor. Dan maakt 1 de inrit vrij, en als laatste gaat 2 erin. Oplossing: <strong>4 – f3 – 1 – 2</strong>.",
        },
      ],
    },
  },
];
