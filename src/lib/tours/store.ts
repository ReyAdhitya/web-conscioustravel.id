import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { tours, type Tour, type NewTour } from "@/lib/db/schema";

export async function getAllToursAdmin(): Promise<Tour[]> {
  return db.select().from(tours).orderBy(desc(tours.createdAt));
}

export async function getTourById(id: string): Promise<Tour | null> {
  const [found] = await db.select().from(tours).where(eq(tours.id, id)).limit(1);
  return found ?? null;
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const [found] = await db.select().from(tours).where(eq(tours.slug, slug)).limit(1);
  return found ?? null;
}

export async function createTour(data: NewTour): Promise<Tour> {
  const [created] = await db.insert(tours).values(data).returning();
  return created;
}

export async function updateTour(id: string, data: Partial<NewTour>): Promise<Tour> {
  const [updated] = await db
    .update(tours)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tours.id, id))
    .returning();
  return updated;
}

export async function archiveTour(id: string): Promise<Tour> {
  const [updated] = await db
    .update(tours)
    .set({ archivedAt: new Date(), updatedAt: new Date() })
    .where(eq(tours.id, id))
    .returning();
  return updated;
}

export async function restoreTour(id: string): Promise<Tour> {
  const [updated] = await db
    .update(tours)
    .set({ archivedAt: null, updatedAt: new Date() })
    .where(eq(tours.id, id))
    .returning();
  return updated;
}
