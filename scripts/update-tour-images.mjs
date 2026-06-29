// Patches hero + gallery image fields on existing tours with the local photos
// extracted from the owner's proposal PDFs (stored under /public/images/tours/).
// Idempotent and safe to re-run; only touches the four listed slugs.
//
// Run:  node scripts/update-tour-images.mjs
import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const updates = {
  "bali-group-experience": {
    hero: "/images/tours/bali-group-experience/hero.jpg",
    gallery: [
      "/images/tours/bali-group-experience/gallery-01-kintamani-jeep.jpg",
      "/images/tours/bali-group-experience/gallery-02-group-jumping.jpg",
      "/images/tours/bali-group-experience/gallery-03-jimbaran-seafood.jpg",
      "/images/tours/bali-group-experience/gallery-04-hot-spring-resort.jpg",
      "/images/tours/bali-group-experience/gallery-05-tegalalang-terrace.jpg",
      "/images/tours/bali-group-experience/gallery-06-art-market.jpg",
      "/images/tours/bali-group-experience/gallery-07-temple-group.jpg",
    ],
  },
  "corporate-outing-csr-bali": {
    hero: "/images/tours/corporate-outing-csr-bali/hero.jpg",
    gallery: [
      "/images/tours/corporate-outing-csr-bali/gallery-01-human-pyramid.jpg",
      "/images/tours/corporate-outing-csr-bali/gallery-02-tug-of-war.jpg",
      "/images/tours/corporate-outing-csr-bali/gallery-03-hands-circle.jpg",
      "/images/tours/corporate-outing-csr-bali/gallery-04-rope-pull.jpg",
      "/images/tours/corporate-outing-csr-bali/gallery-05-jeep-adventure.jpg",
      "/images/tours/corporate-outing-csr-bali/gallery-06-csr-planting.jpg",
      "/images/tours/corporate-outing-csr-bali/gallery-07-live-music.jpg",
      "/images/tours/corporate-outing-csr-bali/gallery-08-nusantara-feast.jpg",
      "/images/tours/corporate-outing-csr-bali/gallery-09-group-dinner.jpg",
    ],
  },
  "financial-literacy-csr-experience": {
    hero: "/images/tours/financial-literacy-csr-experience/hero.jpg",
    gallery: [
      "/images/tours/financial-literacy-csr-experience/gallery-01-team-arrival.jpg",
      "/images/tours/financial-literacy-csr-experience/gallery-02-bus-departure.jpg",
      "/images/tours/financial-literacy-csr-experience/gallery-03-goodie-bag.jpg",
    ],
  },
  "hanoi-halong-sapa": {
    hero: "/images/tours/hanoi-halong-sapa/hero.jpg",
    gallery: [
      "/images/tours/hanoi-halong-sapa/gallery-01-halong-boat-pov.jpg",
      "/images/tours/hanoi-halong-sapa/gallery-02-halong-boat.jpg",
      "/images/tours/hanoi-halong-sapa/gallery-03-sapa-terraces.jpg",
      "/images/tours/hanoi-halong-sapa/gallery-04-halong-dock.jpg",
      "/images/tours/hanoi-halong-sapa/gallery-05-sapa-walk.jpg",
    ],
  },
};

for (const [slug, { hero, gallery }] of Object.entries(updates)) {
  const rows = await sql`
    UPDATE tours
    SET hero_image_url = ${hero},
        gallery_image_urls = ${JSON.stringify(gallery)},
        updated_at = now()
    WHERE slug = ${slug}
    RETURNING slug
  `;
  console.log(rows.length ? `updated: ${slug}` : `NOT FOUND: ${slug}`);
}

console.log("Done.");
