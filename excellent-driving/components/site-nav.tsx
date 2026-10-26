"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { BOOKING_ENABLED } from "@/lib/features";

export function SiteNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/packages", label: t("packages") },
    ...(BOOKING_ENABLED ? [{ href: "/instructors", label: t("instructors") }] : []),
    { href: "/faq", label: t("faq") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <nav>
      <div className="nav-inner">
        <Link href="/" className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="logo-text">
            Excellent Driving
            <span>Rijschool · Suriname</span>
          </div>
        </Link>

        <div className={`mobile-nav-panel${menuOpen ? " open" : ""}`}>
          <ul className="nav-links" id="primary-menu">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={pathname === link.href ? "active" : ""} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <LanguageSwitcher />
            <Link href="/login" className="btn btn-outline" onClick={() => setMenuOpen(false)}>
              {t("login")}
            </Link>
            <Link href={BOOKING_ENABLED ? "/booking" : "/register"} className="btn btn-primary" onClick={() => setMenuOpen(false)}>
              {BOOKING_ENABLED ? t("bookNow") : t("getStarted")}
            </Link>
          </div>
        </div>

        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          aria-label={t("toggleMenu")}
          aria-expanded={menuOpen}
          aria-controls="primary-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
