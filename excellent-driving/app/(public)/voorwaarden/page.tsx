import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { terms } from "@/lib/legal";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Meta"))("terms") };
}

export default function Page() {
  return <LegalPage doc={terms} />;
}
