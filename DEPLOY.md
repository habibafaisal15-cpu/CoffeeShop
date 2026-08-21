# Brewed Coffee POS — Deploy Guide

Two Vercel projects from the **same repo**, sharing one PostgreSQL database.

| Project | `SITE_MODE` | URL role |
|---------|-------------|----------|
| **coffee-pos** | `customer` | Customer ordering kiosk |
| **coffee-pos-admin** | `admin` | Admin panel only |

Both need the same env vars: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.

## Customer project env
```
SITE_MODE=customer
DATABASE_URL=postgresql://...
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
NEXT_PUBLIC_ADMIN_URL=https://your-admin.vercel.app
```

## Admin project env
```
SITE_MODE=admin
DATABASE_URL=postgresql://...
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
NEXT_PUBLIC_CUSTOMER_URL=https://coffee-pos-coral.vercel.app
```

## Local development
```
SITE_MODE=full
```
Runs kiosk + admin together at `http://localhost:3000`.

## Initialize database
```bash
npm run db:init
```

## Deploy commands
```bash
# Customer (existing project)
npx vercel deploy --prod

# Admin (separate project, first time links new project)
npx vercel deploy --prod --name coffee-pos-admin
```
