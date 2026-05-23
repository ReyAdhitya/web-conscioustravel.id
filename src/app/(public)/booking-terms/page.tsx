import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Booking Terms",
  description: "Terms and conditions for booking with Conscious Travel Indonesia.",
};

export default function BookingTermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Booking Terms & Conditions" updated="2026-05-23">
      <p>
        By booking a journey with Conscious Travel, you agree to the following terms. We try to
        keep these short and human.
      </p>

      <h2>Booking confirmation</h2>
      <p>
        A booking is confirmed once payment is received in full. You&apos;ll receive a
        confirmation email with your reference number within minutes of payment.
      </p>

      <h2>Payment</h2>
      <ul>
        <li>Group departures: full payment at the time of booking.</li>
        <li>
          Custom journeys: 30% deposit on confirmation, balance due 30 days before departure.
        </li>
        <li>
          Accepted methods: GoPay, OVO, QRIS, bank transfer (Indonesia), and major credit cards
          (international).
        </li>
      </ul>

      <h2>Cancellation by you</h2>
      <ul>
        <li>More than 60 days before departure: full refund minus payment processing fees.</li>
        <li>30-60 days before departure: 50% refund.</li>
        <li>Less than 30 days before departure: no refund, but credit toward a future journey.</li>
        <li>
          <strong>Free re-booking</strong> up to 14 days before departure (one-time, subject to
          availability).
        </li>
      </ul>

      <h2>Cancellation by us</h2>
      <p>
        We may cancel a departure for safety, weather, or insufficient sign-ups. In all cases you
        receive a full refund or your choice of an alternative journey.
      </p>

      <h2>Insurance</h2>
      <p>
        We strongly recommend comprehensive travel insurance covering medical, trip
        cancellation, and personal liability. We can suggest providers if you ask.
      </p>

      <h2>Behaviour during journeys</h2>
      <p>
        Our journeys are small-group, community-led experiences. We expect respect for local
        customs, hosts, and fellow travellers. We reserve the right to end participation for
        anyone whose behaviour endangers others or the communities we visit, with no refund.
      </p>

      <h2>Liability</h2>
      <p>
        Conscious Travel acts as an agent for local operators. We carefully vet each operator
        but are not liable for events outside our reasonable control (weather, political events,
        force majeure, third-party operator failures). Our maximum liability is limited to the
        amount paid for the affected booking.
      </p>

      <h2>Questions?</h2>
      <p>
        Email <a href="mailto:hello@conscioustravel.id">hello@conscioustravel.id</a>. A real
        person reads every message.
      </p>
    </LegalPage>
  );
}
