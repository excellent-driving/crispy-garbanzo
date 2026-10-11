import { withKey, type Situation } from "../maquette";
import { maquetteLes3Lessons } from "../../prisma/content/maquette-les-3";
import { maquetteLes4Lessons } from "../../prisma/content/maquette-les-4";
import { maquetteLes5Lessons } from "../../prisma/content/maquette-les-5";
import { maquetteLes6Lessons } from "../../prisma/content/maquette-les-6";

type Lesson = { title: string; content: object };
type Answered = { where: string; situation: Situation; answer: string; options?: string[] };

// Every worked example and quiz question in les 3–6, with its answer.
const answered = (lessons: Lesson[]): Answered[] =>
  lessons.flatMap(({ title, content }) => {
    const c = content as {
      examples?: { situation: Situation; solution: string }[];
      questions?: { situation: Situation; options: string[]; correct: number }[];
    };
    return [
      ...(c.examples ?? []).map((e) => ({ where: title, situation: e.situation, answer: e.solution })),
      ...(c.questions ?? []).map((q) => ({ where: title, situation: q.situation, answer: q.options[q.correct], options: q.options })),
    ];
  });

const all = [maquetteLes3Lessons, maquetteLes4Lessons, maquetteLes5Lessons, maquetteLes6Lessons].flatMap(answered);

// Road-user labels named in an answer: "1", "f", "f10", "PS". "(13Wf10)" names 13 and f10.
const labelsIn = (answer: string) =>
  new Set(answer.replace(/\(([^()]*)W([^()]*)\)/g, " $1 $2 ").match(/\b(?:f\d*|PS|BS|AS|\d+)\b/g));

describe("maquette les 3–6 answers", () => {
  it("names every road user in the diagram, and nobody else", () => {
    expect(all.length).toBe(11 + 10 + 5 + 2);
    for (const { where, situation, answer } of all) {
      const expected = [...new Set(situation.users.map((u) => u.label))].sort();
      expect({ where, answer, labels: [...labelsIn(answer)].sort() }).toEqual({ where, answer, labels: expected });
    }
  });

  it("colours every answered diagram, so none is left all orange", () => {
    for (const { where, situation } of all) {
      expect({ where, coloured: situation.users.some((u) => u.hasPriority || u.courtesy) }).toEqual({ where, coloured: true });
    }
  });

  it("gives every quiz question three different options", () => {
    for (const { options } of all.filter((a) => a.options)) {
      expect(new Set(options).size).toBe(3);
    }
  });

  it("refuses a key that names a road user the diagram doesn't have", () => {
    const situation = all[0].situation;
    expect(() => withKey(situation, ["7"])).toThrow(/"7"/);
  });
});
