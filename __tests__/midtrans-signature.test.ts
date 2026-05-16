import { createHash } from "node:crypto";
import { verifyMidtransSignature } from "@/lib/payments/midtrans";

const SERVER_KEY = "test-server-key-abc123";

function makeSignature(orderId: string, statusCode: string, grossAmount: string): string {
  return createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${SERVER_KEY}`)
    .digest("hex");
}

describe("verifyMidtransSignature", () => {
  beforeEach(() => {
    process.env.MIDTRANS_SERVER_KEY = SERVER_KEY;
  });

  afterEach(() => {
    delete process.env.MIDTRANS_SERVER_KEY;
  });

  it("returns true for a valid signature", () => {
    const orderId = "CT-2025-AB3XY";
    const statusCode = "200";
    const grossAmount = "5000000.00";
    const sig = makeSignature(orderId, statusCode, grossAmount);

    expect(verifyMidtransSignature(orderId, statusCode, grossAmount, sig)).toBe(true);
  });

  it("returns false when the order_id is tampered", () => {
    const orderId = "CT-2025-AB3XY";
    const statusCode = "200";
    const grossAmount = "5000000.00";
    const sig = makeSignature(orderId, statusCode, grossAmount);

    expect(verifyMidtransSignature("CT-2025-ZZZZZ", statusCode, grossAmount, sig)).toBe(false);
  });

  it("returns false when the gross_amount is tampered", () => {
    const orderId = "CT-2025-AB3XY";
    const statusCode = "200";
    const grossAmount = "5000000.00";
    const sig = makeSignature(orderId, statusCode, grossAmount);

    expect(verifyMidtransSignature(orderId, statusCode, "9999999.00", sig)).toBe(false);
  });

  it("returns false when the status_code is tampered", () => {
    const orderId = "CT-2025-AB3XY";
    const statusCode = "200";
    const grossAmount = "5000000.00";
    const sig = makeSignature(orderId, statusCode, grossAmount);

    expect(verifyMidtransSignature(orderId, "400", grossAmount, sig)).toBe(false);
  });

  it("returns false for a completely wrong signature string", () => {
    expect(
      verifyMidtransSignature("CT-2025-AB3XY", "200", "5000000.00", "not-a-valid-signature"),
    ).toBe(false);
  });

  it("throws when MIDTRANS_SERVER_KEY env var is not set", () => {
    delete process.env.MIDTRANS_SERVER_KEY;
    expect(() =>
      verifyMidtransSignature("CT-2025-AB3XY", "200", "5000000.00", "any"),
    ).toThrow("MIDTRANS_SERVER_KEY is not set");
  });
});
