import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.media}>
        <Image
          src="/images/facility/hands-on-training.jpg"
          alt="Instructor guiding dental professionals through hands-on workstation training at Care1st"
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
        <div className={styles.overlay} aria-hidden="true" />
      </div>

      <div className={`container ${styles.content}`}>
        <p className={styles.eyebrow}>{site.tagline}</p>
        <h1 id="hero-heading" className={styles.title}>
          A modern environment for hands-on dental education.
        </h1>
        <p className={styles.subtitle}>
          Care1st Dental Institute brings together advanced clinical equipment,
          dedicated instruction spaces, and flexible meeting areas for
          continuing education, professional development, and dental-industry
          events.
        </p>
        <div className={styles.actions}>
          <Link href="/#contact" className="btn btn-gold">
            Request Information
          </Link>
          <Link href="/#facility" className="btn btn-secondary">
            Explore the Facility
          </Link>
        </div>
      </div>
    </section>
  );
}
