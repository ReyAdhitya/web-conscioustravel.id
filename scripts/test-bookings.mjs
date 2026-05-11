import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

const { createBookingRecord, getBookingByReference } = await import(
  "../src/lib/bookings/store.ts"
);
const { generateBookingReference } = await import("../src/lib/bookings/reference.ts");
const { randomUUID } = await import("node:crypto");

const reference = generateBookingReference();

console.log("Creating booking with reference:", reference);

const created = await createBookingRecord({
  id: randomUUID(),
  reference,
  departureId: null,
  contactName: "DB Smoke Test",
  contactEmail: "smoke@conscioustravel.id",
  contactPhone: "+62 800 0000 0000",
  paxCount: 1,
  totalMinor: BigInt(12500000),
  currency: "IDR",
  status: "pending_payment",
  notes: "automated check",
  cancelledAt: null,
  cancellationReason: null,
});
console.log("✅ Created. Returned id:", created.id);

const fetched = await getBookingByReference(reference);
console.log("✅ Fetched back:");
console.log("  reference:", fetched?.reference);
console.log("  contactName:", fetched?.contactName);
console.log("  totalMinor:", fetched?.totalMinor?.toString());
console.log("  status:", fetched?.status);

if (fetched?.reference !== reference) {
  console.error("❌ Round-trip mismatch");
  process.exit(1);
}
console.log("\n✅ Persistence working end-to-end.");
