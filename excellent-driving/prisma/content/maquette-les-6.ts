// Real course content, sourced from materiaalrijonderricht/Maquette les 6.pdf
// (bevoorrechte weggebruikers). As in les 4 and 5, its 2 diagrams are
// examples that go with rule 1, so they have no number; the student still
// solves each one ("Opl:"). PS, BS and AS are police, fire brigade and
// ambulance with sirens, drawn as cars with their label.
// Every "Opl:" in the PDF is blank; the answer key is
// materiaalrijonderricht/ANTWOORDEN MAQUETTES H5&6.docx ("bevoorrechte
// weggebruikers"), in the same order, followed as written.
import { withKey, type RoadUser, type Situation } from "../../lib/maquette";

type Extra = Pick<RoadUser, "lane" | "behind">;
const roadUser = (kind: RoadUser["kind"]) =>
  (label: string, from: RoadUser["from"], to: RoadUser["to"], extra: Extra = {}): RoadUser => ({
    label, kind, from, to, hasPriority: false, ...extra,
  });
const auto = roadUser("auto");
const fiets = roadUser("fiets");

const drawn: Record<string, Situation> = {
  // The PDF labels this one "S/B" and the cyclist "F2". Car 3 turns linksaf
  // (confirmed by the owner; the PDF's drawing of it is unclear).
  "regel-1-vb-1": {
    wide: true,
    roadWidth: "B/S",
    bikeLanes: false,
    users: [
      auto("PS", "noord", "oost"), fiets("f1", "noord", "zuid"),
      auto("AS", "west", "oost"), auto("BS", "oost", "west"),
      fiets("f2", "zuid", "noord"), auto("3", "zuid", "west"),
    ],
  },
  // From the left, 3 passes 2, which waits for the inrit. From the right, BS
  // stands behind 5; from the bottom, PS stands behind 4.
  "regel-1-vb-2": {
    wide: true,
    inrit: "noord",
    inritWidth: "S",
    roadWidth: "S",
    bikeLanes: false,
    users: [
      auto("1", "noord", "zuid"),
      auto("2", "west", "noord"), auto("3", "west", "oost", { lane: "inner", behind: true }),
      auto("5", "oost", "zuid"), auto("BS", "oost", "noord", { behind: true }),
      auto("4", "zuid", "noord"), auto("PS", "zuid", "noord", { lane: "inner", behind: true }),
    ],
  },
};

// Who rides in the first turn (green); everyone else waits (orange).
const KEY: Record<string, [go: string[]]> = {
  "regel-1-vb-1": [["PS"]],
  "regel-1-vb-2": [["1"]],
};

export const S: Record<string, Situation> = Object.fromEntries(
  Object.entries(drawn).map(([key, situation]) => [key, withKey(situation, ...KEY[key])]),
);

const ORDER_Q = "in welke volgorde mogen de weggebruikers rijden?";

const privilegedGuide =
  "<p><strong>Bevoorrechte weggebruikers</strong> zijn voertuigen van de <strong>politie</strong>, <strong>brandweer</strong> en <strong>ambulance</strong> met sirene (LET OP-regel 10).</p>" +
  "<p>Staan er bevoorrechte weggebruikers in een situatie, dan moeten zij <strong>als eerste</strong> oprijden, in deze volgorde:</p>" +
  "<ol>" +
  "<li><strong>PS</strong>: politie met sirene</li>" +
  "<li><strong>BS</strong>: brandweer met sirene</li>" +
  "<li><strong>AS</strong>: ambulance met sirene</li>" +
  "</ol>" +
  "<div class=\"callout\"><strong>Let op:</strong> twee of meer van deze voertuigen tegelijk laten oprijden, de zogenaamde combinatie, is <strong>nooit</strong> toegestaan.</div>" +
  "<p>Daarna los je de rest van de situatie op zoals je gewend bent.</p>" +
  "<p><span style=\"color:#16a34a;font-weight:700\">Groen</span> = rijdt als eerste, <span style=\"color:#d97706;font-weight:700\">oranje</span> = moet wachten. Bij de oefening zie je de kleuren pas nadat je een antwoord hebt gekozen.</p>";

const summary =
  "<h3>Zo los je een maquette op</h3>" +
  "<ol>" +
  "<li>Kijk welke weg voorrang heeft.</li>" +
  "<li>Bespreek elk voertuig afzonderlijk. Let op de wegsituatie.</li>" +
  "<li>Kijk naar welke richting het voertuig gaat, met inachtneming van de <strong>Goudenregel</strong>.</li>" +
  "</ol>" +
  "<div class=\"callout\"><strong>Let op:</strong> kijk eerst goed welke richting de voertuigen opgaan, en daarna pas naar de wegsituatie.</div>" +
  "<p>Bij wegen van gelijke rangorde (les 5) is de volgorde:</p>" +
  "<ol>" +
  "<li><strong>Linksaffers (L.A.)</strong>, soms in combinatie.</li>" +
  "<li><strong>Links vrij (L.V.)</strong>.</li>" +
  "<li><strong>Verkeersfatsoen (V.F.)</strong>: alle hoeken wenken naar rechts.</li>" +
  "</ol>" +
  "<h3>Toelichting</h3>" +
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
  "</table>" +
  "<p><strong>Succes!</strong></p>";

export const maquetteLes6Lessons = [
  {
    title: "Bevoorrechte weggebruikers + uitwerking",
    type: "TEXT" as const,
    content: {
      type: "TEXT",
      body: privilegedGuide,
      examples: [
        {
          situation: S["regel-1-vb-1"],
          solution: "PS – BS – AS – f2 + f1 – 3",
          explanation:
            "Eerst de bevoorrechte weggebruikers, één voor één en in vaste volgorde: <strong>PS – BS – AS</strong>. Daarna de rest: f2 en f1 staan tegenover elkaar en gaan allebei rechtdoor, dus ze rijden samen. 3 slaat linksaf en kruist daarbij f2, die links van hem rechtdoor gaat, dus 3 rijdt als laatste. Oplossing: <strong>PS – BS – AS – f2 + f1 – 3</strong>.",
        },
      ],
    },
  },
  {
    title: "Oefenen: bevoorrechte weggebruikers bij een inrit",
    type: "QUIZ" as const,
    content: {
      type: "QUIZ",
      passingScore: 70,
      questions: [
        {
          situation: S["regel-1-vb-2"],
          text: `Bovenaan is een smalle inrit: ${ORDER_Q}`,
          options: ["PS – BS – 1 – 5 + 2 – 3 – 4", "1 – PS + BS – 5 + 2 – 3 – 4", "1 – PS – BS – 5 + 2 – 3 – 4"],
          correct: 2,
          explanation:
            "PS en BS moeten als eerste, maar ze willen allebei de inrit in en daar staat 1. Eerst rijdt 1 de inrit uit, zodat die vrij is. Dan PS en daarna BS, nooit samen. Daarna de rest: 5 en 2 samen, dan 3, en als laatste 4. Oplossing: <strong>1 – PS – BS – 5 + 2 – 3 – 4</strong>.",
        },
      ],
    },
  },
  {
    title: "Samenvatting: zo los je een maquette op",
    type: "TEXT" as const,
    content: { type: "TEXT", body: summary },
  },
];
