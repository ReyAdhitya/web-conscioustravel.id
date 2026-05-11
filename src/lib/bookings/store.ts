import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { bookings, type Booking } from "@/lib/db/schema";

export async function createBookingRecord(
  booking: Omit<Booking, "createdAt" | "updatedAt">,
): Promise<Booking> {
  const [created] = await db.insert(bookings).values(booking).returning();
  return created;
}

export async function getBookingByReference(reference: string): Promise<Booking | null> {
  const [found] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.reference, reference))
    .limit(1);
  return found ?? null;
}
