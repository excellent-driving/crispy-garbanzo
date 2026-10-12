import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { privacy } from "@/lib/legal";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Meta"))("privacy") };
}

export default function Page() {
  return <LegalPage doc={privacy} />;
}
