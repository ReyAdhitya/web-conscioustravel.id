import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Press & Media",
  description: "Press inquiries, brand assets, and media kit for Conscious Travel Indonesia.",
};

export default function PressPage() {
  return (
    <LegalPage eyebrow="Media" title="Press & Media" updated="2026-05-23">
      <p>
        Writing about us, planning a feature, or putting together a partnership? Here&apos;s
        everything you need.
      </p>

      <h2>One-line description</h2>
      <p>
        Conscious Travel is an Ubud-based agency curating slow, locally-owned journeys across
        the Indonesian archipelago — wellness retreats, eco expeditions, and community-led
        stays designed for fewer travellers, longer stays, and deeper impact.
      </p>

      <h2>Press contact</h2>
      <p>
        <a href="mailto:press@conscioustravel.id">press@conscioustravel.id</a>
        <br />
        Response within two business days.
      </p>

      <h2>Brand assets</h2>
      <ul>
        <li>
          <a href="/logo.png" download>
            Primary wordmark (PNG)
          </a>
        </li>
        <li>
          <Link href="/sustainability">Sustainability commitments</Link>
        </li>
      </ul>

      <h2>Tone &amp; brand guidelines</h2>
      <p>
        We&apos;re consistently lowercase in product UI (&quot;conscioustravel&quot;), but
        capitalised in editorial contexts (&quot;Conscious Travel&quot;). Our accent colour is
        a deep forest green (#2d5240); our paper colour is a warm cream (#faf7f1).
      </p>

      <h2>Recent coverage</h2>
      <p>Coming soon.</p>
    </LegalPage>
  );
}
