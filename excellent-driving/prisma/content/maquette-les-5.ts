// Real course content, sourced from materiaalrijonderricht/Maquette les 5.pdf
// (wegen van gelijke rangorde). As in les 4, its 5 diagrams are examples that
// go with the text, so they have no number; the student still solves each one
// ("Opl:"). Keys follow the PDF in page order:
//   regel-1           page 1
//   regel-2           page 1, all corners occupied
//   regel-3-vb-1/2    page 1, one corner free (two examples)
//   oplossingsmodel   page 2, the example under "Oplossingsmodel"
// Every "Opl:" in the PDF is blank; the answer key is
// materiaalrijonderricht/ANTWOORDEN MAQUETTES H5&6.docx, in the same order,
// followed as written. Its "(T8W6)" in the oplossingsmodel is f8 W 6.
import { withKey, type RoadUser, type Situation } from "../../lib/maquette";

const roadUser = (kind: RoadUser["kind"]) =>
  (label: string, from: RoadUser["from"], to: RoadUser["to"]): RoadUser => ({
    label, kind, from, to, hasPriority: false,
  });
const auto = roadUser("auto");
const fiets = roadUser("fiets");

const drawn: Record<string, Situation> = {
  // The PDF draws 1 and 2 as arrows only; they are drawn as cars here.
  "regel-1": {
    wide: true,
    roadWidth: "B/S",
    bikeLanes: false,
    users: [auto("1", "noord", "zuid"), auto("2", "west", "oost")],
  },
  // All corners occupied, by rechtsaffers and straight-through traffic only.
  "regel-2": {
    wide: true,
    roadWidth: "B/S",
    bikeLanes: false,
    users: [auto("1", "noord", "zuid"), auto("2", "west", "zuid"), auto("3", "oost", "west"), auto("4", "zuid", "oost")],
  },
  // The right-hand corner is free. Only 1 has a number in the PDF; the
  // linksaffer from the left (drawn as a line and an arrow, no car) is 2 and
  // the car from the bottom is 3 here.
  "regel-3-vb-1": {
    wide: true,
    roadWidth: "B/S",
    bikeLanes: false,
    users: [auto("1", "noord", "zuid"), auto("2", "west", "noord"), auto("3", "zuid", "noord")],
  },
  // The right-hand corner is free; the PDF labels this one "S/B".
  "regel-3-vb-2": {
    wide: true,
    roadWidth: "B/S",
    bikeLanes: false,
    users: [auto("1", "noord", "oost"), fiets("f2", "noord", "zuid"), auto("3", "west", "noord"), auto("4", "zuid", "noord")],
  },
  // The west–oost road has a rijwielpad on both sides. 1 waits behind 2 and
  // f8 behind f7.
  oplossingsmodel: {
    wide: true,
    roadWidth: "S",
    bikeLanes: true,
    users: [
      auto("2", "noord", "oost"), auto("1", "noord", "oost"), fiets("f3", "noord", "west"),
      fiets("f4", "west", "oost"), auto("5", "west", "zuid"),
      auto("6", "oost", "zuid"), fiets("f7", "oost", "west"), fiets("f8", "oost", "noord"),
    ],
  },
};

// Who rides in the first turn (green) and who is in verkeersfatsoen (purple),
// read off the answer key; everyone else waits (orange).
const KEY: Record<string, [go: string[], vf?: string[]]> = {
  "regel-1": [["1"]],
  "regel-2": [[], ["1", "2", "3", "4"]],
  "regel-3-vb-1": [["1", "2"]],
  "regel-3-vb-2": [["3", "f2"]],
  oplossingsmodel: [["2", "f7"], ["6", "f8"]],
};

export const S: Record<string, Situation> = Object.fromEntries(
  Object.entries(drawn).map(([key, situation]) => [key, withKey(situation, ...KEY[key])]),
);

const ORDER_Q = "in welke volgorde mogen de weggebruikers rijden?";
const REGEL_2 =
  "VF 1+3 — (3W1) 1 – 2 – 4 – 3 of VF 1+2 — (1W2) 2 – 4 – 3 – 1 of VF 4+3 — (4W3) 3 – 1 – 2 – 4 of VF 2+4 — (2W4) 4 – 3 – 1 – 2";

const equalRoadsGuide =
  "<p><strong>Wegen van gelijke rangorde</strong> zijn twee verharde of twee onverharde wegen die elkaar kruisen, zonder dat de overheid verkeersmaatregelen heeft getroffen om de voorrang te regelen. Op zo'n kruising heeft het verkeer dat <strong>van links</strong> komt voorrang (LET OP-regel 9).</p>" +
  "<p>Is er bij wegen van gelijke rangorde een <strong>hoek onbezet</strong>, dan pas je deze regels toe, in deze volgorde:</p>" +
  "<ol>" +
  "<li><strong>Links vrij</strong>, en <strong>linksaffers in combinatie</strong> (soms).</li>" +
  "<li><strong>Verkeersfatsoen (V.F.)</strong>.</li>" +
  "</ol>" +
  "<h3>Oplossingsmodel voor wegen van gelijke rangorde</h3>" +
  "<ol>" +
  "<li><strong>Linksaffer (L.A.)</strong>: is er combinatie mogelijk wanneer een poot vrij is?</li>" +
  "<li><strong>Links vrij (L.V.)</strong>.</li>" +
  "<li><strong>Verkeersfatsoen</strong>, alle hoeken wenken naar rechts: wanneer alle poten bezet zijn door rechtsaffers en rechtdoorgaand verkeer.</li>" +
  "</ol>" +
  "<h3>De 4 soorten verkeersfatsoen</h3>" +
  "<ol>" +
  "<li><strong>Onderling verkeersfatsoen (o.v.f.)</strong> tussen een tweewieler en een vierwieler die naast elkaar staan (tussen een fietser en een auto).</li>" +
  "<li><strong>Verkeersfatsoen tegenover elkaar</strong>, tussen twee auto's die rechtsaf gaan op een smalle weg (niet tussen een vierwieler en een tweewieler). Zie les 2.</li>" +
  "<li>Bij <strong>wegen van gelijke rangorde</strong>, waarbij alle poten bezet zijn door rechtsaffers en/of rechtdoorgaand verkeer: V.F., alle hoeken wenken naar rechts.</li>" +
  "<li>Bij een <strong>inritsituatie smal, inrit smal bezet</strong>: alleen V.F. tussen twee rechtdoorgaande voertuigen, of een rechtdoorgaand voertuig en een linksaffer, tegenover elkaar, die allebei een voertuig moeten passeren dat naar de inrit gaat (ook tussen twee fietsers, of een fietser en een auto). Zie les 4.</li>" +
  "</ol>" +
  "<p><span style=\"color:#16a34a;font-weight:700\">Groen</span> = rijdt als eerste, <span style=\"color:#d97706;font-weight:700\">oranje</span> = moet wachten, <span style=\"color:#7c3aed;font-weight:700\">paars</span> = verkeersfatsoen. Bij de oefeningen zie je de kleuren pas nadat je een antwoord hebt gekozen.</p>";

export const maquetteLes5Lessons = [
  {
    title: "Wegen van gelijke rangorde + uitwerkingen",
    type: "TEXT" as const,
    content: {
      type: "TEXT",
      body: equalRoadsGuide,
      examples: [
        {
          situation: S["regel-1"],
          solution: "1 – 2",
          explanation:
            "1 en 2 gaan allebei rechtdoor en hun wegen kruisen. Geen van beide wegen gaat voor, dus het verkeer <strong>van links</strong> heeft voorrang. Voor 2 komt 1 van links: 1 rijdt eerst. Oplossing: <strong>1 – 2</strong>.",
        },
        {
          situation: S["regel-2"],
          solution: REGEL_2,
          explanation:
            "Alle vier de hoeken zijn bezet, alleen door rechtsaffers en rechtdoorgaand verkeer. Iedereen heeft verkeer van links, dus niemand kan op zijn voorrang rijden. Dan wordt <strong>V.F.</strong> toegepast: alle hoeken wenken naar rechts. Je weet niet wie begint, dus je schrijft alle vier de mogelijkheden op. Oplossing: <strong>" + REGEL_2 + "</strong>.",
        },
      ],
    },
  },
  {
    title: "Oefenen: een hoek vrij, en het oplossingsmodel",
    type: "QUIZ" as const,
    content: {
      type: "QUIZ",
      passingScore: 70,
      questions: [
        {
          situation: S["regel-3-vb-1"],
          text: `De hoek rechts is vrij: ${ORDER_Q}`,
          options: ["3 – 1 + 2", "1 + 2 – 3", "1 – 2 – 3"],
          correct: 1,
          explanation:
            "Voor 1 is de weg links van hem vrij (<strong>links vrij</strong>), dus 1 rijdt als eerste. 2 slaat linksaf, de korte bocht, en rijdt <strong>in combinatie</strong> met 1. 3 heeft 2 van links en wacht. Oplossing: <strong>1 + 2 – 3</strong>.",
        },
        {
          situation: S["regel-3-vb-2"],
          text: `De hoek rechts is vrij: ${ORDER_Q}`,
          options: ["1 + f2 – 3 + 4", "3 + f2 – 1 + 4", "3 + f2 + 1 – 4"],
          correct: 1,
          explanation:
            "f2 komt van de kant die links vrij heeft en gaat rechtdoor. Linksaffer 3 rijdt in combinatie met f2. 1 slaat linksaf en kruist daarbij f2, die links van hem rechtdoor gaat, dus 1 wacht. 4 heeft 3 van links en wacht ook. Daarna rijden 1 en 4 samen. Oplossing: <strong>3 + f2 – 1 + 4</strong>.",
        },
        {
          situation: S.oplossingsmodel,
          text: `Het voorbeeld bij het oplossingsmodel (de weg van links naar rechts heeft een rijwielpad): ${ORDER_Q}`,
          options: [
            "2 + f7 – 6 + f8 + 1 – f3 – 5 + f4",
            "VF 6+f8 — (6Wf8) f8 + 2 + f7 – 1 – 6 – f3 – 5 + f4 of (f8W6) 6 + 2 + f7 – 1 – f8 – f3 – 5 + f4",
            "2 + f7 – VF 6+f8 — (6Wf8) f8 + 1 – 6 – f3 – 5 + f4 of (f8W6) 6 + 1 – f8 – f3 – 5 + f4",
          ],
          correct: 2,
          explanation:
            "Eerst rijden linksaffer 2 en f7 samen. 6 en f8 staan naast elkaar en hun wegen kruisen, dus tussen hen wordt <strong>onderling verkeersfatsoen</strong> toegepast. Wie gewenkt wordt, rijdt samen met 1; daarna de ander. Dan f3, en als laatste 5 en f4 samen. Oplossing: <strong>2 + f7 – VF 6+f8 — (6Wf8) f8 + 1 – 6 – f3 – 5 + f4 of (f8W6) 6 + 1 – f8 – f3 – 5 + f4</strong>.",
        },
      ],
    },
  },
];
