import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const key = process.env.RESEND_API_KEY;
console.log("RESEND_API_KEY set:", !!key);
console.log("Key length:", key?.length ?? 0);
console.log("Starts with 're_':", key?.startsWith("re_"));

if (!key) {
  console.error("\n❌ RESEND_API_KEY missing. Add it to .env.local.");
  process.exit(1);
}

console.log("\n✅ Resend key looks present. Ready to send.");
