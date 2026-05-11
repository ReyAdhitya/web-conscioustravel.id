import {
  bigint,
  char,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const tourKind = pgEnum("tour_kind", ["fixed", "open"]);
export const tourCategory = pgEnum("tour_category", ["wellness", "eco", "cultural", "adventure"]);
export const departureStatus = pgEnum("departure_status", ["open", "sold_out", "cancelled"]);
export const bookingStatus = pgEnum("booking_status", [
  "pending_payment",
  "confirmed",
  "cancelled",
  "refunded",
]);
export const paymentGateway = pgEnum("payment_gateway", ["midtrans", "stripe", "manual_transfer"]);
export const paymentStatus = pgEnum("payment_status", [
  "initiated",
  "pending",
  "succeeded",
  "failed",
  "refunded",
]);
export const inquiryStatus = pgEnum("inquiry_status", [
  "new",
  "in_progress",
  "quoted",
  "won",
  "lost",
  "archived",
]);

export const tours = pgTable(
  "tours",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    kind: tourKind("kind").notNull(),
    shortDescription: text("short_description").notNull(),
    longDescription: text("long_description").notNull(),
    durationDays: integer("duration_days").notNull(),
    basePriceMinor: bigint("base_price_minor", { mode: "bigint" }).notNull(),
    baseCurrency: char("base_currency", { length: 3 }).notNull(),
    heroImageUrl: text("hero_image_url").notNull(),
    galleryImageUrls: jsonb("gallery_image_urls").$type<string[]>().notNull().default([]),
    inclusions: jsonb("inclusions").$type<string[]>().notNull().default([]),
    exclusions: jsonb("exclusions").$type<string[]>().notNull().default([]),
    itinerary: jsonb("itinerary")
      .$type<{ day: number; title: string; description: string }[]>()
      .notNull()
      .default([]),
    category: tourCategory("category").notNull(),
    minPax: integer("min_pax").notNull().default(1),
    maxPax: integer("max_pax").notNull().default(20),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("tours_slug_unique").on(t.slug),
    index("tours_kind_archived_idx").on(t.kind, t.archivedAt),
  ],
);

export const departures = pgTable(
  "departures",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tourId: uuid("tour_id")
      .notNull()
      .references(() => tours.id, { onDelete: "restrict" }),
    startsOn: date("starts_on").notNull(),
    endsOn: date("ends_on").notNull(),
    capacity: integer("capacity").notNull(),
    bookedCount: integer("booked_count").notNull().default(0),
    priceOverrideMinor: bigint("price_override_minor", { mode: "bigint" }),
    status: departureStatus("status").notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("departures_tour_idx").on(t.tourId),
    index("departures_starts_on_idx").on(t.startsOn),
  ],
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reference: text("reference").notNull(),
    departureId: uuid("departure_id").references(() => departures.id, { onDelete: "restrict" }),
    contactName: text("contact_name").notNull(),
    contactEmail: text("contact_email").notNull(),
    contactPhone: text("contact_phone").notNull(),
    paxCount: integer("pax_count").notNull(),
    totalMinor: bigint("total_minor", { mode: "bigint" }).notNull(),
    currency: char("currency", { length: 3 }).notNull(),
    status: bookingStatus("status").notNull().default("pending_payment"),
    notes: text("notes"),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    cancellationReason: text("cancellation_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("bookings_reference_unique").on(t.reference),
    index("bookings_email_idx").on(t.contactEmail),
    index("bookings_departure_idx").on(t.departureId),
    index("bookings_status_idx").on(t.status),
  ],
);

export const bookingTravelers = pgTable(
  "booking_travelers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    dateOfBirth: date("date_of_birth"),
    passportNumber: text("passport_number"),
    dietaryRestrictions: text("dietary_restrictions"),
    emergencyContactName: text("emergency_contact_name"),
    emergencyContactPhone: text("emergency_contact_phone"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("booking_travelers_booking_idx").on(t.bookingId)],
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "restrict" }),
    gateway: paymentGateway("gateway").notNull(),
    gatewayTransactionId: text("gateway_transaction_id"),
    amountMinor: bigint("amount_minor", { mode: "bigint" }).notNull(),
    currency: char("currency", { length: 3 }).notNull(),
    status: paymentStatus("status").notNull().default("initiated"),
    rawResponse: jsonb("raw_response").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("payments_booking_idx").on(t.bookingId),
    index("payments_gateway_txn_idx").on(t.gateway, t.gatewayTransactionId),
  ],
);

export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reference: text("reference").notNull(),
    contactName: text("contact_name").notNull(),
    contactEmail: text("contact_email").notNull(),
    contactPhone: text("contact_phone").notNull(),
    travelStart: date("travel_start"),
    travelEnd: date("travel_end"),
    groupSize: integer("group_size"),
    budgetMinMinor: bigint("budget_min_minor", { mode: "bigint" }),
    budgetMaxMinor: bigint("budget_max_minor", { mode: "bigint" }),
    budgetCurrency: char("budget_currency", { length: 3 }),
    interests: jsonb("interests").$type<string[]>().notNull().default([]),
    destinations: jsonb("destinations").$type<string[]>().notNull().default([]),
    message: text("message").notNull(),
    status: inquiryStatus("status").notNull().default("new"),
    internalNotes: text("internal_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("inquiries_reference_unique").on(t.reference),
    index("inquiries_email_idx").on(t.contactEmail),
    index("inquiries_status_idx").on(t.status),
  ],
);

export type Tour = typeof tours.$inferSelect;
export type NewTour = typeof tours.$inferInsert;
export type Departure = typeof departures.$inferSelect;
export type NewDeparture = typeof departures.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type BookingTraveler = typeof bookingTravelers.$inferSelect;
export type NewBookingTraveler = typeof bookingTravelers.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
