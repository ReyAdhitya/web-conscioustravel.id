import { generateBookingReference } from "@/lib/bookings/reference";

const SAFE_ALPHABET = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/;

describe("generateBookingReference", () => {
  it("returns format CT-YYYY-XXXXX with default prefix", () => {
    const year = new Date().getFullYear();
    const ref = generateBookingReference();
    const pattern = new RegExp(`^CT-${year}-[A-Z2-9]{5}$`);
    expect(ref).toMatch(pattern);
  });

  it("honors a custom prefix like CT-INQ", () => {
    const year = new Date().getFullYear();
    const ref = generateBookingReference("CT-INQ");
    const pattern = new RegExp(`^CT-INQ-${year}-[A-Z2-9]{5}$`);
    expect(ref).toMatch(pattern);
  });

  it("uses only the safe alphabet (no 0, 1, O, I) in the suffix", () => {
    for (let i = 0; i < 200; i++) {
      const ref = generateBookingReference();
      const suffix = ref.split("-").pop() ?? "";
      expect(suffix).toHaveLength(5);
      expect(suffix).toMatch(SAFE_ALPHABET);
      expect(suffix).not.toMatch(/[01OI]/);
    }
  });

  it("produces 100 distinct values when called 100 times", () => {
    const refs = new Set<string>();
    for (let i = 0; i < 100; i++) {
      refs.add(generateBookingReference());
    }
    expect(refs.size).toBe(100);
  });
});
