# Home Content — Especificación MVP

> Exportado desde **Traductor Dev** · 2/11/2026, 6:50:25 p.m.

## Resumen del proyecto

| Campo | Valor |
| --- | --- |
| Estado | draft |
| Presupuesto | $0 |
| Tipo de sistema | — |
| Plazo MVP | — |

### Objetivo

El objetivo aparente es mostrar la oferta de ARGA Manufactura CNC a clientes residenciales y a organizaciones industriales o comerciales. La web parece servir como escaparate de productos, especialmente celosías, y podría apoyar la captación y gestión de contactos interesados. Existe una pantalla llamada “Panel de clientes potenciales”, aunque no está claro qué operaciones permite. No se declara el alcance de presupuestos, pedidos, pagos, fabricación o seguimiento completo de proyectos.

### Propuesta de solución

Qué hace:
- Presenta la oferta de ARGA Manufactura CNC para los ámbitos residencial e industrial/comercial.
- Muestra una experiencia dedicada a productos de celosías.
- Incluye un panel identificado como gestión de clientes potenciales.

Qué no hace / no está declarado:
- No se declara un flujo completo para solicitar presupuestos, realizar pedidos o pagar.
- No hay señales suficientes para afirmar que gestione producción, inventario, entregas o instalación.
- No está claro quién puede acceder al panel de clientes potenciales ni qué datos permite modificar.
- No se especifican modelos de negocio, catálogo completo, cobertura geográfica ni procesos comerciales.

Señales del código:
- `app/page.tsx` corresponde a la pantalla “Home Content”.
- `legacy-static/index.html` muestra el título “ARGA Celosías”.
- `legacy-static/index.backup.html` también muestra el título “ARGA Celosías”.
- `legacy-static/crm.html` se identifica como “ARGA CRM — Panel de clientes potenciales”.
- La descripción del repositorio indica “Landing page ARGA Manufactura CNC (Residencial + Industrial/Comercial)”.

Lo que el repositorio no declara (confirmar con el equipo):
- Modelos: no se encontraron archivos candidatos.
- No está claro si la página principal incluye formularios de contacto, solicitudes de presupuesto o llamadas a la acción comerciales.
- No se conoce el flujo de acceso, permisos ni las capacidades concretas del panel de clientes potenciales.
- No se declara si las celosías son el único producto o solo una línea destacada.
- No se detallan los servicios concretos de manufactura CNC ni los procesos posteriores a la captación de un cliente.
- No se encontraron archivos candidatos que definan modelos de datos.
- No está claro si las versiones dentro de `legacy-static` siguen activas o son únicamente versiones históricas.

## Hoja de Verdad

**Frontend:** React, Next.js, HTML/CSS

**Backend:** Node.js

**Base de datos:** Supabase

## Actores del sistema (4)

### Administrador

Interactúa con la funcionalidad administrativa disponible para gestionar diseños mediante la ruta de administración identificada en el sistema. El inventario no permite determinar qué decisiones adicionales puede tomar ni qué información puede consultar fuera de esa funcionalidad.

### Operador de taller

Opera maquinas

### Comprador

Compra materia prima y consumibles

### Venderor

Vende producto y servicios

---

_Fin de la especificación._