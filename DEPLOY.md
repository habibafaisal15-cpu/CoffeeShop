# Brewed Coffee POS — Deploy Guide

Two Vercel projects from the **same repo**, sharing one PostgreSQL database and Supabase Storage for images.

| Project | `SITE_MODE` | URL role |
|---------|-------------|----------|
| **coffee-pos** | `customer` | Customer ordering kiosk |
| **coffee-pos-admin** | `admin` | Admin panel only |

## Required env vars (both projects)

```
DATABASE_URL=postgresql://...
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...

# Shared image storage — required on BOTH deployments
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get the service role key from Supabase → Project Settings → API.

Without these, admin uploads fail on Vercel and images will not appear on the customer site.

## Customer project env

```
SITE_MODE=customer
NEXT_PUBLIC_ADMIN_URL=https://your-admin.vercel.app
```

`NEXT_PUBLIC_ADMIN_URL` is a fallback for older `/api/uploads/...` paths. New uploads should use Supabase public URLs.

## Admin project env

```
SITE_MODE=admin
NEXT_PUBLIC_CUSTOMER_URL=https://your-customer.vercel.app
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

## After first deploy with Supabase

Re-upload category and product images in admin — old `/api/uploads/...` files do not persist on Vercel.

## Deploy commands

```bash
# Customer (existing project)
npx vercel deploy --prod

# Admin (separate project)
npx vercel deploy --prod --name coffee-pos-admin
```
