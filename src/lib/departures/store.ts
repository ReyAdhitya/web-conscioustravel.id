import { and, asc, eq, gte, ne } from "drizzle-orm";
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
