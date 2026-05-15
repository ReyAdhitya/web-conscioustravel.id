import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { verifyMidtransSignature } from "@/lib/payments/midtrans";
import { createPaymentRecord } from "@/lib/payments/store";
import { getBookingByReference, updateBookingStatus } from "@/lib/bookings/store";
import type { Booking } from "@/lib/db/schema";

type MidtransWebhookBody = {
  order_id: string;
  transaction_status: string;
  fraud_status: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  payment_type: string;
  transaction_id: string;
};

function resolveBookingStatus(
  transactionStatus: string,
  fraudStatus: string,
): Booking["status"] | null {
  if (
    (transactionStatus === "settlement" || transactionStatus === "capture") &&
    fraudStatus === "accept"
  ) {
    return "confirmed";
  }
  if (transactionStatus === "cancel" || transactionStatus === "expire") {
    return "cancelled";
  }
  if (transactionStatus === "pending") {
    return "pending_payment";
  }
  return null;
}

function resolvePaymentStatus(transactionStatus: string) {
  if (transactionStatus === "settlement" || transactionStatus === "capture") return "succeeded";
  if (transactionStatus === "pending") return "pending";
  if (transactionStatus === "cancel" || transactionStatus === "expire") return "failed";
  return "failed";
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: MidtransWebhookBody;
  try {
    body = (await request.json()) as MidtransWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { order_id, transaction_status, fraud_status, status_code, gross_amount, signature_key, payment_type, transaction_id } = body;

  const valid = verifyMidtransSignature(order_id, status_code, gross_amount, signature_key);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const booking = await getBookingByReference(order_id);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const newBookingStatus = resolveBookingStatus(transaction_status, fraud_status);
  if (newBookingStatus !== null && newBookingStatus !== booking.status) {
    await updateBookingStatus(
      booking.id,
      newBookingStatus,
      newBookingStatus === "cancelled" ? `Midtrans: ${transaction_status}` : undefined,
    );
  }

  await createPaymentRecord({
    id: randomUUID(),
    bookingId: booking.id,
    gateway: "midtrans",
    gatewayTransactionId: transaction_id ?? null,
    amountMinor: BigInt(Math.round(parseFloat(gross_amount))),
    currency: booking.currency,
    status: resolvePaymentStatus(transaction_status),
    rawResponse: body as Record<string, unknown>,
  });

  return NextResponse.json({ ok: true });
}
