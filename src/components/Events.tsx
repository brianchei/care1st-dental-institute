import Link from "next/link";
import styles from "./Events.module.css";

const uses = [
  "Continuing-education events",
  "Study clubs and workshops",
  "Product demonstrations",
  "Professional meetings and lectures",
  "Networking gatherings",
  "Dental-industry events",
];

export function Events() {
  return (
    <section id="events" className={`section ${styles.events}`}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className="section-label">Events & venue</p>
          <h2 className="section-title">
            A dental-ready space for professional gatherings.
          </h2>
          <p className="section-lead">
            Beyond scheduled instruction, the facility can support organizers
            who need an environment already equipped for dental education and
            professional collaboration. Availability and formats are confirmed
            by inquiry.
          </p>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Inquire about hosting</h3>
          <ul className={styles.list}>
            {uses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className={styles.note}>
            These are examples of activities the facility is suited to support.
            Contact Care1st to discuss your program, meeting, or event.
          </p>
          <div className={styles.actions}>
            <Link href="/#contact" className="btn btn-gold">
              Discuss Hosting an Event
            </Link>
            <a href="tel:+19723152345" className="btn btn-outline">
              Call Care1st
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
