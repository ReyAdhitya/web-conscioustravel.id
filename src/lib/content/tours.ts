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
      "Slow mornings, plant-based meals from the lodge garden, twice-daily yoga led by certified local teachers, and afternoon walks through the rice terraces. Capped at twelve guests so you actually meet the people you travel with — and the people who host you.",
    durationDays: 7,
    basePriceMinor: BigInt(12500000),
    baseCurrency: "IDR",
    heroImageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1800&auto=format&q=80&fit=crop",
    galleryImageUrls: [],
    inclusions: ["All meals (plant-based)", "Daily yoga + meditation", "Airport transfers", "Local guide"],
    exclusions: ["International flights", "Personal spa treatments"],
    itinerary: [
      { day: 1, title: "Arrival in Ubud", description: "Welcome dinner and grounding meditation at the lodge." },
      { day: 2, title: "Rice-paddy yoga", description: "Sunrise practice, breakfast in the garden, afternoon walk through Tegallalang." },
      { day: 3, title: "Forest bathing", description: "Guided shinrin-yoku in the Sangeh sacred monkey forest." },
      { day: 4, title: "Cooking with the lodge family", description: "Half-day Balinese plant-based cooking class led by host Ibu Wayan." },
      { day: 5, title: "Free day", description: "Optional spa, temple visit, or stay quiet at the lodge." },
      { day: 6, title: "Sunrise hike, Mount Batur foothills", description: "Easy trek with a local naturalist, breakfast on the ridge." },
      { day: 7, title: "Closing circle and departure", description: "Morning meditation, brunch, transfer to airport." },
    ],
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
    heroImageUrl:
      "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=1800&auto=format&q=80&fit=crop",
    galleryImageUrls: [],
    inclusions: ["Phinisi cabin", "All meals", "Snorkel equipment", "National-park fees", "Local naturalist guide"],
    exclusions: ["Flights to Labuan Bajo", "Diving (PADI guides available on request)"],
    itinerary: [
      { day: 1, title: "Embark in Labuan Bajo", description: "Board the phinisi by mid-afternoon, shake-down sail to Kelor Island for the first sunset." },
      { day: 2, title: "Rinca dragons", description: "Guided ranger walk to spot Komodo dragons in their quieter island habitat." },
      { day: 3, title: "Manta Point + Pink Beach", description: "Snorkel with manta rays at Karang Makassar, beach time on Pantai Merah." },
      { day: 4, title: "Padar Island sunrise", description: "Pre-dawn climb to the iconic three-bay viewpoint, then sail to Kanawa." },
      { day: 5, title: "Reef restoration visit", description: "Stop at the reef-restoration project this trip funds; optional dive or snorkel briefing." },
      { day: 6, title: "Return to Labuan Bajo", description: "Slow morning sail, brunch, disembark by midday." },
    ],
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
      "Wake to rice-paddy mist, breakfast on the verandah, optional village walks and weaving workshops with neighbours. No itinerary — that's the point. Book any window from three nights upward; the host family will be ready when you arrive.",
    durationDays: 3,
    basePriceMinor: BigInt(4500000),
    baseCurrency: "IDR",
    heroImageUrl:
      "https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?w=1800&auto=format&q=80&fit=crop",
    galleryImageUrls: [],
    inclusions: ["Breakfast", "Welcome dinner", "Village orientation walk"],
    exclusions: ["Other meals", "Activities (priced à la carte)"],
    itinerary: [
      { day: 1, title: "Arrive when you arrive", description: "Pickup from Denpasar or Ubud. Verandah tea on arrival, welcome dinner with the host family." },
      { day: 2, title: "Find your rhythm", description: "Optional village walk, weaving workshop, or simply sit. The pace is yours." },
      { day: 3, title: "Stay or extend", description: "Many guests extend. Speak with the host the night before to flex your departure." },
    ],
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
