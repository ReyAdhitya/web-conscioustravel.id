"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { bookings } from "@/lib/db/schema";
import { createSnapTransaction } from "@/lib/payments/midtrans";

export async function initiatePayment(bookingId: string): Promise<{ token: string }> {
  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking) throw new Error("Booking not found");

  const result = await createSnapTransaction({
    bookingId: booking.id,
    reference: booking.reference,
    amount: Number(booking.totalMinor),
    currency: booking.currency,
    customerName: booking.contactName,
    customerEmail: booking.contactEmail,
    customerPhone: booking.contactPhone,
    itemName: "Conscious Travel Journey",
  });

  return { token: result.token };
}
