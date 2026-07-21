import Image from "next/image";
import Link from "next/link";
import { navLinks, site } from "@/lib/site";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandBlock}>
          <Link href="/" className={styles.brand}>
            <Image
              src="/images/logo/care1st-logo.jpg"
              alt=""
              width={44}
              height={44}
              className={styles.logo}
            />
            <span>
              <span className={styles.brandName}>Care 1st</span>
              <span className={styles.brandSub}>Dental Institute</span>
            </span>
          </Link>
          <p className={styles.blurb}>
            A purpose-built environment for hands-on dental education,
            professional collaboration, and industry events.
          </p>
        </div>

        <div>
          <h2 className={styles.heading}>Explore</h2>
          <ul className={styles.list}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={styles.heading}>Contact</h2>
          <ul className={styles.list}>
            <li>
              <a href={site.phoneHref}>{site.phone}</a>
            </li>
            <li>
              <a href={site.emailHref}>{site.email}</a>
            </li>
            <li>
              <address className={styles.address}>{site.address.full}</address>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={styles.heading}>Connect</h2>
          <ul className={styles.list}>
            <li>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          &copy; {year} {site.name}. All rights reserved.
        </p>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
