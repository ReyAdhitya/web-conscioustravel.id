"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { getTourBySlug } from "@/lib/content/tours";
import { generateBookingReference } from "./reference";
import { createBookingRecord } from "./store";

const checkoutSchema = z.object({
  tourSlug: z.string().min(1, "Tour is required"),
  contactName: z.string().min(2, "Please enter your full name"),
  contactEmail: z.string().email("Please enter a valid email"),
  contactPhone: z.string().min(6, "Please enter a phone number we can reach you on"),
  notes: z.string().max(2000).optional(),
});

export type CheckoutFormState = {
  errors?: Partial<Record<keyof z.infer<typeof checkoutSchema>, string>>;
  message?: string;
};

export async function submitCheckout(
  _prev: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const raw = {
    tourSlug: formData.get("tourSlug")?.toString() ?? "",
    contactName: formData.get("contactName")?.toString() ?? "",
    contactEmail: formData.get("contactEmail")?.toString() ?? "",
    contactPhone: formData.get("contactPhone")?.toString() ?? "",
    notes: formData.get("notes")?.toString() || undefined,
  };

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: CheckoutFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof z.infer<typeof checkoutSchema>;
      errors[field] = issue.message;
    }
    return { errors, message: "Please fix the highlighted fields." };
  }

  const tour = await getTourBySlug(parsed.data.tourSlug);
  if (!tour) {
    return { message: "That journey is no longer available." };
  }

  const reference = generateBookingReference();

  await createBookingRecord({
    id: randomUUID(),
    reference,
    departureId: null, // TODO: assign a real departure once the date picker UI lands
    contactName: parsed.data.contactName,
    contactEmail: parsed.data.contactEmail,
    contactPhone: parsed.data.contactPhone,
    paxCount: 1,
    totalMinor: tour.basePriceMinor,
    currency: tour.baseCurrency,
    status: "pending_payment",
    notes: parsed.data.notes ?? null,
    cancelledAt: null,
    cancellationReason: null,
  });

  redirect(`/bookings/${reference}`);
}
