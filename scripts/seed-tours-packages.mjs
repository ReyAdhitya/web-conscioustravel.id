// Seeds the owner's real tour packages (parsed from the proposal PDFs).
// Idempotent: skips any tour whose slug already exists. Fixed tours get their
// real published departures; open/group/corporate tours get none (they book via
// inquiry/checkout without scheduled dates). Hero images are intentionally empty
// so SafeImage renders the brand placeholder until the owner uploads real photos.
//
// Run:  node scripts/seed-tours-packages.mjs
import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const tours = [
  {
    slug: "hanoi-halong-sapa",
    title: "Hanoi · Halong Bay · Sapa",
    // Open (bookable on request): the proposal's published dates (May/Jun 2026)
    // have passed. The owner can add real future departures in admin and flip to
    // "fixed" when scheduled.
    kind: "open",
    shortDescription:
      "Five slow days through northern Vietnam — the Old Quarter of Hanoi, a cruise among Halong Bay's limestone karsts, and the terraced hills and hill-tribe villages of Sapa.",
    longDescription:
      "A small-group, slow-travel journey through the north of Vietnam, where every moment is meant to be felt rather than rushed past. You'll wander Hanoi's Old Quarter and its street-food lanes, cruise Halong Bay's limestone karsts, ride the local overnight sleeper bus up to Sapa, and walk into Cat Cat Village for a closer look at hill-tribe life — with the option to reach the 'roof of Indochina' at Fansipan. Tiered per-person pricing by group size: private (0–2 pax) IDR 9.5–10.5M, small group (3–6) IDR 7.5–8.5M, medium (7–10) IDR 6.5–6.9M, and group (>10) from IDR 5.9M.",
    durationDays: 5,
    basePriceMinor: 5900000,
    baseCurrency: "IDR",
    heroImageUrl: "",
    galleryImageUrls: [],
    inclusions: [
      "Hotel accommodation (twin sharing)",
      "Daily breakfast",
      "Local transport and overnight sleeper bus",
      "Halong Bay cruise with lunch",
      "Local guide and trip documentation",
      "Sustainable souvenir",
    ],
    exclusions: ["International flights", "Fansipan cable-car ticket", "Travel insurance and taxes"],
    itinerary: [
      { day: 1, title: "Arrival in Hanoi", description: "Settle in and explore the Old Quarter and its street food on foot." },
      { day: 2, title: "Halong Bay", description: "Cruise among the limestone karsts of Halong Bay, then board the overnight sleeper bus to Sapa." },
      { day: 3, title: "Sapa: nature & local life", description: "Cat Cat Village and the terraced hills, with an optional ascent of Fansipan." },
      { day: 4, title: "Hanoi culture", description: "Vietnamese egg coffee and a walking tour through the city's quieter corners." },
      { day: 5, title: "Departure", description: "Free time before your return flight home." },
    ],
    category: "cultural",
    minPax: 2,
    maxPax: 16,
  },
  {
    slug: "thailand-healing-escape",
    title: "Thailand · Healing Escape",
    kind: "open",
    shortDescription:
      "Five days from Chiang Mai to Bangkok built for renewal — morning meditation and breathwork, an ethical elephant sanctuary, hidden Bangkok, and a river-cruise celebration of a new beginning.",
    longDescription:
      "A healing journey rather than a holiday, shaped for anyone who wants to give themselves room to slow down and reconnect. You'll begin in Chiang Mai with meditation, breathwork and gentle temple days, choose between a mindful retreat morning or an ethical (no-riding) elephant sanctuary, then fly to Bangkok for its hidden side — Talad Noi street art, a Michelin Bib Gourmand lunch, a restorative Thai massage, and a celebratory dinner cruise along the Chao Phraya. Kept intentionally small (2–6 guests) for a supportive, intimate pace.",
    durationDays: 5,
    basePriceMinor: 12500000,
    baseCurrency: "IDR",
    heroImageUrl: "",
    galleryImageUrls: [],
    inclusions: [
      "4 nights in 4-star hotels",
      "Private transport with driver",
      "Retreat or ethical sanctuary visit, plus Thai massage",
      "Chao Phraya dinner cruise with celebration setup",
      "Meals and entrance tickets per itinerary",
      "Local guide and trip documentation",
    ],
    exclusions: ["International and domestic flights", "Travel insurance", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Slow arrival in Chiang Mai", description: "Settle into the Old City, a Khao Soi lunch, and gentle temple hopping." },
      { day: 2, title: "Retreat or elephant sanctuary", description: "Morning meditation and breathwork, or an ethical no-riding elephant day; evening at the night market." },
      { day: 3, title: "Culture, nature & fly to Bangkok", description: "Wat Phra That Doi Suthep and a lakeside lunch, then an evening flight and seafood dinner in Bangkok." },
      { day: 4, title: "Hidden Bangkok & celebration", description: "Talad Noi street art, the creative Charoenkrung district, a Thai massage, and a birthday dinner cruise on the Chao Phraya." },
      { day: 5, title: "Farewell Bangkok", description: "A free morning before your airport transfer and return to Jakarta." },
    ],
    category: "wellness",
    minPax: 2,
    maxPax: 6,
  },
  {
    slug: "japan-discovery",
    title: "Japan · Tokyo, Kyoto & Osaka",
    kind: "open",
    shortDescription:
      "Five days across Tokyo, Kyoto and Osaka by Shinkansen — Mt Fuji, a Kyoto kimono experience, the lights of Dotonbori, and Universal Studios. Free-and-easy or fully private.",
    longDescription:
      "An authentic mid-market journey through Japan's three great cities. Explore Tokyo's Shibuya and Shinjuku and take a day tour to Mt Fuji, ride the Shinkansen to Kyoto for a kimono experience in historic Gion, then finish in Osaka with Dotonbori and Universal Studios. Two ways to travel: the Free & Easy package on Japan's efficient rail (from IDR 26–30M per person) or the Private Road Trip with car and driver (IDR 38–52M per person). December and January are the loveliest — winter illuminations and clear Mt Fuji views.",
    durationDays: 5,
    basePriceMinor: 26000000,
    baseCurrency: "IDR",
    heroImageUrl: "",
    galleryImageUrls: [],
    inclusions: [
      "Return Jakarta–Tokyo flights",
      "Hotel (3-star or local house) with breakfast",
      "Shinkansen Tokyo–Kyoto",
      "Mt Fuji day tour",
      "Kyoto kimono experience",
      "Universal Studios Japan ticket",
      "Tour leader support",
    ],
    exclusions: ["Japan visa", "Travel insurance", "Personal expenses and shopping"],
    itinerary: [
      { day: 1, title: "Tokyo", description: "Arrival, then Shibuya, Ginza and Shinjuku." },
      { day: 2, title: "Tokyo & Mt Fuji", description: "A day tour to Mt Fuji and the city's iconic spots." },
      { day: 3, title: "Kyoto", description: "Shinkansen to Kyoto, a kimono experience, and the lanes of Gion." },
      { day: 4, title: "Osaka", description: "Dotonbori's neon streets and a day at Universal Studios." },
      { day: 5, title: "Departure", description: "Osaka city time and shopping before your flight home." },
    ],
    category: "cultural",
    minPax: 2,
    maxPax: 12,
  },
  {
    slug: "japan-group-journey",
    title: "Japan · Group Journey",
    kind: "open",
    shortDescription:
      "A seven-day land journey for groups — Tokyo, Mt Fuji and a traditional onsen, Fushimi Inari and Kyoto's temples, and Osaka — travelling by private coach and Shinkansen.",
    longDescription:
      "A seven-day, five-night land journey designed for groups of thirty or more, with a mindful, conscious-travel approach throughout. From Tokyo Tower and Asakusa to the calm of a traditional onsen near Mt Fuji, the thousand torii gates of Fushimi Inari, Kyoto's Kiyomizu-dera and Arashiyama bamboo forest, and Osaka's castle and Dotonbori — all by private coach and the Shinkansen, guided in Indonesian. Land tour only (international flights excluded); 2.5% of profit is donated to those in need. From IDR 19,500,000 per person, minimum 30 travellers.",
    durationDays: 7,
    basePriceMinor: 19500000,
    baseCurrency: "IDR",
    heroImageUrl: "",
    galleryImageUrls: [],
    inclusions: [
      "5 nights hotel (twin sharing)",
      "Private coach / Hiace transport",
      "Shinkansen ticket",
      "Meals per itinerary",
      "Indonesian-speaking tour guide",
      "Entrance fees",
      "One bottle of water per day",
      "Trip documentation",
    ],
    exclusions: [
      "International flights (land tour only)",
      "Japan visa",
      "Travel insurance",
      "Personal expenses",
      "Optional tours",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Tokyo", description: "Meet and greet with the local guide, a Tokyo Tower photo stop, and hotel check-in." },
      { day: 2, title: "Tokyo city tour", description: "Asakusa Temple and Nakamise Street, Shibuya Crossing, and futuristic Odaiba." },
      { day: 3, title: "Mt Fuji & onsen", description: "Kawaguchiko and Fuji views, then a traditional Japanese onsen to unwind." },
      { day: 4, title: "Fuji to Kyoto by Shinkansen", description: "The bullet train to Kyoto and an evening in the historic Gion district." },
      { day: 5, title: "Kyoto cultural day", description: "Fushimi Inari Taisha, Kiyomizu-dera, and the Arashiyama bamboo forest." },
      { day: 6, title: "Osaka", description: "Osaka Castle and Dotonbori, then transfer toward departure." },
      { day: 7, title: "Departure", description: "Return flight to Jakarta with a week of memories." },
    ],
    category: "cultural",
    minPax: 30,
    maxPax: 40,
  },
  {
    slug: "bali-group-experience",
    title: "Bali · Group Experience",
    kind: "open",
    shortDescription:
      "Three days of Bali's icons for groups — Uluwatu's clifftop temple and Kecak at sunset, a Kintamani jeep adventure with hot springs and Luwak coffee, and Jimbaran seafood by the sea.",
    longDescription:
      "A culture-and-nature group journey built for comfort and connection, ideal for company outings and larger travelling parties. Watch the Kecak fire dance at the clifftop Uluwatu Temple as the sun sets, dine on seafood with your feet in the sand at Jimbaran, ride a jeep across Mount Batur's lava fields to a hot-spring lunch, taste Luwak coffee at a highland plantation, and shop the art markets before departure. Stays at the Fairfield by Marriott or Ramada; 2.5% of profit is donated to those in need. IDR 1,850,000 per person, minimum 50 travellers.",
    durationDays: 3,
    basePriceMinor: 1850000,
    baseCurrency: "IDR",
    heroImageUrl: "",
    galleryImageUrls: [],
    inclusions: [
      "2 nights hotel (twin sharing, Fairfield or Ramada)",
      "Private coach and professional guide",
      "Breakfast, lunch and dinner per itinerary",
      "Jimbaran seafood dinner",
      "Kintamani jeep tour and Batur hot spring",
      "Luwak coffee tasting",
      "Uluwatu temple entrance and Kecak dance",
      "Drone photo and documentation",
    ],
    exclusions: ["Flights", "Travel insurance", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Uluwatu & Jimbaran", description: "The clifftop Uluwatu Temple and Kecak fire dance at sunset, then a seafood dinner on Jimbaran beach." },
      { day: 2, title: "Kintamani", description: "A jeep tour over Batur's lava fields, a hot-spring lunch, the Tegalalang rice terrace, and Luwak coffee." },
      { day: 3, title: "Markets & departure", description: "Souvenir shopping at Krisna and the Kuta Art Market before your airport transfer." },
    ],
    category: "cultural",
    minPax: 20,
    maxPax: 50,
  },
  {
    slug: "corporate-outing-csr-bali",
    title: "Corporate Outing & CSR · Bali",
    kind: "open",
    shortDescription:
      "A one-day Bali team-building outing built around connection and impact — collaborative games, live music and a Nusantara feast, paired with a hands-on CSR activity for a local community.",
    longDescription:
      "A corporate outing designed to strengthen teams and give back at the same time. Choose three activities from a full team-building menu, play through fun games and award nominations, enjoy two hours of live music blending Western and Indonesian favourites, and share a Nusantara buffet with Balinese specialities — all captured by a professional photo and video team with drone coverage and a custom backdrop. Every outing pairs with a dedicated CSR activity that gives back to a local Balinese community. Trusted by teams including DBS, Bank Indonesia, PT Gesit and Lazada. Indicative group package from IDR 70,000,000 for around 170 participants; scaled to your group on request.",
    durationDays: 1,
    basePriceMinor: 410000,
    baseCurrency: "IDR",
    heroImageUrl: "",
    galleryImageUrls: [],
    inclusions: [
      "Venue, permits and full event management",
      "Team-building activities (choose three)",
      "Catering, snacks and a Nusantara buffet",
      "Two hours of live music and sound system",
      "Professional photo, video and drone documentation",
      "Custom event backdrop and decoration",
      "Dedicated CSR activity with a local community",
    ],
    exclusions: ["Flights and accommodation (arranged on request)", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Outing & CSR day", description: "Arrival and welcome, team-building activities and games, a Nusantara feast with live music, and a dedicated CSR activity giving back to a local Balinese community." },
    ],
    category: "adventure",
    minPax: 20,
    maxPax: 200,
  },
  {
    slug: "financial-literacy-csr-experience",
    title: "Financial Literacy CSR Experience",
    kind: "open",
    shortDescription:
      "A one-day corporate CSR journey from Jakarta to Bandung — your team delivers hands-on financial education to students through games, life simulations and a shared, reflective day.",
    longDescription:
      "A meaningful one-day corporate CSR experience that takes your team from Jakarta to a partner school in Bandung to deliver practical financial education to young students. The day runs as a full programme — an interactive bus session, core financial-literacy workshops and life-simulation games with students, a sharing session and networking lunch with West Java cultural performances, and a closing impact reflection on the journey home. Conscious Travel provides the complete concept, professional team and MC, transport, materials and sustainable goodie bags. IDR 1,000,000 per person, all-inclusive, minimum 50 participants.",
    durationDays: 1,
    basePriceMinor: 1000000,
    baseCurrency: "IDR",
    heroImageUrl: "",
    galleryImageUrls: [],
    inclusions: [
      "Round-trip AC bus, Jakarta–Bandung",
      "Full programme concept, professional team and MC",
      "Financial-literacy workshops and life-simulation games",
      "Networking lunch with cultural performance",
      "Sustainable goodie bags and activity kits",
      "Professional photo and video documentation",
    ],
    exclusions: ["Personal expenses"],
    itinerary: [
      { day: 1, title: "Jakarta to Bandung CSR day", description: "An interactive bus session en route, core financial-literacy workshops and life-simulation games with students, a sharing session and networking lunch with West Java cultural performances, and a reflective return journey to Jakarta." },
    ],
    category: "cultural",
    minPax: 30,
    maxPax: 60,
  },
];

for (const tour of tours) {
  const existing = await sql`SELECT id FROM tours WHERE slug = ${tour.slug}`;
  if (existing.length > 0) {
    console.log(`skip (exists): ${tour.slug}`);
    continue;
  }
  const [created] = await sql`
    INSERT INTO tours (slug, title, kind, short_description, long_description, duration_days, base_price_minor, base_currency, hero_image_url, gallery_image_urls, inclusions, exclusions, itinerary, category, min_pax, max_pax)
    VALUES (${tour.slug}, ${tour.title}, ${tour.kind}, ${tour.shortDescription}, ${tour.longDescription}, ${tour.durationDays}, ${tour.basePriceMinor}, ${tour.baseCurrency}, ${tour.heroImageUrl}, ${JSON.stringify(tour.galleryImageUrls)}, ${JSON.stringify(tour.inclusions)}, ${JSON.stringify(tour.exclusions)}, ${JSON.stringify(tour.itinerary)}, ${tour.category}, ${tour.minPax}, ${tour.maxPax})
    RETURNING id
  `;
  console.log(`created: ${tour.slug}`);

  for (const dep of tour.departures ?? []) {
    await sql`
      INSERT INTO departures (tour_id, starts_on, ends_on, capacity, status)
      VALUES (${created.id}, ${dep.startsOn}, ${dep.endsOn}, ${dep.capacity}, 'open')
    `;
  }
}

const totalTours = await sql`SELECT COUNT(*) FROM tours`;
const totalDepartures = await sql`SELECT COUNT(*) FROM departures`;
console.log(`Done. Total tours: ${totalTours[0].count}, departures: ${totalDepartures[0].count}`);
