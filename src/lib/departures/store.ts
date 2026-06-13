import { and, asc, eq, gte, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { departures, type Departure, type NewDeparture } from "@/lib/db/schema";

export async function getDeparturesByTourId(tourId: string): Promise<Departure[]> {
  return db
    .select()
    .from(departures)
    .where(eq(departures.tourId, tourId))
    .orderBy(asc(departures.startsOn));
}

export async function getUpcomingDeparturesByTourId(tourId: string): Promise<Departure[]> {
  const today = new Date().toISOString().split("T")[0];
  return db
    .select()
    .from(departures)
    .where(
      and(
        eq(departures.tourId, tourId),
        gte(departures.startsOn, today),
        ne(departures.status, "cancelled"),
      ),
    )
    .orderBy(asc(departures.startsOn));
}

export async function createDeparture(data: NewDeparture): Promise<Departure> {
  const [created] = await db.insert(departures).values(data).returning();
  return created;
}

export async function updateDeparture(
  id: string,
  data: Partial<NewDeparture>,
): Promise<Departure> {
  const [updated] = await db
    .update(departures)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(departures.id, id))
    .returning();
  return updated;
}

export async function deleteDeparture(id: string): Promise<void> {
  await db.delete(departures).where(eq(departures.id, id));
}

export async function getDepartureById(id: string): Promise<Departure | null> {
  const [found] = await db.select().from(departures).where(eq(departures.id, id)).limit(1);
  return found ?? null;
}

export async function incrementDepartureBookedCount(
  departureId: string,
  by = 1,
): Promise<void> {
  await db
    .update(departures)
    .set({
      bookedCount: sql`${departures.bookedCount} + ${by}`,
      updatedAt: sql`now()`,
    })
    .where(eq(departures.id, departureId));
}

export async function getDepartureWithCapacityCheck(
  departureId: string,
  requestedPax: number,
): Promise<Departure> {
  const departure = await getDepartureById(departureId);
  if (!departure) {
    throw new Error(`Departure ${departureId} not found.`);
  }
  if (departure.status !== "open") {
    throw new Error(
      `Departure ${departureId} is not open for booking (status: ${departure.status}).`,
    );
  }
  if (departure.bookedCount + requestedPax > departure.capacity) {
    const remaining = departure.capacity - departure.bookedCount;
    throw new Error(
      `Departure ${departureId} cannot accommodate ${requestedPax} traveler(s); ${remaining} seat(s) remaining.`,
    );
  }
  return departure;
}
