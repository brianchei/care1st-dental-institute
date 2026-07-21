import { NextResponse } from "next/server";
import { Resend } from "resend";
import { inquiryTypes, site, type InquiryType } from "@/lib/site";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type InquiryBody = {
  name?: string;
  email?: string;
  phone?: string;
  inquiryType?: string;
  message?: string;
  company?: string;
};

function labelForType(value: string) {
  return (
    inquiryTypes.find((type) => type.value === value)?.label ?? value
  );
}

export async function POST(request: Request) {
  let body: InquiryBody;

  try {
    body = (await request.json()) as InquiryBody;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  // Honeypot filled => pretend success
  if (body.company && String(body.company).trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const inquiryType = String(body.inquiryType ?? "").trim() as InquiryType;
  const message = String(body.message ?? "").trim();

  if (!name || !email || !phone || !inquiryType || !message) {
    return NextResponse.json(
      { success: false, message: "Please complete all required fields." },
      { status: 400 },
    );
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { success: false, message: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  if (!inquiryTypes.some((type) => type.value === inquiryType)) {
    return NextResponse.json(
      { success: false, message: "Please select a valid inquiry type." },
      { status: 400 },
    );
  }

  if (message.length > 5000 || name.length > 200) {
    return NextResponse.json(
      { success: false, message: "Message is too long." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || site.email;

  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.json(
      {
        success: false,
        message:
          "Online form is temporarily unavailable. Please call or email us directly.",
      },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const typeLabel = labelForType(inquiryType);
  const fromAddress =
    process.env.RESEND_FROM_EMAIL || "Care1st Dental Institute <onboarding@resend.dev>";

  try {
    await resend.emails.send({
      from: fromAddress,
      to: adminEmail,
      replyTo: email,
      subject: `Inquiry: ${typeLabel} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
          <h2>New website inquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Interest:</strong> ${escapeHtml(typeLabel)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `We received your inquiry — ${site.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
          <h2>Thank you for contacting Care1st Dental Institute</h2>
          <p>Dear ${escapeHtml(name)},</p>
          <p>We received your inquiry about <strong>${escapeHtml(typeLabel)}</strong> and will follow up soon.</p>
          <p>If you need a quicker response, call us at <strong>${site.phone}</strong> or email <strong>${site.email}</strong>.</p>
          <p style="margin-top: 24px;">${site.name}<br>${site.address.full}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry email failed:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "We could not send your message. Please call or email us directly.",
      },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
