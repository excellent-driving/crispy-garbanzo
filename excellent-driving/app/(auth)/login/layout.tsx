import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("Meta"))("login") };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
