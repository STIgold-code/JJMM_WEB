# JJMM_WEB

Sitio web del Estudio Contable JJMM S.A.C.: sitio público y panel administrativo en una sola aplicación (Next.js + Payload CMS 3, PostgreSQL).

## Estructura

| Ruta | Contenido |
|---|---|
| `sitio/` | La aplicación. Es lo único que se despliega. Su guía está en [`sitio/CLAUDE.md`](sitio/CLAUDE.md) |
| `odd/tasks/` | Plan de trabajo del rediseño, con especificaciones, tareas y bitácora |
| `mockup/` | Propuestas de diseño. `inicio-v4.html` es la versión aprobada |
| `reports/` | Comparativo con la competencia |
| `PRODUCT.md` | Producto, público y reglas de contenido |
| `CRITICA.md` | Crítica de diseño del sitio anterior (Laravel), que motivó el rediseño |

El código del sitio anterior (vistas Blade de Laravel) ya no está en este repositorio; queda en el historial de git.

## Cómo trabajar

```bash
pnpm -C sitio install
pnpm -C sitio dev        # requiere PostgreSQL; sitio en / y panel en /admin
pnpm -C sitio test
pnpm -C sitio lint
```

Los comandos completos, la arquitectura y las reglas de ingeniería están en [`sitio/CLAUDE.md`](sitio/CLAUDE.md).

## Despliegue

Railway despliega `sitio/` automáticamente con cada push a `main`. La CI de GitHub Actions corre tipos, lint, pruebas de unidad, Playwright y Lighthouse CI.

## Convenciones

- Commits en español con prefijos conventional (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
- Textos visibles para el usuario en español neutro con tuteo.
- Solo se publican los celulares de las sedes; no se publican teléfonos fijos ni precios de los planes.
