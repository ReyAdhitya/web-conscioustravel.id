import { eq } from "drizzle-orm";
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
