import { VRAGEN, theorieAlgemeenLessons, theorieCategorieCLessons, theorieCategorieDLessons } from "../../prisma/content/theorie-vragen";

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));
const bodies = (lessons: { content: object }[]) => lessons.map((l) => (l.content as { body: string }).body);

describe("theory exam questions", () => {
  it("keeps every numbered question from the PDFs, in order", () => {
    // 47 is the speed table; 82a and 82b follow 82.
    const general = range(1, 107).filter((n) => n !== "47").flatMap((n) => (n === "82" ? ["82", "82a", "82b"] : [n]));
    expect(VRAGEN.ALGEMEEN.map((v) => v.nr)).toEqual(general);
    expect(VRAGEN.CATEGORIE_C.map((v) => v.nr)).toEqual([...range(1, 6), "7a", "7b", "7c", ...range(8, 14)]);
    expect(VRAGEN.CATEGORIE_D.map((v) => v.nr)).toEqual(range(1, 11));
  });

  it("gives every question an answer and leaves no page furniture in the text", () => {
    for (const v of [...VRAGEN.ALGEMEEN, ...VRAGEN.CATEGORIE_C, ...VRAGEN.CATEGORIE_D]) {
      const answer = Array.isArray(v.antwoord) ? v.antwoord.join(" ") : v.antwoord;
      expect({ nr: v.nr, ok: v.vraag.length > 5 && answer.length > 0 }).toEqual({ nr: v.nr, ok: true });
      expect(`${v.vraag} ${answer}`).not.toMatch(/Succes|\+\+\+|MAXIMUM SNELHEDEN/);
    }
  });

  it("shows each question once, on pages of ten numbers, with the speed table once", () => {
    const all = [...bodies(theorieAlgemeenLessons), ...bodies(theorieCategorieCLessons), ...bodies(theorieCategorieDLessons)].join("");
    expect((all.match(/<details class="qa">/g) ?? []).length).toBe(
      VRAGEN.ALGEMEEN.length + VRAGEN.CATEGORIE_C.length + VRAGEN.CATEGORIE_D.length
    );
    expect(theorieAlgemeenLessons.map((l) => l.title)).toEqual(
      ["1–10", "11–20", "21–30", "31–40", "41–50", "51–60", "61–70", "71–80", "81–90", "91–100", "101–107"].map((r) => `Examenvragen ${r}`)
    );
    expect((all.match(/speed-table/g) ?? []).length).toBe(1);
    expect(bodies(theorieAlgemeenLessons)[4]).toContain("speed-table");
  });
});
