"use server";

import { z } from "zod";
import { neon } from "@neondatabase/serverless";

const emailSchema = z.string().email("Please enter a valid email address");

export type NewsletterFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function subscribeToNewsletter(
  _prev: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const raw = formData.get("email")?.toString().trim().toLowerCase() ?? "";

  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid email" };
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    // Idempotent: existing email is a no-op
    await sql`
      INSERT INTO newsletter_subscribers (email)
      VALUES (${parsed.data})
      ON CONFLICT (email) DO UPDATE
        SET unsubscribed_at = NULL
    `;
    return { status: "success", message: "You're on the list. See you on Sunday." };
  } catch (e) {
    console.error("[newsletter] subscription failed:", e);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
