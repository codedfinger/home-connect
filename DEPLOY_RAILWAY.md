# Deploy to Railway

## 1) Create project
- Push this repo to GitHub.
- In Railway, create a new project from the GitHub repo.

## 2) Add persistent volume for SQLite
- In your service, add a **Volume**.
- Mount path: `/data`.
- Set env var: `SQLITE_PATH=/data/homeconnect.db`.

## 3) Required environment variables
- `NODE_ENV=production`
- `NIXPACKS_NODE_VERSION=22`
- `PORT` is provided by Railway automatically.

## 4) Build/start (already configured)
This repo includes `railway.json` that runs:
- Build: install deps, build frontend + backend
- Start: run DB schema push, then start backend server

## 5) Seed demo data (optional)
Run this once in Railway shell:

```bash
pnpm --filter @workspace/db run seed
```

Default admin from seed:
- Email: `admin@homeconnect.local`
- Password: `admin123`

Set these env vars before seeding to override:
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

## 6) Share with client
- Copy the Railway public URL.
- Login with admin account to manage listings.
