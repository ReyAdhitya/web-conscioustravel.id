import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const tours = [
  {
    slug: "ubud-rice-and-spirit",
    title: "Ubud · Rice & Spirit",
    kind: "fixed",
    shortDescription:
      "Six days in the hills above Ubud: sunrise yoga, terraced rice fields, water-temple blessings, and slow village dinners cooked by your hosts.",
    longDescription:
      "Six days in the hills above Ubud built around the rhythm of rice-farming life. You'll stay in a family-run lodge with views across the Subak terraces, practice with a local yoga teacher each morning, walk to working water temples for a Melukat blessing, and share evenings cooking with the women of the village.",
    durationDays: 6,
    basePriceMinor: 18500000,
    baseCurrency: "IDR",
    heroImageUrl:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600&auto=format&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=1200&auto=format&q=80",
      "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1200&auto=format&q=80",
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=1200&auto=format&q=80",
    ],
    inclusions: [
      "5 nights in a family-run lodge",
      "All meals (mostly plant-based, all local)",
      "Daily yoga with a local teacher",
      "Water-temple blessing with offerings",
      "Cooking workshop with village hosts",
      "Airport transfers from Denpasar",
    ],
    exclusions: ["International flights", "Travel insurance", "Tips for guides"],
    itinerary: [
      { day: 1, title: "Arrival in Ubud", description: "Met at Ngurah Rai, drive up to the lodge, slow dinner under the rice paddies." },
      { day: 2, title: "Sunrise yoga & Subak walk", description: "First yoga session, then a guided walk through the rice terraces with our local irrigation cooperative host." },
      { day: 3, title: "Tirta Empul blessing", description: "Half-day visit to the holy spring temple with proper preparation, sarongs provided." },
      { day: 4, title: "Cooking & rest day", description: "Afternoon cooking class with the village kitchen, evening unstructured." },
      { day: 5, title: "Forest & coffee", description: "Trek through the Sebatu forest, lunch at a single-origin coffee cooperative." },
      { day: 6, title: "Closing & departure", description: "Final yoga session, lunch, transfer back to Denpasar." },
    ],
    category: "wellness",
    minPax: 1,
    maxPax: 10,
  },
  {
    slug: "raja-ampat-liveaboard",
    title: "Raja Ampat · Sail & Snorkel",
    kind: "fixed",
    shortDescription:
      "Seven nights aboard a wooden phinisi exploring Raja Ampat's reefs with a local marine biologist, anchored in coves only a sailboat reaches.",
    longDescription:
      "Aboard a traditional Bugis-built phinisi, you'll sail through the Dampier Strait, snorkel reefs the dive industry hasn't yet found, sleep on deck under the Milky Way, and visit Papuan communities partnering with us on reef-restoration plots. Limited to 8 guests so the boat never feels crowded.",
    durationDays: 8,
    basePriceMinor: 62500000,
    baseCurrency: "IDR",
    heroImageUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&auto=format&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1582434034486-c81e8a6f4dc6?w=1200&auto=format&q=80",
      "https://images.unsplash.com/photo-1505881502353-a1986add3762?w=1200&auto=format&q=80",
    ],
    inclusions: [
      "7 nights aboard the phinisi (private cabin)",
      "All meals + snacks + soft drinks",
      "Daily guided snorkeling with marine biologist",
      "Village visits and reef-restoration tour",
      "Sorong domestic flights from Jakarta",
      "Marine park fees",
    ],
    exclusions: ["International flights", "Alcohol", "Dive certification (snorkel only)"],
    itinerary: [
      { day: 1, title: "Sorong arrival, board boat", description: "Meet at Sorong, transfer to the phinisi, sail to first anchorage." },
      { day: 2, title: "Dampier Strait reefs", description: "Three drift snorkels with marine biologist briefing." },
      { day: 3, title: "Wayag karst", description: "Sail north to the iconic Wayag karst formations, hike to viewpoint." },
      { day: 4, title: "Reef restoration", description: "Visit our restoration plot, plant new coral fragments with the local team." },
      { day: 5, title: "Village day", description: "Day with the Arborek community, traditional dance, family lunch." },
      { day: 6, title: "Misool South", description: "Sail to Misool, snorkel the jellyfish lake." },
      { day: 7, title: "Last reefs, sunset sail", description: "Final snorkel sites, sunset on deck back toward Sorong." },
      { day: 8, title: "Disembark", description: "Breakfast aboard, transfer to Sorong airport." },
    ],
    category: "eco",
    minPax: 2,
    maxPax: 8,
  },
  {
    slug: "yogyakarta-borobudur-weaving",
    title: "Yogyakarta · Stone & Loom",
    kind: "fixed",
    shortDescription:
      "Four days threading between Borobudur at dawn, kraton-trained gamelan teachers, and a women-run weaving cooperative in the Bantul hills.",
    longDescription:
      "A slow, culture-first journey through the spiritual and craft heart of Java. Pre-dawn Borobudur visit before tour buses arrive, an afternoon with a gamelan teacher in the royal kraton, then two days in the Bantul hills with a women's weaving cooperative whose looms still use natural indigo. You'll come back with a hand-woven scarf you made yourself.",
    durationDays: 4,
    basePriceMinor: 12750000,
    baseCurrency: "IDR",
    heroImageUrl:
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1600&auto=format&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1604665996020-fa3d36e2f86e?w=1200&auto=format&q=80",
    ],
    inclusions: [
      "3 nights in heritage homestays",
      "Pre-dawn Borobudur entry",
      "Gamelan lesson at kraton",
      "Two-day weaving workshop (keep what you make)",
      "All meals at family kitchens",
      "Private driver throughout",
    ],
    exclusions: ["International flights", "Domestic flight to Yogyakarta"],
    itinerary: [
      { day: 1, title: "Arrival in Yogya", description: "Meet at YIA, transfer to heritage homestay near Borobudur." },
      { day: 2, title: "Borobudur at dawn", description: "5am temple entry, late breakfast, afternoon kraton gamelan lesson." },
      { day: 3, title: "To the weaving village", description: "Drive into Bantul hills, meet the cooperative, learn the loom basics." },
      { day: 4, title: "Finish your scarf, fly out", description: "Finish your woven piece, lunch, transfer to airport." },
    ],
    category: "cultural",
    minPax: 1,
    maxPax: 6,
  },
  {
    slug: "flores-volcano-traverse",
    title: "Flores · Three Volcanoes",
    kind: "fixed",
    shortDescription:
      "Eight days traversing Flores from Bajawa to Kelimutu — coffee farms, hot-spring rivers, two summit hikes, and the tri-coloured crater lakes at dawn.",
    longDescription:
      "A proper adventure for fit walkers. You'll start in Bajawa with the Ngada villages and Inerie volcano, transit through Bena and the Ende coast, then summit Kelimutu for sunrise at the three crater lakes. Two summit hikes (Inerie and Kelimutu), one optional river day, and three nights in family homestays.",
    durationDays: 8,
    basePriceMinor: 28900000,
    baseCurrency: "IDR",
    heroImageUrl:
      "https://images.unsplash.com/photo-1518549914297-15a4ace96aeb?w=1600&auto=format&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=1200&auto=format&q=80",
    ],
    inclusions: [
      "7 nights mixed homestays + eco-lodges",
      "All meals",
      "Local guides on both summit hikes",
      "4WD transport between regions",
      "Park fees + village contributions",
    ],
    exclusions: ["International flights", "Travel insurance (required for hikes)"],
    itinerary: [
      { day: 1, title: "Ende → Bajawa", description: "Arrive Ende, drive up to Bajawa highlands, rest day." },
      { day: 2, title: "Bena & Ngada villages", description: "Visit traditional villages, evening dinner with Ngada hosts." },
      { day: 3, title: "Inerie summit", description: "Pre-dawn start for Inerie volcano summit, descend by midday." },
      { day: 4, title: "Soa hot springs", description: "Recovery day at the volcanic hot-spring rivers." },
      { day: 5, title: "Bajawa → Moni", description: "Long drive day with stops at Wolowaru market and coffee farm." },
      { day: 6, title: "Kelimutu dawn", description: "Pre-dawn drive + walk up Kelimutu, sunrise over the crater lakes." },
      { day: 7, title: "Rest + waterfalls", description: "Easy day, optional waterfall walks." },
      { day: 8, title: "Maumere transfer", description: "Drive to Maumere airport." },
    ],
    category: "adventure",
    minPax: 2,
    maxPax: 8,
  },
];

const today = new Date();
function addMonths(d, m) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + m);
  return x;
}
function fmt(d) {
  return d.toISOString().split("T")[0];
}

for (const tour of tours) {
  // Check if it exists
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

  // Seed 3 departures: 2, 5, 8 months out, each spanning the tour duration
  const months = [2, 5, 8];
  for (const m of months) {
    const start = addMonths(today, m);
    start.setDate(15);
    const end = new Date(start);
    end.setDate(end.getDate() + tour.durationDays - 1);
    await sql`
      INSERT INTO departures (tour_id, starts_on, ends_on, capacity, status)
      VALUES (${created.id}, ${fmt(start)}, ${fmt(end)}, ${tour.maxPax}, 'open')
    `;
  }
}

const totalTours = await sql`SELECT COUNT(*) FROM tours`;
const totalDepartures = await sql`SELECT COUNT(*) FROM departures`;
console.log(`Done. Total tours: ${totalTours[0].count}, departures: ${totalDepartures[0].count}`);
