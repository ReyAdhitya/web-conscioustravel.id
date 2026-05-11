"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { generateBookingReference } from "@/lib/bookings/reference";
import { sendInquiryReceived } from "@/lib/email";
import { createInquiryRecord } from "./store";

const optionalDate = z
  .string()
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

const optionalPositiveInt = z
  .string()
  .optional()
  .transform((v) => {
    if (!v || v.length === 0) return undefined;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
  });

const inquirySchema = z.object({
  contactName: z.string().min(2, "Please enter your full name"),
  contactEmail: z.string().email("Please enter a valid email"),
  contactPhone: z.string().min(6, "Please enter a phone we can reach you on"),
  travelStart: optionalDate,
  travelEnd: optionalDate,
  groupSize: optionalPositiveInt,
  budgetCurrency: z.enum(["IDR", "USD", "EUR"]).optional(),
  budgetMin: optionalPositiveInt,
  budgetMax: optionalPositiveInt,
  interests: z.array(z.string()).max(10),
  destinations: z.array(z.string()).max(20),
  message: z.string().min(20, "Tell us a bit more — at least 20 characters").max(4000),
});

export type InquiryFormState = {
  errors?: Partial<Record<keyof z.infer<typeof inquirySchema>, string>>;
  message?: string;
};

export async function submitInquiry(
  _prev: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const raw = {
    contactName: formData.get("contactName")?.toString() ?? "",
    contactEmail: formData.get("contactEmail")?.toString() ?? "",
    contactPhone: formData.get("contactPhone")?.toString() ?? "",
    travelStart: formData.get("travelStart")?.toString(),
    travelEnd: formData.get("travelEnd")?.toString(),
    groupSize: formData.get("groupSize")?.toString(),
    budgetCurrency: (formData.get("budgetCurrency")?.toString() || undefined) as
      | "IDR"
      | "USD"
      | "EUR"
      | undefined,
    budgetMin: formData.get("budgetMin")?.toString(),
    budgetMax: formData.get("budgetMax")?.toString(),
    interests: formData.getAll("interests").map((v) => v.toString()),
    destinations: formData.getAll("destinations").map((v) => v.toString()),
    message: formData.get("message")?.toString() ?? "",
  };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const errors: InquiryFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof z.infer<typeof inquirySchema>;
      errors[field] = issue.message;
    }
    return { errors, message: "Please fix the highlighted fields." };
  }

  const data = parsed.data;
  const reference = generateBookingReference("CT-INQ");

  await createInquiryRecord({
    id: randomUUID(),
    reference,
    contactName: data.contactName,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    travelStart: data.travelStart ?? null,
    travelEnd: data.travelEnd ?? null,
    groupSize: data.groupSize ?? null,
    budgetMinMinor: data.budgetMin ? BigInt(data.budgetMin) : null,
    budgetMaxMinor: data.budgetMax ? BigInt(data.budgetMax) : null,
    budgetCurrency: data.budgetCurrency ?? null,
    interests: data.interests,
    destinations: data.destinations,
    message: data.message,
    status: "new",
    internalNotes: null,
  });

  try {
    await sendInquiryReceived({
      to: data.contactEmail,
      firstName: data.contactName.split(" ")[0] ?? data.contactName,
      reference,
    });
  } catch (e) {
    console.error("[inquiry] failed to send confirmation email:", e);
  }

  redirect(`/inquiries/${reference}`);
}
