import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { payments, type Payment } from "@/lib/db/schema";

export async function createPaymentRecord(
  data: Omit<Payment, "createdAt" | "updatedAt">,
): Promise<Payment> {
  const [created] = await db.insert(payments).values(data).returning();
  return created;
}

export async function getPaymentsByBookingId(bookingId: string): Promise<Payment[]> {
  return db.select().from(payments).where(eq(payments.bookingId, bookingId));
}

export async function getPaymentByGatewayTxnId(
  gateway: Payment["gateway"],
  txnId: string,
): Promise<Payment | null> {
  const [found] = await db
    .select()
    .from(payments)
    .where(and(eq(payments.gateway, gateway), eq(payments.gatewayTransactionId, txnId)))
    .limit(1);
  return found ?? null;
}
