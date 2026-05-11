import type { Inquiry } from "@/lib/db/schema";

// TODO: Replace with Drizzle queries against the `inquiries` table.
const inquiries = new Map<string, Inquiry>();

export async function createInquiryRecord(
  inquiry: Omit<Inquiry, "createdAt" | "updatedAt">,
): Promise<Inquiry> {
  const now = new Date();
  const stored: Inquiry = { ...inquiry, createdAt: now, updatedAt: now };
  inquiries.set(inquiry.reference, stored);
  return stored;
}

export async function getInquiryByReference(reference: string): Promise<Inquiry | null> {
  return inquiries.get(reference) ?? null;
}
