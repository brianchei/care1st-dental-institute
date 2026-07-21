"use client";

import { FormEvent, useState } from "react";
import { inquiryTypes, site } from "@/lib/site";
import styles from "./Inquiry.module.css";

type Status = "idle" | "submitting" | "success" | "error";

export function Inquiry() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          inquiryType: data.get("inquiryType"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Unable to send your inquiry.");
      }

      form.reset();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please call or email us directly.",
      );
    }
  }

  return (
    <section id="contact" className={`section ${styles.inquiry}`}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className="section-label">Inquiry</p>
          <h2 className="section-title">
            Request information or discuss your next session.
          </h2>
          <p className="section-lead">
            Tell us about training, facility use, speaking opportunities, or
            hosting an event. We respond by phone or email—no online booking
            required.
          </p>

          <ul className={styles.direct}>
            <li>
              <span>Phone</span>
              <a href={site.phoneHref}>{site.phone}</a>
            </li>
            <li>
              <span>Email</span>
              <a href={site.emailHref}>{site.email}</a>
            </li>
            <li>
              <span>Visit</span>
              <p>{site.address.full}</p>
            </li>
          </ul>

          <div className={styles.social}>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </div>
        </div>

        <div className={styles.formPanel}>
          {status === "success" ? (
            <div className={styles.success} role="status">
              <h3>Thank you</h3>
              <p>
                Your inquiry has been sent. We will follow up as soon as
                possible. For a faster response, call{" "}
                <a href={site.phoneHref}>{site.phone}</a>.
              </p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setStatus("idle")}
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={onSubmit} noValidate>
              <h3 className={styles.formTitle}>Inquiry form</h3>

              {/* Honeypot — leave empty */}
              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="name">Full name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="phone">Phone *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="inquiryType">I am interested in *</label>
                <select id="inquiryType" name="inquiryType" required defaultValue="">
                  <option value="" disabled>
                    Select an option
                  </option>
                  {inquiryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Share timing, group size, or what you hope to accomplish."
                />
              </div>

              {status === "error" && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Sending…" : "Send Inquiry"}
              </button>
              <p className={styles.privacy}>
                By submitting, you agree to be contacted about your inquiry. See
                our <a href="/privacy">privacy notice</a>.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
