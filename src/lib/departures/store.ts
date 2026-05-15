import { and, asc, eq, gte, ne } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { departures, type Departure } from "@/lib/db/schema";

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
