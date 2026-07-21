import Image from "next/image";
import styles from "./Training.module.css";

const capabilities = [
  {
    title: "Lecture-based instruction",
    body: "A dedicated training room with projection and display capability for presentations, case discussion, and didactic teaching.",
  },
  {
    title: "Clinical demonstrations",
    body: "Spaces configured for live demonstration so participants can observe technique up close in a professional setting.",
  },
  {
    title: "Hands-on learning",
    body: "Workstation-style setups and clinical tools support practical skill development alongside instruction.",
  },
  {
    title: "Small-group collaboration",
    body: "Meeting and collaboration rooms allow focused discussion, breakouts, and team-based learning.",
  },
  {
    title: "Equipment-based training",
    body: "Dental chairs, clinical instruments, and imaging equipment create a realistic environment for education.",
  },
  {
    title: "Professional workshops",
    body: "Flexible layouts support workshops and product-focused sessions when organizers need a dental-ready venue.",
  },
];

export function Training() {
  return (
    <section id="training" className={`section ${styles.training}`}>
      <div className="container">
        <div className={styles.intro}>
          <p className="section-label">Training experience</p>
          <h2 className="section-title">
            Instruction that belongs in a clinical setting.
          </h2>
          <p className="section-lead">
            Programs and sessions at Care1st emphasize practical learning—
            pairing presentation spaces with hands-on clinical capability.
            Specific course calendars and credentials are shared upon inquiry.
          </p>
        </div>

        <div className={styles.feature}>
          <div className={styles.media}>
            <Image
              src="/images/facility/hands-on-training.jpg"
              alt="Instructor guiding dental professionals through hands-on workstation training"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.image}
            />
          </div>
          <div className={styles.mediaNote}>
            <p>
              Hands-on stations, clinical tools, and instructional support create
              an environment suited to continuing education and skill refinement—
              not patient-facing general dentistry.
            </p>
          </div>
        </div>

        <ul className={styles.grid}>
          {capabilities.map((item) => (
            <li key={item.title} className={styles.card}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
