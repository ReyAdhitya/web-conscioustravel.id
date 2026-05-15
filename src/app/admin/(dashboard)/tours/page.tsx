import Link from "next/link";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import { getAllToursAdmin, archiveTour, restoreTour } from "@/lib/tours/store";
import { formatPrice } from "@/lib/format";
import type { Tour } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Admin · Tours",
  robots: { index: false, follow: false },
};

async function archiveTourAction(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await archiveTour(id);
  revalidatePath("/admin/tours");
}

async function restoreTourAction(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await restoreTour(id);
  revalidatePath("/admin/tours");
}

const kindBadge: Record<Tour["kind"], string> = {
  fixed: "bg-blue-100 text-blue-700",
  open: "bg-purple-100 text-purple-700",
};

const categoryBadge: Record<Tour["category"], string> = {
  wellness: "bg-emerald-100 text-emerald-700",
  eco: "bg-green-100 text-green-700",
  cultural: "bg-amber-100 text-amber-700",
  adventure: "bg-orange-100 text-orange-700",
};

export default async function AdminToursPage() {
  const tours = await getAllToursAdmin();

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10">
      <p className="text-muted-foreground mb-1 text-xs tracking-[0.25em] uppercase">Tours</p>
      <div className="flex items-baseline justify-between">
        <h1 className="font-serif text-3xl tracking-tight">All tours</h1>
        <Link
          href="/admin/tours/new"
          className="bg-foreground text-background rounded-lg px-4 py-2 text-sm transition hover:opacity-80"
        >
          + New tour
        </Link>
      </div>

      <div className="border-border/60 mt-8 overflow-hidden rounded-xl border bg-card">
        {tours.length === 0 ? (
          <p className="text-muted-foreground p-8 text-center text-sm">
            No tours yet. Create one to get started.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border/60 text-muted-foreground border-b text-left text-[11px] tracking-[0.15em] uppercase">
                <th className="px-4 py-3 font-normal">Title</th>
                <th className="px-4 py-3 font-normal">Kind</th>
                <th className="px-4 py-3 font-normal">Category</th>
                <th className="px-4 py-3 font-normal text-right">Duration</th>
                <th className="px-4 py-3 font-normal text-right">Price</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr
                  key={tour.id}
                  className="border-border/40 hover:bg-background/50 border-b last:border-b-0 transition"
                >
                  <td className="px-4 py-3">
                    <span className="text-foreground font-medium">{tour.title}</span>
                    <span className="text-muted-foreground ml-2 font-mono text-xs">{tour.slug}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] tracking-wide ${kindBadge[tour.kind]}`}
                    >
                      {tour.kind}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] tracking-wide ${categoryBadge[tour.category]}`}
                    >
                      {tour.category}
                    </span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-right">
                    {tour.durationDays}d
                  </td>
                  <td className="text-foreground px-4 py-3 text-right">
                    {formatPrice(tour.basePriceMinor, tour.baseCurrency)}
                  </td>
                  <td className="px-4 py-3">
                    {tour.archivedAt ? (
                      <span className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] tracking-wide text-zinc-600">
                        Archived
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] tracking-wide text-emerald-700">
                        Live
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/tours/${tour.id}`}
                        className="text-muted-foreground hover:text-foreground text-xs transition"
                      >
                        Edit
                      </Link>
                      {tour.archivedAt ? (
                        <form action={restoreTourAction}>
                          <input type="hidden" name="id" value={tour.id} />
                          <button
                            type="submit"
                            className="text-muted-foreground hover:text-foreground text-xs transition"
                          >
                            Restore
                          </button>
                        </form>
                      ) : (
                        <form action={archiveTourAction}>
                          <input type="hidden" name="id" value={tour.id} />
                          <button
                            type="submit"
                            className="text-xs text-red-500 hover:text-red-700 transition"
                          >
                            Archive
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
