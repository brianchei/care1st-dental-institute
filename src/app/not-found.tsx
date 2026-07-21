import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={`section ${styles.page}`}>
      <div className="container-narrow">
        <p className="section-label">404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.copy}>
          The page you requested is not available. Return to the Care1st Dental
          Institute home page or contact us directly.
        </p>
        <div className={styles.actions}>
          <Link href="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link href="/#contact" className="btn btn-outline">
            Contact the Institute
          </Link>
        </div>
      </div>
    </section>
  );
}
