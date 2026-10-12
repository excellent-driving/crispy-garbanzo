import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getSchoolContact } from "@/lib/school";
import { ContactForm } from "./contact-form";
import styles from "./contact.module.css";

export default async function ContactPage() {
  const [t, tf, contact] = await Promise.all([getTranslations("Contact"), getTranslations("Footer"), getSchoolContact()]);
  const mapSrc =
    "https://www.google.com/maps?q=" +
    encodeURIComponent(`${contact.address}, Suriname`) +
    "&output=embed";

  return (
    <>
      <div className={styles["page-header"]}>
        <div className={styles["page-header-inner"]}>
          <div className={styles.breadcrumb}>
            <Link href="/">{t("home")}</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>{t("breadcrumb")}</span>
          </div>
          <h1>{t("title")}</h1>
          <p>{t("intro")}</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles["content-inner"]}>
          <div>
            <div className={styles["info-card"]}>
              <div className={styles["info-row"]}>
                <div className={styles["info-icon"]} aria-hidden="true">📍</div>
                <div>
                  <div className={styles["info-label"]}>{t("address")}</div>
                  <div className={styles["info-value"]}>{contact.address}</div>
                </div>
              </div>
              {contact.phone && (
                <div className={styles["info-row"]}>
                  <div className={styles["info-icon"]} aria-hidden="true">📞</div>
                  <div>
                    <div className={styles["info-label"]}>{t("phone")}</div>
                    <div className={styles["info-value"]}>{contact.phone}</div>
                  </div>
                </div>
              )}
              <div className={styles["info-row"]}>
                <div className={styles["info-icon"]} aria-hidden="true">✉️</div>
                <div>
                  <div className={styles["info-label"]}>{t("email")}</div>
                  <div className={styles["info-value"]}>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </div>
                </div>
              </div>
              <div className={styles["info-row"]}>
                <div className={styles["info-icon"]} aria-hidden="true">🕒</div>
                <div>
                  <div className={styles["info-label"]}>{t("hours")}</div>
                  <div className={styles["info-value"]}>{tf("hours")}</div>
                </div>
              </div>
              {contact.whatsappUrl && (
                <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" style={{ marginTop: 20 }}>
                  {tf("chatWhatsapp")}
                </a>
              )}
            </div>

            <iframe
              className={styles["map-frame"]}
              src={mapSrc}
              title={t("mapTitle", { address: contact.address })}
              loading="lazy"
            />
          </div>

          <ContactForm />
        </div>
      </div>
    </>
  );
}
