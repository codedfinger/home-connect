# HomeConnect — Real Estate Platform

## Overview

A real estate MVP platform connecting landlords directly with tenants, eliminating agents. Key selling points: verified listings with land documents, ID-verified landlords, and zero agent fees.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod, `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle)
- **Frontend**: React + Vite (Tailwind CSS, shadcn/ui)
- **Auth**: Replit Auth (OpenID Connect with PKCE)

## Features

### For Landlords
- Register and choose "Landlord" role after first login
- List properties with photos, details, price, type (rent/sale)
- Mark documents verified (hasLandDocuments flag)
- Change property status: Available / Rented / Sold
- View and manage enquiries from tenants (landlord dashboard)

### For Tenants
- Browse all property listings with filters (type, city, price, bedrooms, verified only)
- Contact landlords directly via enquiry form (message + phone)
- Save/bookmark favourite properties
- View bookmarks and sent enquiries in tenant dashboard

### Trust & Verification
- Verified landlord badge (isVerified)
- Land document verification badge (hasLandDocuments)
- No middlemen — direct landlord-tenant communication

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/          # Express 5 API backend
│   └── homeconnect/         # React + Vite frontend (previewPath: /)
├── lib/
│   ├── api-spec/            # OpenAPI spec + Orval codegen config
│   ├── api-client-react/    # Generated React Query hooks
│   ├── api-zod/             # Generated Zod schemas from OpenAPI
│   ├── replit-auth-web/     # useAuth() hook for browser auth
│   └── db/                  # Drizzle ORM schema + DB connection
├── pnpm-workspace.yaml
├── tsconfig.json
└── package.json
```

## Database Schema

- **users** — auth users with role (landlord/tenant), phone, bio, isVerified
- **sessions** — Replit Auth session storage
- **properties** — listings with type, status, price, city, images, verification flags
- **enquiries** — tenant messages to landlords about specific properties
- **bookmarks** — saved properties per user (userId + propertyId composite PK)

## API Routes

All routes prefixed with `/api`:

| Route | Auth | Purpose |
|-------|------|---------|
| `GET /auth/user` | - | Current user state |
| `GET /login` | - | Redirect to OIDC login |
| `GET /logout` | - | Logout |
| `GET /users/profile` | Required | Get user profile with role |
| `PUT /users/profile` | Required | Update role, phone, bio |
| `GET /properties` | - | List properties (with filters) |
| `GET /properties/my` | Required | Landlord's own listings |
| `GET /properties/:id` | - | Single property detail |
| `POST /properties` | Required | Create listing (landlord) |
| `PUT /properties/:id` | Required | Update listing (owner only) |
| `DELETE /properties/:id` | Required | Delete listing (owner only) |
| `POST /enquiries` | Required | Send enquiry (tenant) |
| `GET /enquiries/received` | Required | Landlord's inbox |
| `GET /enquiries/sent` | Required | Tenant's sent enquiries |
| `GET /bookmarks` | Required | Saved properties |
| `POST /bookmarks` | Required | Bookmark a property |
| `DELETE /bookmarks/:propertyId` | Required | Remove bookmark |

## Frontend Pages

- `/` — Landing page with hero, featured listings, trust badges
- `/listings` — Browse all properties with filters
- `/listings/:id` — Property detail page
- `/onboarding` — Role selection (landlord vs tenant)
- `/dashboard/landlord` — Landlord: manage listings + view enquiries
- `/dashboard/landlord/properties/new` — Add new listing form
- `/dashboard/landlord/properties/edit/:id` — Edit listing form
- `/dashboard/tenant` — Tenant: bookmarks + sent enquiries

## Seed Data

8 sample properties across Lagos, Abuja, Port Harcourt, Enugu from 3 demo landlords (john_properties, grace_realty, emeka_homes). Loaded via direct DB insert.

## Development

- Run API: `pnpm --filter @workspace/api-server run dev`
- Run frontend: `pnpm --filter @workspace/homeconnect run dev`
- Push schema: `pnpm --filter @workspace/db run push`
- Regenerate API types: `pnpm --filter @workspace/api-spec run codegen`
