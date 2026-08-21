# Brewed Coffee House — POS

A full-stack Point of Sale system for a coffee shop with **customer kiosk** and **admin panel**, inspired by the Brewed Coffee House design.

## Features

### Customer Kiosk (`/`)
- Pickup vs Delivery service selection modal
- Category navigation sidebar
- Product browsing with search and category filters
- Favorites, loyalty points display
- Cart with quantity controls
- Order placement with PKR pricing
- Order confirmation with points earned

### Admin Panel (`/admin`)
- **Dashboard** — today's stats, active queue, recent orders
- **Orders** — live order management with status workflow
- **Menu** — add, edit, delete products; toggle availability

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (cart state)
- JSON file persistence (`/data`)

## Getting Started

```bash
npm install
npm run dev
```

## URLs

| App | URL | Script |
|-----|-----|--------|
| **Customer kiosk** | [http://localhost:3000](http://localhost:3000) | `npm run dev` or `npm run dev:kiosk` |
| **Admin panel** | [http://localhost:3000/admin](http://localhost:3000/admin) | redirects to login if not signed in |
| **Admin login** | [http://localhost:3000/admin/login](http://localhost:3000/admin/login) | default: `admin` / `brewed123` |
| **Admin (dedicated port)** | [http://localhost:3001/admin](http://localhost:3001/admin) | `npm run dev:admin` |

Copy `.env.example` to `.env.local` to set your own admin username, password, and session secret.

If you see **Internal Server Error**, stop all running dev servers and run:

```bash
npm run dev:clean
```

The customer kiosk and admin panel are fully separate — the kiosk has no admin link. Staff open `/admin/login` directly.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Customer kiosk
│   ├── admin/                # Admin panel
│   └── api/                  # REST API routes
├── components/
│   └── customer/             # Kiosk UI components
└── lib/
    ├── types.ts              # Shared types
    ├── data.ts               # Default menu data
    ├── db.ts                 # JSON file storage
    └── store.ts              # Zustand cart store
```
