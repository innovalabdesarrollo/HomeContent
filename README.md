# Home Content — ARGA Manufactura CNC (MVP)

Landing + celosías + contacto + CRM de leads + admin de diseños.

## Stack

- `apps/web` — Next.js + React + Tailwind + **Route Handlers** (`/api/*`) → deploy Vercel
- `apps/api` — Express local opcional · puerto **3007**
- MongoDB Atlas (DB `homecontent` en la URI)

## Requisitos

- Node.js **>= 24.22.1**
- pnpm 9

## Setup local

```bash
cp .env.example .env
# Edita MONGODB_URI
pnpm i
pnpm dev:web          # UI + API en :3008 (recomendado / igual que Vercel)
# opcional dual:
# pnpm dev            # Express :3007 + Next :3008 (NEXT_PUBLIC_API_URL=http://localhost:3007)
```

- Web (+ API Next): http://localhost:3008  
- Express opcional: http://localhost:3007  

## Publicar (GitHub → Vercel)

Ver **[DEPLOY.md](./DEPLOY.md)**. Resumen:

1. Commit + push a GitHub  
2. Import en Vercel · **Root Directory:** `apps/web`  
3. Env: `MONGODB_URI` (obligatoria), `NEXT_PUBLIC_API_URL` vacío, Cloudinary para uploads  

## Scripts

| Comando | Uso |
| --- | --- |
| `pnpm dev:web` | Next (UI + API) |
| `pnpm dev` | Express + Next en paralelo |
| `pnpm test` | Smoke API Express |
| `pnpm test:e2e` | Playwright |
