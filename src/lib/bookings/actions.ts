"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { getTourBySlug } from "@/lib/content/tours";
import { sendBookingConfirmation } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { getDepartureById } from "@/lib/departures/store";
import { generateBookingReference } from "./reference";
import { createBookingRecord } from "./store";

const checkoutSchema = z.object({
  tourSlug: z.string().min(1, "Tour is required"),
  departureId: z.string().optional(),
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
    departureId: formData.get("departureId")?.toString() || undefined,
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

  if (tour.kind === "fixed" && !parsed.data.departureId) {
    return {
      errors: { departureId: "Please choose a departure date." },
      message: "Please fix the highlighted fields.",
    };
  }

  let departureId: string | null = null;
  let totalMinor = tour.basePriceMinor;

  if (parsed.data.departureId) {
    const departure = await getDepartureById(parsed.data.departureId);
    if (!departure) {
      return { errors: { departureId: "That departure is no longer available." }, message: "Please fix the highlighted fields." };
    }
    if (departure.status === "sold_out") {
      return { errors: { departureId: "That departure is sold out." }, message: "Please fix the highlighted fields." };
    }
    departureId = departure.id;
    if (departure.priceOverrideMinor != null) {
      totalMinor = departure.priceOverrideMinor;
    }
  }

  const reference = generateBookingReference();

  await createBookingRecord({
    id: randomUUID(),
    reference,
    departureId,
    contactName: parsed.data.contactName,
    contactEmail: parsed.data.contactEmail,
    contactPhone: parsed.data.contactPhone,
    paxCount: 1,
    totalMinor,
    currency: tour.baseCurrency,
    status: "pending_payment",
    notes: parsed.data.notes ?? null,
    cancelledAt: null,
    cancellationReason: null,
  });

  try {
    await sendBookingConfirmation({
      to: parsed.data.contactEmail,
      firstName: parsed.data.contactName.split(" ")[0] ?? parsed.data.contactName,
      reference,
      tourTitle: tour.title,
      paxCount: 1,
      totalDisplay: formatPrice(totalMinor, tour.baseCurrency),
    });
  } catch (e) {
    console.error("[booking] failed to send confirmation email:", e);
  }

  redirect(`/bookings/${reference}`);
}
