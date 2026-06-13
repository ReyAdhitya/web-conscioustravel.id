import Link from "next/link";

/**
 * Floating WhatsApp click-to-chat button. Renders only if
 * NEXT_PUBLIC_WHATSAPP_NUMBER is set (raw international format, e.g. 6281234567890).
 */
export function WhatsAppButton() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!raw) return null;

  const number = raw.replace(/\D/g, "");
  if (!number) return null;

  const greeting = encodeURIComponent(
    "Hi Conscious Travel! I'd like to ask about a journey.",
  );
  const href = `https://wa.me/${number}?text=${greeting}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-5 bottom-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.35)] transition-all hover:scale-105 hover:shadow-[0_14px_36px_rgba(37,211,102,0.5)] sm:right-6 sm:bottom-6 sm:h-[58px] sm:w-[58px]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="h-7 w-7 transition-transform group-hover:rotate-[6deg] sm:h-8 sm:w-8"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.04 22h-.008a9.91 9.91 0 01-5.05-1.382L6.617 20.5l-2.95.768.785-2.87-.183-.296a9.86 9.86 0 01-1.5-5.243C2.769 6.962 6.913 2.81 12.05 2.81c2.495.001 4.842.971 6.604 2.736a9.27 9.27 0 012.736 6.61c-.002 5.385-4.394 9.844-9.349 9.844zm8.413-18.213C18.196 1.523 15.158.25 12.04.25 5.522.25.235 5.526.235 12.05c0 2.084.546 4.118 1.578 5.916L0 24l6.18-1.62A11.81 11.81 0 0012.04 24h.005c6.516 0 11.804-5.275 11.804-11.8 0-3.155-1.227-6.117-3.463-8.353z" />
      </svg>
    </Link>
  );
}
