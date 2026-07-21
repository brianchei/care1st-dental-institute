import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} handles inquiry form information.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className={`section ${styles.page}`}>
      <div className="container-narrow">
        <p className="section-label">Legal</p>
        <h1 className={styles.title}>Privacy notice</h1>
        <p className={styles.lead}>
          This notice explains how Care1st Dental Institute handles information
          you submit through the website inquiry form.
        </p>

        <section className={styles.block}>
          <h2>Information we collect</h2>
          <p>
            When you send an inquiry, we collect the name, email address, phone
            number, inquiry type, and message you provide. We do not sell this
            information.
          </p>
        </section>

        <section className={styles.block}>
          <h2>How we use it</h2>
          <p>
            We use inquiry details solely to respond to your request about
            training, facility use, events, speaking opportunities, or related
            questions.
          </p>
        </section>

        <section className={styles.block}>
          <h2>Contact</h2>
          <p>
            Questions about this notice can be sent to{" "}
            <a href={site.emailHref}>{site.email}</a> or by calling{" "}
            <a href={site.phoneHref}>{site.phone}</a>.
          </p>
        </section>

        <p className={styles.back}>
          <Link href="/">← Back to home</Link>
        </p>
      </div>
    </article>
  );
}
