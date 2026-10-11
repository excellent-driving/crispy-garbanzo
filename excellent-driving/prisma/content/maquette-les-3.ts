// Real course content, sourced from materiaalrijonderricht/Maquette les 3.pdf
// (brede wegen). The PDF numbers its 11 diagrams 32–38 with repeats; at the
// owner's request they are numbered in order here, 32–42:
//   PDF page 1: 32, 33, 34, 35, 32 (second one)  →  32–36
//   PDF page 2: 33, 34, 35, 36                   →  37–40
//   PDF page 3: 37, 38                           →  41–42
// Every "Opl:" in the PDF is blank; the answer key is
// materiaalrijonderricht/ANTWOORDEN MAQUETTES H3.docx, which numbers its
// answers like the PDF (32–35, then 32–38) and is followed as written, with
// three typos corrected by the owner (2026-10-11): in 34 "(F+2)1+2-7" is
// (fW2) 1 + 2 – f; in 40 "3+2+F1-3+4" is 3 + 2 + f1 – 1 + 4; in 41 the second
// possibility's "10" is f10.
import { withKey, type RoadUser, type Situation } from "../../lib/maquette";

const roadUser = (kind: RoadUser["kind"]) =>
  (label: string, from: RoadUser["from"], to: RoadUser["to"]): RoadUser => ({
    label, kind, from, to, hasPriority: false,
  });
const auto = roadUser("auto");
const fiets = roadUser("fiets");

// Directions are from the diagram, as in les 1a and les 2: from noord,
// rechtsaf = west and linksaf = oost; from zuid it's the other way round.
// M.R.P. in the PDF draws a rijwielpad along the west–oost road (bikeLanes).
const northTrio = (cyclist: string, cyclistTo: RoadUser["to"]) => [
  auto("1", "noord", "west"), auto("2", "noord", "oost"), fiets(cyclist, "noord", cyclistTo),
];

const drawn: Record<string, Situation> = {
  // The car at the top has no number in the PDF; it is labelled 1 here.
  "32": { number: 32, wide: true, bikeLanes: false, users: [auto("1", "noord", "west"), auto("2", "zuid", "oost")] },
  "33": { number: 33, wide: true, bikeLanes: false, users: northTrio("f", "west") },
  "34": { number: 34, wide: true, bikeLanes: true, users: northTrio("f", "west") },
  "35": {
    number: 35,
    wide: true,
    bikeLanes: false,
    users: [...northTrio("f", "west"), auto("3", "zuid", "west"), auto("4", "zuid", "oost")],
  },
  "36": {
    number: 36,
    wide: true,
    bikeLanes: true,
    users: [...northTrio("f", "west"), auto("3", "zuid", "west"), auto("4", "zuid", "oost")],
  },
  "37": {
    number: 37,
    wide: true,
    bikeLanes: false,
    users: [...northTrio("f1", "west"), fiets("f3", "zuid", "oost"), auto("4", "zuid", "oost")],
  },
  "38": {
    number: 38,
    wide: true,
    bikeLanes: true,
    users: [...northTrio("f1", "west"), fiets("f3", "zuid", "oost"), auto("4", "zuid", "oost")],
  },
  "39": {
    number: 39,
    wide: true,
    bikeLanes: false,
    users: [...northTrio("f1", "oost"), auto("3", "zuid", "noord"), auto("4", "zuid", "oost")],
  },
  "40": {
    number: 40,
    wide: true,
    bikeLanes: true,
    users: [...northTrio("f1", "oost"), auto("3", "zuid", "noord"), auto("4", "zuid", "oost")],
  },
  // The noord–zuid road is a zandweg (black circles), the west–oost road has
  // a rijwielpad. 13 waits behind 11.
  "41": {
    number: 41,
    wide: true,
    bikeLanes: true,
    sandRoad: true,
    users: [
      ...northTrio("f3", "west"),
      fiets("f4", "west", "zuid"), auto("5", "west", "noord"), auto("6", "west", "zuid"),
      auto("7", "oost", "noord"), auto("8", "oost", "zuid"), fiets("f9", "oost", "west"),
      fiets("f10", "zuid", "oost"), auto("11", "zuid", "west"), auto("12", "zuid", "oost"), auto("13", "zuid", "west"),
    ],
  },
  // The other way round: the west–oost road is a zandweg, the noord–zuid
  // road has a rijwielpad.
  "42": {
    number: 42,
    wide: true,
    bikeLanes: false,
    bikeLanesNorthSouth: true,
    sandRoadWestOost: true,
    users: [
      ...northTrio("f3", "west"),
      fiets("f4", "west", "zuid"), auto("5", "west", "oost"), auto("6", "west", "zuid"),
      auto("7", "oost", "noord"), fiets("f8", "oost", "noord"),
      fiets("f9", "zuid", "noord"), auto("10", "zuid", "west"), auto("11", "zuid", "oost"),
    ],
  },
};

// Who rides in the first turn (green) and who is in verkeersfatsoen (purple),
// read off the answer key; everyone else waits (orange).
const KEY: Record<string, [go: string[], vf?: string[]]> = {
  "32": [["1", "2"]],
  "33": [["1", "2"]],
  "34": [["1"], ["2", "f"]],
  "35": [["3", "2"]],
  "36": [["3", "2"]],
  "37": [["1", "2"]],
  "38": [["1"], ["2", "f1"]],
  "39": [["3", "f1"]],
  "40": [["3", "2", "f1"]],
  "41": [["5", "f9"], ["13", "f10"]],
  "42": [["f9", "2"]],
};

export const S: Record<string, Situation> = Object.fromEntries(
  Object.entries(drawn).map(([nr, situation]) => [nr, withKey(situation, ...KEY[nr])]),
);

const exercise = (number: string, text: string, options: string[], correct: number, explanation: string) => ({
  situation: S[number],
  text: `Situatie ${number}: ${text}`,
  options,
  correct,
  explanation,
});

const ORDER_Q = "in welke volgorde mogen de weggebruikers rijden?";
const ZRP = `${ORDER_Q} (Zonder rijwielpad — Z.R.P.)`;
const MRP = `${ORDER_Q} (Met rijwielpad — M.R.P.)`;
const SAND_NS = `${ORDER_Q} (De weg van boven naar beneden is een zandweg; de weg van links naar rechts heeft een rijwielpad.)`;
const SAND_WO = `${ORDER_Q} (De weg van links naar rechts is een zandweg; de weg van boven naar beneden heeft een rijwielpad.)`;

const wideRoadsGuide =
  "<p>Deze les gaat over kruisingen van <strong>brede wegen (B)</strong>. Op een brede weg zijn er in elke richting <strong>twee rijstroken</strong>. Twee rechtsaffers die tegenover elkaar staan, kunnen elkaar daar wél tegelijk passeren. Op een brede weg is er dus <strong>geen verkeersfatsoen</strong> tussen twee auto's die tegenover elkaar rechtsaf slaan, zoals op een smalle weg in les 2.</p>" +
  "<div class=\"callout\"><strong>Nogmaals:</strong> een rechtsaffer moet altijd voorrang verlenen aan een linksaffer en aan rechtdoorgaand verkeer dat tegenover hem staat.</div>" +
  "<h3>Fietser en auto naast elkaar</h3>" +
  "<p>Staan een fietser en een auto <strong>naast elkaar</strong> en kruisen hun wegen, dan wordt er soms <strong>onderling verkeersfatsoen</strong> toegepast: de een wenkt de ander. Je schrijft dan beide mogelijkheden op, met <strong>of</strong> ertussen, net als in les 2.</p>" +
  "<h3>Zo lees je de tekeningen</h3>" +
  "<ul>" +
  "<li>Een <strong>rechthoek</strong> is een auto, een <strong>bolletje</strong> is een fietser (f). De pijl laat zien waar ze naartoe willen. Staat er een auto achter een andere, dan wacht hij tot de voorste weg is.</li>" +
  "<li>Een blauwe band langs de weg is een <strong>rijwielpad (M.R.P.)</strong>. Geen band betekent <strong>zonder rijwielpad (Z.R.P.)</strong>.</li>" +
  "<li>Twee <strong>zwarte cirkels</strong> op een weg betekenen: die weg is een <strong>zandweg</strong>. Het verkeer op de verharde weg gaat voor (LET OP-regel 8).</li>" +
  "<li><span style=\"color:#16a34a;font-weight:700\">Groen</span> = rijdt als eerste, <span style=\"color:#d97706;font-weight:700\">oranje</span> = moet wachten, <span style=\"color:#7c3aed;font-weight:700\">paars</span> = verkeersfatsoen (wie gewenkt wordt, rijdt eerst). Bij de oefeningen zie je de kleuren pas nadat je een antwoord hebt gekozen.</li>" +
  "</ul>" +
  "<p>Notatie, zoals altijd: <strong>1 + 2</strong> = samen rijden, <strong>2 – 1</strong> = eerst 2, daarna 1.</p>";

export const maquetteLes3Lessons = [
  {
    title: "Brede wegen + uitwerking 32",
    type: "TEXT" as const,
    content: {
      type: "TEXT",
      body: wideRoadsGuide,
      examples: [
        {
          situation: S["32"],
          solution: "1 + 2",
          explanation:
            "1 en 2 staan tegenover elkaar en slaan allebei <strong>rechtsaf</strong>. Op een smalle weg zou hier VF gelden (les 2), maar dit is een <strong>brede weg</strong>: er is ruimte genoeg om elkaar te passeren. Ze rijden dus <strong>samen</strong>. Oplossing: <strong>1 + 2</strong>.",
        },
      ],
    },
  },
  {
    title: "Oefenen: situaties 33–37",
    type: "QUIZ" as const,
    content: {
      type: "QUIZ",
      passingScore: 70,
      questions: [
        exercise("33", ZRP, ["1 + 2 + f", "1 + 2 – f", "2 – 1 + f"], 1,
          "1 slaat rechtsaf en 2 linksaf. Ze komen van dezelfde kant en er staat niemand tegenover hen, dus ze rijden samen. f slaat ook rechtsaf, maar er is <strong>geen rijwielpad</strong>: volgens LET OP-regel 5 rijdt de fiets dan niet samen met de auto. Oplossing: <strong>1 + 2 – f</strong>."),
        exercise("34", MRP,
          ["1 + 2 + f", "VF 2+f — (fW2) 1 + 2 – f of (2Wf) 1 + f – 2", "VF 1+f — (fW1) 1 + 2 – f of (1Wf) 2 + f – 1"], 1,
          "Dezelfde bewegingen als situatie 33, maar nu <strong>met rijwielpad</strong>. 1 rijdt als eerste. f slaat over het rijwielpad rechtsaf en kruist daarbij de weg van linksaffer 2, die naast hem staat. Tussen 2 en f wordt <strong>onderling verkeersfatsoen</strong> toegepast. Oplossing: <strong>VF 2+f — (fW2) 1 + 2 – f of (2Wf) 1 + f – 2</strong>."),
        exercise("35", ZRP, ["1 + 4 – 3 + 2 – f", "3 + 2 – 1 + 4 + f", "3 + 2 – 1 + 4 – f"], 2,
          "2 en 3 staan tegenover elkaar en slaan allebei linksaf: ze rijden samen (LET OP-regel 2). Rechtsaffers 1 en 4 wachten op de linksaffer tegenover hen (<strong>Goudenregel</strong>) en rijden daarna samen; op een brede weg kan dat. f rijdt zonder rijwielpad niet mee met 1 (regel 5) en gaat als laatste. Oplossing: <strong>3 + 2 – 1 + 4 – f</strong>."),
        exercise("36", MRP, ["3 + 2 – 1 + 4 + f", "3 + 2 – 1 + 4 – f", "3 + 2 + f – 1 + 4"], 0,
          "Dezelfde bewegingen als situatie 35, maar nu <strong>met rijwielpad</strong>. Eerst de linksaffers 3 en 2, dan de rechtsaffers 1 en 4. f slaat nu af over het rijwielpad en rijdt mee met 1. Oplossing: <strong>3 + 2 – 1 + 4 + f</strong>. Vergelijk met situatie 35: het rijwielpad maakt het verschil."),
        exercise("37", ZRP, ["1 + 2 – 4 + f3 + f1", "1 + 2 + 4 – f3 + f1", "4 + f3 – 1 + 2 – f1"], 0,
          "1 en 2 rijden als eerste samen. Daarna rijden 4, f3 en f1 samen. Oplossing: <strong>1 + 2 – 4 + f3 + f1</strong>."),
      ],
    },
  },
  {
    title: "Oefenen: situaties 38–42",
    type: "QUIZ" as const,
    content: {
      type: "QUIZ",
      passingScore: 70,
      questions: [
        exercise("38", MRP,
          ["1 + 2 – 4 + f3 + f1", "VF 2+f1 — (2Wf1) 1 + f1 – 2 – 4 + f3 of (f1W2) 2 + 1 – 4 + f3 + f1", "VF 2+f1 — (2Wf1) 1 + f1 – 2 – 4 – f3 of (f1W2) 2 + 1 – f1 – 4 + f3"], 1,
          "Dezelfde bewegingen als situatie 37, maar nu <strong>met rijwielpad</strong>. f1 slaat over het rijwielpad rechtsaf en kruist de weg van linksaffer 2 naast hem: tussen 2 en f1 wordt <strong>onderling verkeersfatsoen</strong> toegepast, net als in situatie 34. Wenkt 2 naar f1, dan rijdt f1 mee met 1; wenkt f1 naar 2, dan rijdt f1 als laatste mee met 4 en f3. Oplossing: <strong>VF 2+f1 — (2Wf1) 1 + f1 – 2 – 4 + f3 of (f1W2) 2 + 1 – 4 + f3 + f1</strong>."),
        exercise("39", ZRP, ["3 + f1 + 2 – 1 – 4", "3 + f1 – 1 + 2 – 4", "1 + 2 – 3 + f1 – 4"], 1,
          "3 gaat rechtdoor en rijdt als eerste, samen met f1, die linksaf slaat. 2 slaat ook linksaf, maar zonder rijwielpad rijdt de auto niet samen met de fiets (LET OP-regel 4), dus 2 wacht. Rechtsaffer 1 wacht op 3, die tegenover hem rechtdoor gaat (<strong>Goudenregel</strong>). Daarna rijden 1 en 2 samen, en als laatste 4. Oplossing: <strong>3 + f1 – 1 + 2 – 4</strong>."),
        exercise("40", MRP, ["3 + f1 – 1 + 2 – 4", "3 + 2 + f1 – 1 – 4", "3 + 2 + f1 – 1 + 4"], 2,
          "Dezelfde bewegingen als situatie 39, maar nu <strong>met rijwielpad</strong>. f1 slaat over het rijwielpad linksaf, dus 2 mag nu wél samen met f1 rijden (LET OP-regel 4). Eerst 3, 2 en f1, daarna de rechtsaffers 1 en 4 samen. Oplossing: <strong>3 + 2 + f1 – 1 + 4</strong>."),
        exercise("41", SAND_NS,
          [
            "5 + f9 – 8 + 7 – 6 – f4 – 11 + 2 – VF 13+f10 — (13Wf10) f10 + 12 + 1 + f3 – 13 of (f10W13) 13 + 12 – 1 + f3 + f10",
            "11 + 2 – 5 + f9 – 8 + 7 – 6 – f4 – VF 13+f10 — (13Wf10) f10 + 12 + 1 + f3 – 13 of (f10W13) 13 + 12 – 1 + f3 + f10",
            "5 + f9 – 8 + 7 – 6 – f4 – 11 + 2 – 13 + 12 – 1 + f3 + f10",
          ], 0,
          "Het verkeer op de <strong>verharde weg</strong> (5, 6, f4, 7, 8 en f9) gaat voor het verkeer op de <strong>zandweg</strong> (LET OP-regel 8): eerst 5 en f9, dan 8 en 7, dan 6, dan f4. Daarna de zandweg: eerst 11 en 2 samen. Tussen 13 en f10 wordt <strong>VF</strong> toegepast. Oplossing: <strong>5 + f9 – 8 + 7 – 6 – f4 – 11 + 2 – VF 13+f10 — (13Wf10) f10 + 12 + 1 + f3 – 13 of (f10W13) 13 + 12 – 1 + f3 + f10</strong>."),
        exercise("42", SAND_WO,
          ["5 + 6 – 7 + f8 + f4 – f9 + 2 – 10 + 11 + 1 – f3", "f9 + 2 – 10 + 11 + 1 – f3 – 5 + 6 – 7 + f8 + f4", "f9 + 2 + 10 + 11 – 1 + f3 – 5 + 6 – 7 – f8 + f4"], 1,
          "Nu is het andersom: de weg van links naar rechts is de <strong>zandweg</strong>. Eerst het verkeer op de <strong>verharde weg</strong> (LET OP-regel 8): f9 en 2, dan 10, 11 en 1, dan f3. Daarna de zandweg: 5 en 6, dan 7, f8 en f4. Oplossing: <strong>f9 + 2 – 10 + 11 + 1 – f3 – 5 + 6 – 7 + f8 + f4</strong>."),
      ],
    },
  },
];
