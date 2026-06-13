"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { getTourBySlug } from "@/lib/content/tours";
import { sendBookingConfirmation } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { getDepartureWithCapacityCheck } from "@/lib/departures/store";
import { generateBookingReference } from "./reference";
import { appendBookingNotes, createBookingRecord } from "./store";

const optionalIsoDate = z
  .union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date"),
    z.literal(""),
  ])
  .optional()
  .transform((v) => (v ? v : undefined));

const checkoutSchema = z.object({
  tourSlug: z.string().min(1, "Tour is required"),
  departureId: z.string().optional(),
  contactName: z.string().min(2, "Please enter your full name"),
  contactEmail: z.string().email("Please enter a valid email"),
  contactPhone: z.string().min(6, "Please enter a phone number we can reach you on"),
  paxCount: z.coerce.number().int().min(1).max(20),
  arrivalDate: optionalIsoDate,
  departureDate: optionalIsoDate,
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
    paxCount: formData.get("paxCount")?.toString() ?? "1",
    arrivalDate: formData.get("arrivalDate")?.toString() || undefined,
    departureDate: formData.get("departureDate")?.toString() || undefined,
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
    try {
      const departure = await getDepartureWithCapacityCheck(
        parsed.data.departureId,
        parsed.data.paxCount,
      );
      departureId = departure.id;
      if (departure.priceOverrideMinor != null) {
        totalMinor = departure.priceOverrideMinor;
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "That departure is no longer available.";
      return {
        errors: { departureId: message },
        message: "Please fix the highlighted fields.",
      };
    }
  }

  totalMinor = totalMinor * BigInt(parsed.data.paxCount);

  const noteParts: string[] = [];
  if (parsed.data.arrivalDate) noteParts.push(`Arrival: ${parsed.data.arrivalDate}`);
  if (parsed.data.departureDate) noteParts.push(`Departure: ${parsed.data.departureDate}`);
  if (parsed.data.notes) noteParts.push(parsed.data.notes);
  const composedNotes = noteParts.length > 0 ? noteParts.join(" | ") : null;

  const reference = generateBookingReference();
  const bookingId = randomUUID();

  await createBookingRecord({
    id: bookingId,
    reference,
    departureId,
    contactName: parsed.data.contactName,
    contactEmail: parsed.data.contactEmail,
    contactPhone: parsed.data.contactPhone,
    paxCount: parsed.data.paxCount,
    totalMinor,
    currency: tour.baseCurrency,
    status: "pending_payment",
    notes: composedNotes,
    cancelledAt: null,
    cancellationReason: null,
  });

  try {
    await sendBookingConfirmation({
      to: parsed.data.contactEmail,
      firstName: parsed.data.contactName.split(" ")[0] ?? parsed.data.contactName,
      reference,
      tourTitle: tour.title,
      paxCount: parsed.data.paxCount,
      totalDisplay: formatPrice(totalMinor, tour.baseCurrency),
    });
  } catch (e) {
    console.error("[booking] failed to send confirmation email:", e);
    const message = e instanceof Error ? e.message : String(e);
    try {
      await appendBookingNotes(bookingId, `[EMAIL_FAILED: ${message}]`);
    } catch (noteErr) {
      console.error("[booking] failed to record email failure note:", noteErr);
    }
  }

  redirect(`/bookings/${reference}`);
}
