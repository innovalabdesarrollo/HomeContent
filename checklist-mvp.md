# Checklist MVP — Home Content (ARGA Manufactura CNC)

Marca con `[x]` conforme se complete. Basado en `home-content-spec-mvp.md` + alcance acordado (stack Next/React + Node + MongoDB Atlas).

---

## Stack e infraestructura

- [x] Monorepo pnpm (`apps/web` + `apps/api`)
- [x] Frontend Next.js + React + Tailwind (responsive, prioridad móvil)
- [x] Backend Node.js (Express)
- [x] MongoDB Atlas — DB `homecontent` (URI en `.env`)
- [x] `.env.example` con `MONGODB_URI` y puertos
- [x] API en puerto **3007** (no matar proceso si está ocupado)
- [x] Web en puerto **3008**
- [x] Node ≥ 24.22.1 / auditoría deps (PostCSS override)
- [x] Prueba de conexión Atlas OK

---

## Landing / oferta pública

- [x] Home — marca ARGA Manufactura CNC
- [x] Bloque residencial
- [x] Bloque industrial / comercial
- [x] CTA a celosías y contacto
- [x] Página dedicada de celosías
- [x] Listado de diseños activos desde API
- [x] Formulario de contacto (captación de lead)
- [x] Lead guardado en Mongo (`leads`) sin envío de correo

---

## Panel de clientes potenciales (CRM)

- [x] Listar leads
- [x] Ver detalle (nombre, email, teléfono, mensaje)
- [x] Filtrar por estado
- [x] Cambiar estado (`nuevo` / `contactado` / `calificado` / `descartado`)
- [x] Notas internas
- [x] Eliminar lead
- [x] Mejoras UX CRM (búsqueda por nombre/email/teléfono)
- [x] Exportar leads (CSV del listado visible: filtro + búsqueda)

---

## Administración de diseños

- [x] Listar diseños
- [x] Crear diseño
- [x] Editar diseño
- [x] Activar / desactivar (visible en celosías)
- [x] Eliminar diseño
- [x] Subida de imágenes (local `/uploads` o Cloudinary vía `.env`; URL manual sigue disponible)

---

## Modelos Mongo

- [x] `leads` — name, email, phone, message, origin, status, notes, fechas
- [x] `designs` — title, description, imageUrl, category, active, fechas

---

## Actores del spec (solo señalados; no hay flujos completos)

| Actor | En MVP |
| --- | --- |
| Administrador | Usa `/admin` (diseños) y puede usar `/crm` |
| Vendedor | Usa `/crm` de forma informal (sin rol) |
| Operador de taller | No implementado |
| Comprador | No implementado |

- [ ] Roles / permisos por actor — **fuera de scope MVP**
- [ ] Login / auth — **fuera de scope MVP** (panel abierto en local)

---

## Fuera de scope (no integrar en este MVP)

- Auth con Google (ni otro proveedor)
- Envío de correo / notificaciones
- Presupuestos, pedidos, pagos
- Inventario, producción, entregas, instalación
- Catálogo completo de manufactura CNC (más allá de celosías/diseños)
- Flujos de operador de taller o comprador de materia prima
- Cobertura geográfica / modelos de negocio avanzados
- Mezclar otras bases de datos Atlas distintas a `homecontent`

---

## Cómo correr (referencia)

```bash
pnpm i
pnpm dev
```

- API: http://localhost:3007  
- Web: http://localhost:3008  
