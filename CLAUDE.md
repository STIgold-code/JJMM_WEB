# CLAUDE.md

Guía para Claude Code al trabajar en este repositorio.

## Qué es este repositorio

Sitio web del Estudio Contable JJMM S.A.C. La aplicación vive en `sitio/`: sitio público y panel administrativo en una sola aplicación (Next.js App Router + Payload CMS 3, PostgreSQL). Reemplaza al sitio Laravel anterior, cuyo frontend estuvo en este repositorio y hoy solo queda en el historial de git.

**Antes de tocar código, lee [`sitio/CLAUDE.md`](sitio/CLAUDE.md):** tiene los comandos, la arquitectura por módulos y capas, los límites que hace cumplir ESLint y los detalles no evidentes.

## Mapa

| Ruta | Para qué sirve |
|---|---|
| `sitio/` | La aplicación; es lo único que se despliega |
| `odd/tasks/rediseno-sitio-jjmm.md` | Plan de trabajo: especificaciones (S1–S9), tareas y bitácora de decisiones |
| `PRODUCT.md` | Usuarios, posicionamiento y los hechos que se pueden publicar |
| `mockup/inicio-v4.html` | Diseño aprobado del inicio; referencia visual de la aplicación |
| `CRITICA.md` | Crítica del sitio anterior; contexto histórico del rediseño |
| `reports/` | Comparativo con la competencia |
| `.github/workflows/sitio.yml` | CI: tipos, lint, formato, pruebas, Playwright y Lighthouse CI |

## Comandos

Se usa **pnpm**, siempre apuntando a `sitio/`:

```bash
pnpm -C sitio install
pnpm -C sitio typecheck
pnpm -C sitio lint
pnpm -C sitio test                          # todas las pruebas de unidad
pnpm -C sitio test src/ruta/archivo.test.ts # un solo archivo
```

## Despliegue

- Railway (proyecto `jjmm-web`) despliega `sitio/` con cada push a `main`. Las migraciones se aplican al iniciar el servidor (`prodMigrations`).
- Playwright y Lighthouse CI solo corren en GitHub Actions, que levanta su propio PostgreSQL y carga el contenido con `pnpm semilla`.

## Reglas de contenido

- Textos visibles para el usuario en español neutro con tuteo (público peruano).
- Solo se publican los celulares 951 965 242 y 952 249 102; nunca teléfonos fijos.
- No se publican precios: los planes muestran «Consultar».
- No inventes testimonios, casos de éxito, fotografías, cifras ni número de colegiatura. Lo publicable está en `PRODUCT.md`.
- Objetivo de accesibilidad: WCAG 2.1 nivel AA.
- Commits en español con prefijos conventional (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
