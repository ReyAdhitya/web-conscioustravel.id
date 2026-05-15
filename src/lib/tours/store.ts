import { and, asc, desc, eq, gte, isNull, ne } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { departures, tours, type Departure, type Tour } from "@/lib/db/schema";

export async function getAllTours(filters?: {
  category?: Tour["category"];
  kind?: Tour["kind"];
}): Promise<Tour[]> {
  const conditions = [isNull(tours.archivedAt)];
  if (filters?.category) conditions.push(eq(tours.category, filters.category));
  if (filters?.kind) conditions.push(eq(tours.kind, filters.kind));
  return db.select().from(tours).where(and(...conditions));
}

export async function getFeaturedTours(): Promise<Tour[]> {
  return db
    .select()
    .from(tours)
    .where(isNull(tours.archivedAt))
    .orderBy(desc(tours.createdAt))
    .limit(6);
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const [found] = await db.select().from(tours).where(eq(tours.slug, slug)).limit(1);
  return found ?? null;
}

export async function getTourById(id: string): Promise<Tour | null> {
  const [found] = await db.select().from(tours).where(eq(tours.id, id)).limit(1);
  return found ?? null;
}

export async function getTourWithDepartures(
  slug: string,
): Promise<{ tour: Tour; departures: Departure[] } | null> {
  const tour = await getTourBySlug(slug);
  if (!tour) return null;
  const today = new Date().toISOString().split("T")[0];
  const upcomingDepartures = await db
    .select()
    .from(departures)
    .where(
      and(
        eq(departures.tourId, tour.id),
        gte(departures.startsOn, today),
        ne(departures.status, "cancelled"),
      ),
    )
    .orderBy(asc(departures.startsOn));
  return { tour, departures: upcomingDepartures };
}
