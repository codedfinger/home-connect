# Deploy Frontend to Netlify

## 1) Proxy target
`netlify.toml` is already configured to proxy API calls to:

`https://workspacebackend-production-16aa.up.railway.app`

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
