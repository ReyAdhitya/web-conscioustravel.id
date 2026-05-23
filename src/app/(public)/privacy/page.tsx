import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Conscious Travel Indonesia collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="2026-05-23">
      <p>
        Conscious Travel (PT Conscious Travel Indonesia) operates conscioustravel.id and respects
        your privacy. This policy explains what data we collect, why we collect it, and how we
        keep it safe.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Contact details</strong>: name, email, phone — collected when you submit an
          inquiry or book a journey.
        </li>
        <li>
          <strong>Booking details</strong>: travel dates, group size, dietary or mobility notes you
          choose to share.
        </li>
        <li>
          <strong>Payment metadata</strong>: payment provider transaction IDs (never card numbers
          — handled directly by Midtrans/Stripe).
        </li>
        <li>
          <strong>Analytics</strong>: anonymized usage data via Vercel Analytics to understand
          which pages get visited.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To process your bookings and send confirmation emails.</li>
        <li>To respond to custom-journey inquiries within two business days.</li>
        <li>To send occasional newsletter updates if you opt in.</li>
        <li>To improve the website and our journeys.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>
        Only the local partners, guides, and lodges directly involved in your journey. We do not
        sell, rent, or trade your personal information to third parties.
      </p>

      <h2>Data retention</h2>
      <p>
        We keep booking records for seven years for tax purposes. Inquiry-only data is purged
        after twenty-four months of inactivity.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request a copy of your data, ask us to correct or delete it, or unsubscribe from
        newsletters at any time. Email <a href="mailto:hello@conscioustravel.id">hello@conscioustravel.id</a>{" "}
        and we&apos;ll respond within seven days.
      </p>

      <h2>Contact</h2>
      <p>
        PT Conscious Travel Indonesia
        <br />
        Jalan Pantai, Mangrove Bay
        <br />
        Bali, 80361, Indonesia
        <br />
        <a href="mailto:hello@conscioustravel.id">hello@conscioustravel.id</a>
      </p>
    </LegalPage>
  );
}
