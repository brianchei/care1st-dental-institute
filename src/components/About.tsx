import Link from "next/link";
import styles from "./About.module.css";

const audiences = [
  "Dentists seeking continuing education",
  "Clinical teams and dental professionals",
  "Course instructors and speakers",
  "Dental organizations and study groups",
  "Companies needing a dental-specific venue",
];

export function About() {
  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className="section-label">The Institute</p>
          <h2 className="section-title">
            Built for dental education—not a general clinic.
          </h2>
        </div>
        <div className={styles.copy}>
          <p>
            Care1st Dental Institute is a professional training and education
            facility designed for practical instruction, continuing education,
            and dental-industry collaboration. The environment supports lecture
            learning, chairside demonstration, and hands-on skill development in
            spaces equipped for clinical training.
          </p>
          <p>
            Whether you are evaluating a program, preparing to teach, or looking
            for a venue that understands dental workflows, the institute offers
            a purpose-built setting—distinct from a consumer dental practice or
            a generic conference room.
          </p>
          <h3 className={styles.subhead}>Who we serve</h3>
          <ul className={styles.list}>
            {audiences.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link href="/#contact" className={`btn btn-outline ${styles.cta}`}>
            Ask About Training
          </Link>
        </div>
      </div>
    </section>
  );
}
