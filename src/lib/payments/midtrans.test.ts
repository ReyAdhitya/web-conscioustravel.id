import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { createSnapTransaction, verifyMidtransSignature } from "./midtrans";

const SERVER_KEY = "SB-Mid-server-TEST1234567890abcdef";
const ORIGINAL_KEY = process.env.MIDTRANS_SERVER_KEY;

/** Mirror Midtrans' own signature recipe: sha512(order_id + status_code + gross_amount + server_key). */
function sign(orderId: string, statusCode: string, grossAmount: string, serverKey: string): string {
  return createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");
}

afterEach(() => {
  // Never let one test's env bleed into the next.
  if (ORIGINAL_KEY === undefined) delete process.env.MIDTRANS_SERVER_KEY;
  else process.env.MIDTRANS_SERVER_KEY = ORIGINAL_KEY;
});

describe("verifyMidtransSignature", () => {
  const orderId = "CT-7F3K9Q";
  const statusCode = "200";
  const grossAmount = "12000.00";

  beforeEach(() => {
    process.env.MIDTRANS_SERVER_KEY = SERVER_KEY;
  });

  it("returns true for a known-good signature", () => {
    const signature = sign(orderId, statusCode, grossAmount, SERVER_KEY);
    expect(verifyMidtransSignature(orderId, statusCode, grossAmount, signature)).toBe(true);
  });

  it("returns false when gross_amount is tampered", () => {
    // A genuine signature for 12,000 IDR, replayed against a forged 1 IDR amount.
    const signature = sign(orderId, statusCode, grossAmount, SERVER_KEY);
    expect(verifyMidtransSignature(orderId, statusCode, "1.00", signature)).toBe(false);
  });
});

describe("createSnapTransaction", () => {
  it("throws when MIDTRANS_SERVER_KEY is undefined", async () => {
    delete process.env.MIDTRANS_SERVER_KEY;
    await expect(
      createSnapTransaction({
        bookingId: "11111111-1111-1111-1111-111111111111",
        reference: "CT-7F3K9Q",
        amount: 12000,
        currency: "IDR",
        customerName: "Test Traveller",
        customerEmail: "test@example.com",
        customerPhone: "6280000000000",
        itemName: "Conscious Travel Journey",
      }),
    ).rejects.toThrow("MIDTRANS_SERVER_KEY is not set");
  });
});
