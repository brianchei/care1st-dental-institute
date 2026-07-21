import Image from "next/image";
import styles from "./Facility.module.css";

const spaces = [
  {
    title: "Clinical training area",
    body: "Dental chairs, clinical tools, and demonstration capability for realistic, equipment-based instruction.",
    src: "/images/facility/clinical-group.jpg",
    alt: "Clinical training area with cabinetry, imaging equipment, and dental professionals",
  },
  {
    title: "Lecture & training room",
    body: "A dedicated room for presentations and instruction, supported by projection and wall displays.",
    src: "/images/facility/lecture-room.jpg",
    alt: "Lecture room with seminar seating, wall displays, and a live presentation",
  },
  {
    title: "Central multipurpose area",
    body: "An open professional space that can support workshops, networking, product sessions, and gatherings.",
    src: "/images/facility/multipurpose-event.jpg",
    alt: "Central multipurpose area hosting a professional dental education event",
  },
];

export function Facility() {
  return (
    <section id="facility" className={`section ${styles.facility}`}>
      <div className="container">
        <div className={styles.intro}>
          <p className="section-label">Facility & equipment</p>
          <h2 className="section-title">
            Spaces designed around dental training.
          </h2>
          <p className="section-lead">
            The facility combines clinical equipment with instruction and
            collaboration rooms—so education happens where the work actually
            looks and feels like dentistry.
          </p>
        </div>

        <div className={styles.exterior}>
          <div className={styles.exteriorMedia}>
            <Image
              src="/images/facility/exterior-entrance.jpg"
              alt="Care1st Dental Institute building entrance with institute signage at 1548 Valwood Parkway"
              fill
              sizes="(max-width: 900px) 100vw, 60vw"
              className={styles.image}
            />
          </div>
          <div className={styles.exteriorCopy}>
            <h3>Purpose-built for professional learning</h3>
            <p>
              From the clinical floor to the lecture room, Care1st is arranged
              for teaching, demonstration, and professional events—supported by
              dental chairs, tools, imaging equipment, and presentation
              technology.
            </p>
            <ul className={styles.checklist}>
              <li>Dental chairs and clinical equipment</li>
              <li>Hands-on teaching and demonstration capability</li>
              <li>Meeting and collaboration rooms</li>
              <li>Presentation-ready training spaces</li>
            </ul>
          </div>
        </div>

        <ul className={styles.spaces}>
          {spaces.map((space) => (
            <li key={space.title} className={styles.space}>
              <div className={styles.spaceMedia}>
                <Image
                  src={space.src}
                  alt={space.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className={styles.image}
                />
              </div>
              <div className={styles.spaceCopy}>
                <h3>{space.title}</h3>
                <p>{space.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
