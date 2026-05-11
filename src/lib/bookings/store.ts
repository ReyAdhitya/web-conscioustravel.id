import type { Booking } from "@/lib/db/schema";

// TODO: Replace with Drizzle queries against the bookings table once
// DATABASE_URL is wired. Module-level Map is in-memory only (lost on
// dev server restart) — fine for the booking flow demo.
const bookings = new Map<string, Booking>();

export async function createBookingRecord(
  booking: Omit<Booking, "createdAt" | "updatedAt">,
): Promise<Booking> {
  const now = new Date();
  const stored: Booking = { ...booking, createdAt: now, updatedAt: now };
  bookings.set(booking.reference, stored);
  return stored;
}

export async function getBookingByReference(reference: string): Promise<Booking | null> {
  return bookings.get(reference) ?? null;
}
