import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getSchoolContact } from "@/lib/school";
import "./public-shared.css";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const contact = await getSchoolContact();
  return (
    <div className="flex min-h-full flex-col">
      <SiteNav />
      {children}
      <SiteFooter contact={contact} />
      {contact.whatsappUrl && <WhatsAppFloat href={contact.whatsappUrl} />}
    </div>
  );
}
