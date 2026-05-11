import type { Tour } from "@/lib/db/schema";

const mockTours: Tour[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "ubud-seven-day-wellness-retreat",
    title: "Seven-Day Ubud Wellness Retreat",
    kind: "fixed",
    shortDescription:
      "Daily yoga, plant-based cuisine, and forest bathing in a small-group retreat hosted at a Balinese family-run eco-lodge.",
    longDescription:
      "Slow mornings, plant-based meals from the lodge garden, twice-daily yoga led by certified local teachers, and afternoon walks through the rice terraces. Capped at twelve guests.",
    durationDays: 7,
    basePriceMinor: BigInt(12500000),
    baseCurrency: "IDR",
    heroImageUrl: "",
    galleryImageUrls: [],
    inclusions: ["All meals (plant-based)", "Daily yoga + meditation", "Airport transfers", "Local guide"],
    exclusions: ["International flights", "Personal spa treatments"],
    itinerary: [],
    category: "wellness",
    minPax: 1,
    maxPax: 12,
    archivedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    slug: "komodo-flores-conscious-sail",
    title: "Komodo & Flores Conscious Sail",
    kind: "fixed",
    shortDescription:
      "Five-night phinisi sail through the Komodo archipelago with a local-owned operator using reef-safe practices.",
    longDescription:
      "Snorkeling at Manta Point, dragon-spotting on Rinca, sunset on a hidden cove off Padar. Crew is local, no single-use plastic on board, every booking funds reef-restoration in the marine park.",
    durationDays: 6,
    basePriceMinor: BigInt(18000000),
    baseCurrency: "IDR",
    heroImageUrl: "",
    galleryImageUrls: [],
    inclusions: ["Phinisi cabin", "All meals", "Snorkel equipment", "National-park fees", "Local naturalist guide"],
    exclusions: ["Flights to Labuan Bajo", "Diving (PADI guides available on request)"],
    itinerary: [],
    category: "eco",
    minPax: 2,
    maxPax: 14,
    archivedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    slug: "bali-slow-living-stay",
    title: "Bali Slow-Living Stay",
    kind: "open",
    shortDescription:
      "Open-date stay at a hand-built bamboo eco-villa in the Sidemen valley. Book any window from three nights upward.",
    longDescription:
      "Wake to rice-paddy mist, breakfast on the verandah, optional village walks and weaving workshops with neighbours. No itinerary — that's the point.",
    durationDays: 3,
    basePriceMinor: BigInt(4500000),
    baseCurrency: "IDR",
    heroImageUrl: "",
    galleryImageUrls: [],
    inclusions: ["Breakfast", "Welcome dinner", "Village orientation walk"],
    exclusions: ["Other meals", "Activities (priced à la carte)"],
    itinerary: [],
    category: "wellness",
    minPax: 1,
    maxPax: 4,
    archivedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getFeaturedTours(): Promise<Tour[]> {
  return mockTours.filter((t) => !t.archivedAt);
}

type TourFilters = {
  category?: Tour["category"];
  kind?: Tour["kind"];
};

export async function getAllTours(filters: TourFilters = {}): Promise<Tour[]> {
  return mockTours.filter((t) => {
    if (t.archivedAt) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.kind && t.kind !== filters.kind) return false;
    return true;
  });
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  return mockTours.find((t) => t.slug === slug) ?? null;
}
