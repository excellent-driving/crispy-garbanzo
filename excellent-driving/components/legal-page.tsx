import { getLocale, getTranslations } from "next-intl/server";
import { getSchool } from "@/lib/school";
import { APPROVED } from "@/lib/legal";
import styles from "./legal-page.module.css";

type Doc = { title: string; intro: string; sections: { h: string; p: string[] }[] };

/** A privacy policy or terms page, with the school's own details filled in. */
export async function LegalPage({ doc }: { doc: Record<"nl" | "en", Doc> }) {
  const [locale, school] = await Promise.all([getLocale(), getSchool()]);
  const d = doc[locale === "nl" ? "nl" : "en"];
  const t = await getTranslations("Legal");
  const owner = school.contact.person;
  const fill = (text: string) =>
    text
      .replaceAll("{school}", school.name)
      .replaceAll("{address}", school.contact.address)
      .replaceAll("{email}", school.contact.email)
      .replaceAll("{owner}", owner ?? "");
  // A paragraph that names the owner is left out until a contact person is set.
  const shown = (p: string) => owner || !p.includes("{owner}");
  return (
    <main className={styles.wrap}>
      <article className={styles.doc}>
        {!APPROVED && <p className={styles.draft}>{t("draft")}</p>}
        <h1>{d.title}</h1>
        <p className={styles.intro}>{fill(d.intro)}</p>
        {d.sections.map((sec) => (
          <section key={sec.h}>
            <h2>{sec.h}</h2>
            {sec.p.filter(shown).map((p) => <p key={p}>{fill(p)}</p>)}
          </section>
        ))}
      </article>
    </main>
  );
}
