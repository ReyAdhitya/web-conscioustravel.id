# Conscious Travel Indonesia

A tour booking platform for sustainable and mindful travel across the Indonesian archipelago. Built for travelers who want to move slowly, pay people fairly, and leave places more whole than they found them.

The platform connects travelers with curated, low-impact journeys run by operators we know personally — yoga teachers, sailing crews, cooking grandmothers, tracking guides — people who have been doing this work well long before tourism was a category.

## What it does

Travelers can browse curated tour packages, choose a departure date, submit a booking, and pay online. Those who want something more personal can fill out an inquiry form to plan a fully custom itinerary. Every booking and inquiry triggers a confirmation email so nothing falls through the cracks.

On the back end, an admin dashboard lets the team manage tours and departure schedules, review incoming bookings and inquiries, and update statuses as trips are confirmed or cancelled.

## Tech stack

The platform is built on Next.js 16 with the App Router and deployed on Vercel. Data is stored in Neon Postgres using Drizzle ORM as the query layer. Transactional emails go out through Resend. Payments are handled by Midtrans, which covers bank transfer, GoPay, OVO, QRIS, and credit card in a single checkout popup. TypeScript is used throughout with Zod for form validation.

## Getting started

Copy the environment file and fill in the values.

```bash
cp .env.example .env.local
```

Install dependencies and start the dev server.

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`. The admin dashboard is at `/admin`.

## Environment variables

All required variables are documented in `.env.example`. The ones you need before the app will run are `DATABASE_URL` (a Neon Postgres connection string) and `ADMIN_PASSWORD` (any string, used to gate the admin dashboard).

Email sending requires `RESEND_API_KEY`. Payment processing requires `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, and `MIDTRANS_IS_PRODUCTION`.

## Running the tests

```bash
npm test
```

## Database migrations

To apply schema changes to your database:

```bash
npm run db:migrate
```
