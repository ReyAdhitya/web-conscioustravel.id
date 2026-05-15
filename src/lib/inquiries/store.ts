import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { inquiries, type Inquiry } from "@/lib/db/schema";

export async function createInquiryRecord(
  inquiry: Omit<Inquiry, "createdAt" | "updatedAt">,
): Promise<Inquiry> {
  const [created] = await db.insert(inquiries).values(inquiry).returning();
  return created;
}

export async function getInquiryByReference(reference: string): Promise<Inquiry | null> {
  const [found] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.reference, reference))
    .limit(1);
  return found ?? null;
}

export async function getInquiryById(id: string): Promise<Inquiry | null> {
  const [found] = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
  return found ?? null;
}

export async function getAllInquiries(limit = 50): Promise<Inquiry[]> {
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(limit);
}

export async function updateInquiryStatus(id: string, status: Inquiry["status"]): Promise<Inquiry> {
  const [updated] = await db
    .update(inquiries)
    .set({ status, updatedAt: sql`now()` })
    .where(eq(inquiries.id, id))
    .returning();
  return updated;
}

export async function updateInquiryNotes(id: string, internalNotes: string): Promise<Inquiry> {
  const [updated] = await db
    .update(inquiries)
    .set({ internalNotes, updatedAt: sql`now()` })
    .where(eq(inquiries.id, id))
    .returning();
  return updated;
}

export type InquiryStats = {
  total: number;
  newCount: number;
  inProgress: number;
};

export async function getInquiryStats(): Promise<InquiryStats> {
  const all = await db.select().from(inquiries);
  return {
    total: all.length,
    newCount: all.filter((i) => i.status === "new").length,
    inProgress: all.filter((i) => i.status === "in_progress").length,
  };
}
