import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import { getTourById, updateTour } from "@/lib/tours/store";
import { getDeparturesByTourId, createDeparture, deleteDeparture } from "@/lib/departures/store";
import { formatPrice } from "@/lib/format";
import { TourFormFields } from "../new/page";
import type { Departure } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Admin · Edit Tour",
  robots: { index: false, follow: false },
};

const statusBadge: Record<Departure["status"], string> = {
  open: "bg-emerald-100 text-emerald-700",
  sold_out: "bg-amber-100 text-amber-700",
  cancelled: "bg-zinc-100 text-zinc-600",
};

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tour, departures] = await Promise.all([
    getTourById(id),
    getDeparturesByTourId(id),
  ]);

  if (!tour) notFound();

  async function updateTourAction(formData: FormData) {
    "use server";

    let slug = (formData.get("slug") as string).trim();
    const title = formData.get("title") as string;
    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const inclusionsRaw = (formData.get("inclusions") as string) ?? "";
    const exclusionsRaw = (formData.get("exclusions") as string) ?? "";
    const inclusions = inclusionsRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const exclusions = exclusionsRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    await updateTour(id, {
      title,
      slug,
      kind: formData.get("kind") as "fixed" | "open",
      category: formData.get("category") as "wellness" | "eco" | "cultural" | "adventure",
      shortDescription: formData.get("shortDescription") as string,
      longDescription: formData.get("longDescription") as string,
      durationDays: parseInt(formData.get("durationDays") as string, 10),
      basePriceMinor: BigInt(formData.get("basePriceMinor") as string),
      baseCurrency: "IDR",
      heroImageUrl: formData.get("heroImageUrl") as string,
      minPax: parseInt(formData.get("minPax") as string, 10),
      maxPax: parseInt(formData.get("maxPax") as string, 10),
      inclusions,
      exclusions,
    });

    revalidatePath("/admin/tours");
  }

  async function addDepartureAction(formData: FormData) {
    "use server";

    const priceOverrideRaw = (formData.get("priceOverrideMinor") as string).trim();

    await createDeparture({
      tourId: id,
      startsOn: formData.get("startsOn") as string,
      endsOn: formData.get("endsOn") as string,
      capacity: parseInt(formData.get("capacity") as string, 10),
      priceOverrideMinor: priceOverrideRaw ? BigInt(priceOverrideRaw) : null,
      status: formData.get("status") as "open" | "sold_out" | "cancelled",
    });

    revalidatePath("/admin/tours");
  }

  async function removeDepartureAction(formData: FormData) {
    "use server";
    const departureId = formData.get("id") as string;
    await deleteDeparture(departureId);
    revalidatePath("/admin/tours");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10">
      <p className="text-muted-foreground mb-1 text-xs tracking-[0.25em] uppercase">Tours</p>
      <h1 className="font-serif text-3xl tracking-tight">{tour.title}</h1>

      <section className="mt-10">
        <h2 className="font-serif text-xl tracking-tight mb-5">Edit tour</h2>
        <form action={updateTourAction}>
          <TourFormFields
            defaults={{
              title: tour.title,
              slug: tour.slug,
              kind: tour.kind,
              category: tour.category,
              shortDescription: tour.shortDescription,
              longDescription: tour.longDescription,
              durationDays: tour.durationDays,
              basePriceMinor: tour.basePriceMinor,
              heroImageUrl: tour.heroImageUrl,
              minPax: tour.minPax,
              maxPax: tour.maxPax,
              inclusions: tour.inclusions,
              exclusions: tour.exclusions,
            }}
          />
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="bg-foreground text-background rounded-lg px-6 py-2.5 text-sm transition hover:opacity-80"
            >
              Save changes
            </button>
          </div>
        </form>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-xl tracking-tight mb-5">Departures</h2>

        <div className="border-border/60 bg-card rounded-xl border overflow-hidden">
          {departures.length === 0 ? (
            <p className="text-muted-foreground p-8 text-center text-sm">
              No departures yet. Add one below.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border/60 text-muted-foreground border-b text-left text-[11px] tracking-[0.15em] uppercase">
                  <th className="px-4 py-3 font-normal">Starts</th>
                  <th className="px-4 py-3 font-normal">Ends</th>
                  <th className="px-4 py-3 font-normal text-right">Capacity</th>
                  <th className="px-4 py-3 font-normal text-right">Booked</th>
                  <th className="px-4 py-3 font-normal text-right">Price override</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal text-right">Delete</th>
                </tr>
              </thead>
              <tbody>
                {departures.map((dep) => (
                  <tr
                    key={dep.id}
                    className="border-border/40 hover:bg-background/50 border-b last:border-b-0 transition"
                  >
                    <td className="text-foreground px-4 py-3">{dep.startsOn}</td>
                    <td className="text-muted-foreground px-4 py-3">{dep.endsOn}</td>
                    <td className="text-foreground px-4 py-3 text-right">{dep.capacity}</td>
                    <td className="text-muted-foreground px-4 py-3 text-right">{dep.bookedCount}</td>
                    <td className="text-muted-foreground px-4 py-3 text-right">
                      {dep.priceOverrideMinor != null
                        ? formatPrice(dep.priceOverrideMinor, "IDR")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] tracking-wide ${statusBadge[dep.status]}`}
                      >
                        {dep.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <form action={removeDepartureAction}>
                        <input type="hidden" name="id" value={dep.id} />
                        <button
                          type="submit"
                          className="text-xs text-red-500 hover:text-red-700 transition"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="border-border/60 bg-card mt-6 rounded-xl border p-6">
          <p className="text-muted-foreground mb-4 text-xs tracking-[0.25em] uppercase">
            + Add departure
          </p>
          <form action={addDepartureAction}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
                  Start date
                </label>
                <input
                  type="date"
                  name="startsOn"
                  required
                  className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
                  End date
                </label>
                <input
                  type="date"
                  name="endsOn"
                  required
                  className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  required
                  min={1}
                  className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
                  Price override (IDR, minor units — e.g. 12500000 = Rp 125.000)
                </label>
                <input
                  type="number"
                  name="priceOverrideMinor"
                  min={0}
                  className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
                  Status
                </label>
                <select
                  name="status"
                  required
                  defaultValue="open"
                  className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  <option value="open">Open</option>
                  <option value="sold_out">Sold out</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                className="bg-foreground text-background rounded-lg px-5 py-2 text-sm transition hover:opacity-80"
              >
                Add departure
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
