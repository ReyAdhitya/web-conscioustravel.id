const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateBookingReference(prefix = "CT"): string {
  const year = new Date().getFullYear();
  let suffix = "";
  for (let i = 0; i < 5; i++) {
    suffix += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `${prefix}-${year}-${suffix}`;
}
