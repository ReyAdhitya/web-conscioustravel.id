import type { Booking } from "@/lib/db/schema";

export function resolveBookingStatus(
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

export function resolvePaymentStatus(transactionStatus: string) {
  if (transactionStatus === "settlement" || transactionStatus === "capture") return "succeeded";
  if (transactionStatus === "pending") return "pending";
  if (transactionStatus === "cancel" || transactionStatus === "expire") return "failed";
  return "failed";
}
