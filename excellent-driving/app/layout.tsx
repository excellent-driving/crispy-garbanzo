import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Providers } from "@/components/providers";
import { DemoBanner } from "@/components/demo-banner";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return {
    title: { template: "%s | Excellent Driving", default: t("siteTitle") },
    description: t("description"),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${sora.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <DemoBanner />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
