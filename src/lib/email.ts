import { Resend } from "resend";
import nodemailer, { type Transporter } from "nodemailer";

// ─── Transport selection ───────────────────────────────────────────────
// Free path: set GMAIL_USER + GMAIL_APP_PASSWORD → uses Nodemailer over Gmail SMTP.
// Production path: set RESEND_API_KEY (with a verified domain) → uses Resend.
// If both are set, Gmail wins (free first).

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const usingGmail = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);

if (!usingGmail && !RESEND_API_KEY) {
  throw new Error(
    "No email transport configured. Set GMAIL_USER + GMAIL_APP_PASSWORD (free) OR RESEND_API_KEY in .env.local.",
  );
}

let gmailTransport: Transporter | null = null;
let resendClient: Resend | null = null;

function getGmail(): Transporter {
  if (!gmailTransport) {
    gmailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER!, pass: GMAIL_APP_PASSWORD! },
    });
  }
  return gmailTransport;
}

function getResend(): Resend {
  if (!resendClient) resendClient = new Resend(RESEND_API_KEY!);
  return resendClient;
}

// Sender + reply-to fall back gracefully across providers.
const FROM =
  process.env.EMAIL_FROM ??
  (usingGmail
    ? `Conscious Travel <${GMAIL_USER}>`
    : "Conscious Travel <onboarding@resend.dev>");
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? GMAIL_USER ?? "hello@conscioustravel.id";

async function send(args: { to: string; subject: string; html: string }) {
  const { to, subject, html } = args;

  if (usingGmail) {
    await getGmail().sendMail({
      from: FROM,
      to,
      replyTo: REPLY_TO,
      subject,
      html,
    });
    return;
  }

  await getResend().emails.send({
    from: FROM,
    to: [to],
    replyTo: REPLY_TO,
    subject,
    html,
  });
}

// ─── Templates ─────────────────────────────────────────────────────────

const styles = {
  page: "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f3eb; padding: 32px 16px; color: #2d2620;",
  container: "max-width: 540px; margin: 0 auto;",
  brand:
    "font-family: Georgia, 'Times New Roman', serif; font-size: 20px; letter-spacing: -0.01em; color: #2d2620;",
  card: "background-color: #fdfaf3; border: 1px solid #e2d8c8; border-radius: 12px; padding: 32px; margin-top: 24px;",
  eyebrow:
    "font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #6b6258; margin: 0 0 8px;",
  h1: "font-family: Georgia, serif; font-size: 26px; line-height: 1.15; color: #2d2620; margin: 0 0 16px;",
  body: "font-size: 15px; line-height: 1.6; color: #6b6258; margin: 0 0 16px;",
  refLabel:
    "font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #6b6258; margin: 0 0 6px;",
  ref: "font-family: 'Courier New', monospace; font-size: 22px; letter-spacing: 0.12em; color: #2d2620; margin: 0;",
  hr: "border: 0; border-top: 1px solid #e2d8c8; margin: 24px 0;",
  rowKey: "padding: 8px 0; font-size: 13px; color: #6b6258; border-bottom: 1px solid #e2d8c8;",
  rowVal:
    "padding: 8px 0; font-size: 13px; color: #2d2620; text-align: right; border-bottom: 1px solid #e2d8c8;",
  totalKey: "padding: 12px 0 0; font-size: 13px; color: #6b6258;",
  totalVal: "padding: 12px 0 0; font-size: 15px; color: #2d2620; text-align: right; font-weight: 600;",
  demoBox:
    "background-color: #fbf2ed; border: 1px dashed #d8a08e; border-radius: 8px; padding: 18px; margin-top: 24px;",
  demoTag:
    "display: inline-block; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #b8543b; background: #b8543b18; padding: 4px 10px; border-radius: 999px; margin: 0 0 10px;",
  footer: "font-size: 11px; color: #8b8278; margin-top: 24px; text-align: center;",
  italicAccent: "color: #b8543b; font-style: italic; font-family: Georgia, serif;",
};

function brandHeader(): string {
  return `<div style="${styles.brand}">Conscious<span style="color: #b8543b;">.</span><span style="color: #6b6258;">travel</span></div>`;
}

function emailLayout(inner: string): string {
  return `<div style="${styles.page}"><div style="${styles.container}">${brandHeader()}${inner}<p style="${styles.footer}">Conscious Travel · Indonesia</p></div></div>`;
}

type BookingEmailParams = {
  to: string;
  firstName: string;
  reference: string;
  tourTitle: string;
  paxCount: number;
  totalDisplay: string;
};

export async function sendBookingConfirmation(params: BookingEmailParams): Promise<void> {
  const { to, firstName, reference, tourTitle, paxCount, totalDisplay } = params;

  const html = emailLayout(`
    <div style="${styles.card}">
      <p style="${styles.eyebrow}">Booking received</p>
      <h1 style="${styles.h1}">Terima kasih, <span style="${styles.italicAccent}">${escapeHtml(firstName)}</span>.</h1>
      <p style="${styles.body}">Your spot is held for 48 hours. Keep the reference below for any follow-up.</p>
      <hr style="${styles.hr}" />
      <p style="${styles.refLabel}">Reference</p>
      <p style="${styles.ref}">${escapeHtml(reference)}</p>
      <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
        <tr><td style="${styles.rowKey}">Journey</td><td style="${styles.rowVal}">${escapeHtml(tourTitle)}</td></tr>
        <tr><td style="${styles.rowKey}">Travelers</td><td style="${styles.rowVal}">${paxCount}</td></tr>
        <tr><td style="${styles.totalKey}">Total</td><td style="${styles.totalVal}">${escapeHtml(totalDisplay)}</td></tr>
      </table>
      <div style="${styles.demoBox}">
        <span style="${styles.demoTag}">Demo mode</span>
        <p style="font-size: 13px; line-height: 1.5; color: #6b6258; margin: 0;">Payment instructions will arrive in a follow-up email once the business bank, Midtrans, and Stripe gateways are wired. For now, this confirms your booking is recorded.</p>
      </div>
      <p style="font-size: 13px; line-height: 1.6; color: #6b6258; margin: 24px 0 0;">Any questions, just reply to this email. A real person reads them.</p>
    </div>
  `);

  await send({
    to,
    subject: `Booking received · ${reference}`,
    html,
  });
}

type InquiryEmailParams = {
  to: string;
  firstName: string;
  reference: string;
};

export async function sendInquiryReceived(params: InquiryEmailParams): Promise<void> {
  const { to, firstName, reference } = params;

  const html = emailLayout(`
    <div style="${styles.card}">
      <p style="${styles.eyebrow}">Inquiry received</p>
      <h1 style="${styles.h1}">Terima kasih, <span style="${styles.italicAccent}">${escapeHtml(firstName)}</span>.</h1>
      <p style="${styles.body}">A real person will read this and come back within two business days with a custom proposal.</p>
      <hr style="${styles.hr}" />
      <p style="${styles.refLabel}">Reference</p>
      <p style="${styles.ref}">${escapeHtml(reference)}</p>
      <p style="font-size: 13px; line-height: 1.6; color: #6b6258; margin: 24px 0 0;">In the meantime, browse our pre-built journeys at <a href="https://conscioustravel.id/tours" style="color: #b8543b; text-decoration: none;">conscioustravel.id/tours</a>.</p>
    </div>
  `);

  await send({
    to,
    subject: `Inquiry received · ${reference}`,
    html,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
