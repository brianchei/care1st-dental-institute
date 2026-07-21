"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";
import styles from "./Header.module.css";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} onClick={close}>
          <Image
            src="/images/logo/care1st-logo.jpg"
            alt=""
            width={48}
            height={48}
            className={styles.logo}
            priority
          />
          <span className={styles.brandText}>
            <span className={styles.brandName}>Care 1st</span>
            <span className={styles.brandSub}>Dental Institute</span>
          </span>
        </Link>

        <nav
          id="site-nav"
          className={`${styles.nav} ${open ? styles.navOpen : ""}`}
          aria-label="Primary"
        >
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink} onClick={close}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.navActions}>
            <a href={site.phoneHref} className={styles.phone}>
              {site.phone}
            </a>
            <Link
              href="/#contact"
              className={`btn btn-primary ${styles.cta}`}
              onClick={close}
            >
              Request Information
            </Link>
          </div>
        </nav>

        <button
          type="button"
          className={`${styles.menuBtn} ${open ? styles.menuOpen : ""}`}
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
