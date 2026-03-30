# Deploy Frontend to Netlify

## 1) Update proxy target
Edit `netlify.toml` and replace:

`https://REPLACE_WITH_YOUR_RAILWAY_BACKEND_URL`

with your Railway backend URL (for example: `https://your-backend.up.railway.app`).

## 2) Create site in Netlify
- Import this GitHub repository.
- Netlify will read `netlify.toml` automatically.

## 3) Build settings (if prompted)
- Base directory: `frontend`
- Build command: `pnpm build`
- Publish directory: `frontend/dist/public`

## 4) Deploy
- Trigger deploy.
- Open the Netlify URL and test:
  - login/signup
  - loading listings
  - admin dashboard actions

## Notes
- The `/api/*` redirect keeps frontend requests same-origin, while Netlify proxies to Railway.
- This avoids CORS issues for browser calls from the frontend.
