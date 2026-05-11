CREATE TYPE "public"."booking_status" AS ENUM('pending_payment', 'confirmed', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."departure_status" AS ENUM('open', 'sold_out', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."inquiry_status" AS ENUM('new', 'in_progress', 'quoted', 'won', 'lost', 'archived');--> statement-breakpoint
CREATE TYPE "public"."payment_gateway" AS ENUM('midtrans', 'stripe', 'manual_transfer');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('initiated', 'pending', 'succeeded', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."tour_category" AS ENUM('wellness', 'eco', 'cultural', 'adventure');--> statement-breakpoint
CREATE TYPE "public"."tour_kind" AS ENUM('fixed', 'open');--> statement-breakpoint
CREATE TABLE "booking_travelers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"full_name" text NOT NULL,
	"date_of_birth" date,
	"passport_number" text,
	"dietary_restrictions" text,
	"emergency_contact_name" text,
	"emergency_contact_phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"departure_id" uuid NOT NULL,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text NOT NULL,
	"pax_count" integer NOT NULL,
	"total_minor" bigint NOT NULL,
	"currency" char(3) NOT NULL,
	"status" "booking_status" DEFAULT 'pending_payment' NOT NULL,
	"notes" text,
	"cancelled_at" timestamp with time zone,
	"cancellation_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tour_id" uuid NOT NULL,
	"starts_on" date NOT NULL,
	"ends_on" date NOT NULL,
	"capacity" integer NOT NULL,
	"booked_count" integer DEFAULT 0 NOT NULL,
	"price_override_minor" bigint,
	"status" "departure_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text NOT NULL,
	"travel_start" date,
	"travel_end" date,
	"group_size" integer,
	"budget_min_minor" bigint,
	"budget_max_minor" bigint,
	"budget_currency" char(3),
	"interests" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"destinations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"message" text NOT NULL,
	"status" "inquiry_status" DEFAULT 'new' NOT NULL,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"gateway" "payment_gateway" NOT NULL,
	"gateway_transaction_id" text,
	"amount_minor" bigint NOT NULL,
	"currency" char(3) NOT NULL,
	"status" "payment_status" DEFAULT 'initiated' NOT NULL,
	"raw_response" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"kind" "tour_kind" NOT NULL,
	"short_description" text NOT NULL,
	"long_description" text NOT NULL,
	"duration_days" integer NOT NULL,
	"base_price_minor" bigint NOT NULL,
	"base_currency" char(3) NOT NULL,
	"hero_image_url" text NOT NULL,
	"gallery_image_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"inclusions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"exclusions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"itinerary" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"category" "tour_category" NOT NULL,
	"min_pax" integer DEFAULT 1 NOT NULL,
	"max_pax" integer DEFAULT 20 NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booking_travelers" ADD CONSTRAINT "booking_travelers_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_departure_id_departures_id_fk" FOREIGN KEY ("departure_id") REFERENCES "public"."departures"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departures" ADD CONSTRAINT "departures_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "booking_travelers_booking_idx" ON "booking_travelers" USING btree ("booking_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_reference_unique" ON "bookings" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "bookings_email_idx" ON "bookings" USING btree ("contact_email");--> statement-breakpoint
CREATE INDEX "bookings_departure_idx" ON "bookings" USING btree ("departure_id");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "departures_tour_idx" ON "departures" USING btree ("tour_id");--> statement-breakpoint
CREATE INDEX "departures_starts_on_idx" ON "departures" USING btree ("starts_on");--> statement-breakpoint
CREATE UNIQUE INDEX "inquiries_reference_unique" ON "inquiries" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "inquiries_email_idx" ON "inquiries" USING btree ("contact_email");--> statement-breakpoint
CREATE INDEX "inquiries_status_idx" ON "inquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payments_booking_idx" ON "payments" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "payments_gateway_txn_idx" ON "payments" USING btree ("gateway","gateway_transaction_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tours_slug_unique" ON "tours" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tours_kind_archived_idx" ON "tours" USING btree ("kind","archived_at");