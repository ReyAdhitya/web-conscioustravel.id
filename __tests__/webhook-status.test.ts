import { resolveBookingStatus, resolvePaymentStatus } from "@/lib/payments/status";

describe("resolveBookingStatus", () => {
  it("settlement + accept → confirmed", () => {
    expect(resolveBookingStatus("settlement", "accept")).toBe("confirmed");
  });

  it("capture + accept → confirmed", () => {
    expect(resolveBookingStatus("capture", "accept")).toBe("confirmed");
  });

  it("settlement + deny (fraud) → null (not accepted)", () => {
    expect(resolveBookingStatus("settlement", "deny")).toBeNull();
  });

  it("cancel → cancelled", () => {
    expect(resolveBookingStatus("cancel", "accept")).toBe("cancelled");
  });

  it("expire → cancelled", () => {
    expect(resolveBookingStatus("expire", "accept")).toBe("cancelled");
  });

  it("pending → pending_payment", () => {
    expect(resolveBookingStatus("pending", "pending")).toBe("pending_payment");
  });

  it("unknown status → null", () => {
    expect(resolveBookingStatus("refund", "accept")).toBeNull();
    expect(resolveBookingStatus("", "")).toBeNull();
  });
});

describe("resolvePaymentStatus", () => {
  it("settlement → succeeded", () => {
    expect(resolvePaymentStatus("settlement")).toBe("succeeded");
  });

  it("capture → succeeded", () => {
    expect(resolvePaymentStatus("capture")).toBe("succeeded");
  });

  it("pending → pending", () => {
    expect(resolvePaymentStatus("pending")).toBe("pending");
  });

  it("cancel → failed", () => {
    expect(resolvePaymentStatus("cancel")).toBe("failed");
  });

  it("expire → failed", () => {
    expect(resolvePaymentStatus("expire")).toBe("failed");
  });

  it("unknown status → failed (default)", () => {
    expect(resolvePaymentStatus("refund")).toBe("failed");
    expect(resolvePaymentStatus("")).toBe("failed");
  });
});
