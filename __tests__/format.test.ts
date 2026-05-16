import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("formats IDR with no decimal places and the Rp symbol", () => {
    const formatted = formatPrice(BigInt(12500000), "IDR");
    expect(formatted).toContain("12.500.000");
    expect(formatted).toContain("Rp");
    expect(formatted).not.toMatch(/[.,]\d{2}$/);
  });

  it("formats USD with 2 decimal places and the $ symbol", () => {
    const formatted = formatPrice(BigInt(125000), "USD");
    expect(formatted).toContain("125,000");
    expect(formatted).toContain(".00");
    expect(formatted).toContain("$");
  });

  it("formats EUR with 2 decimal places", () => {
    const formatted = formatPrice(BigInt(125000), "EUR");
    expect(formatted).toContain("125,000");
    expect(formatted).toContain(".00");
  });

  it("falls back to en-US locale for an unknown currency without throwing", () => {
    expect(() => formatPrice(BigInt(1000), "XYZ")).not.toThrow();
    const formatted = formatPrice(BigInt(1000), "XYZ");
    expect(formatted).toContain("1,000");
    expect(formatted).toContain(".00");
  });
});
