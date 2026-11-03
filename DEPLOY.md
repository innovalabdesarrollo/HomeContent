# Publicar en Vercel (1 proyecto) vía GitHub

Monorepo pnpm: en producción **solo se despliega** `apps/web` (Next.js).  
Las Route Handlers en `apps/web/app/api/*` cubren leads, designs, uploads y health.  
`apps/api` (Express) sigue disponible para desarrollo/smoke local.

## 1. GitHub

```bash
cd HomeContent
git init
git add .
git commit -m "MVP Home Content listo para Vercel"
# Crea el repo vacío en GitHub y luego:
git branch -M main
git remote add origin https://github.com/TU_USUARIO/HomeContent.git
git push -u origin main
```

No subas `.env` (ya está en `.gitignore`).

## 2. Vercel → Import Git Repository

1. [vercel.com/new](https://vercel.com/new) → Importa el repo de GitHub.
2. **Root Directory:** `apps/web`  
   (Vercel detectará el workspace pnpm e instalará desde la raíz.)
3. **Framework Preset:** Next.js  
4. **Install Command:** `cd ../.. && pnpm install` (o el de `apps/web/vercel.json`)  
5. **Build Command:** `pnpm build` (desde `apps/web`)  
6. **Node.js Version:** 22.x o superior (ideal ≥ 24.22.1)

Si importas desde la **raíz** del monorepo (sin Root Directory):

- Usa el `vercel.json` de la raíz (`pnpm --filter @home-content/web build`).

## 3. Variables de entorno (Production + Preview)

| Variable | Obligatoria | Notas |
| --- | --- | --- |
| `MONGODB_URI` | Sí | Atlas, DB `homecontent` en la URI |
| `NEXT_PUBLIC_API_URL` | No | **Dejar vacío** (mismo origen) |
| `CLOUDINARY_CLOUD_NAME` | Para uploads | En Vercel no hay disco persistente |
| `CLOUDINARY_API_KEY` | Para uploads | |
| `CLOUDINARY_API_SECRET` | Para uploads | |
| `CLOUDINARY_FOLDER` | No | Default `homecontent` |

En Atlas: permite acceso de red (`0.0.0.0/0` o IPs de Vercel).

## 4. Deploy

Push a `main` → Vercel despliega solo.  
URL tipo `https://tu-proyecto.vercel.app`.

## 5. Local vs producción

| | Local | Vercel |
| --- | --- | --- |
| UI | `pnpm dev:web` (puerto 3008) | Next |
| API | Route Handlers Next **o** Express `pnpm dev:api` (3007) | Route Handlers Next |
| Cliente | `NEXT_PUBLIC_API_URL=` (same-origin) o `http://localhost:3007` | vacío |
