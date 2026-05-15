import { desc, eq } from "drizzle-orm";
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

export async function updateBookingStatus(
  id: string,
  status: Booking["status"],
  reason?: string,
): Promise<Booking> {
  const now = new Date();
  const [updated] = await db
    .update(bookings)
    .set({
      status,
      updatedAt: now,
      ...(status === "cancelled"
        ? { cancelledAt: now, cancellationReason: reason ?? null }
        : {}),
    })
    .where(eq(bookings.id, id))
    .returning();
  return updated;
}

export async function getAllBookings(limit = 50): Promise<Booking[]> {
  return db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(limit);
}

export type BookingStats = {
  total: number;
  pending: number;
  confirmed: number;
  totalRevenueByCurrency: Record<string, bigint>;
};

export async function getBookingStats(): Promise<BookingStats> {
  const all = await db.select().from(bookings);
  const stats: BookingStats = {
    total: all.length,
    pending: 0,
    confirmed: 0,
    totalRevenueByCurrency: {},
  };
  for (const b of all) {
    if (b.status === "pending_payment") stats.pending++;
    if (b.status === "confirmed") stats.confirmed++;
    if (!stats.totalRevenueByCurrency[b.currency]) {
      stats.totalRevenueByCurrency[b.currency] = BigInt(0);
    }
    stats.totalRevenueByCurrency[b.currency] += b.totalMinor;
  }
  return stats;
}
