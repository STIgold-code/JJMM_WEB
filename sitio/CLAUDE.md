# CLAUDE.md

Guía para Claude Code al trabajar en `sitio/`.

## Qué es

Sitio público y panel administrativo del Estudio Contable JJMM, en una sola aplicación: Next.js (App Router) + Payload CMS 3, PostgreSQL, medios en Wasabi. Reemplaza al sitio Laravel que vive fuera de esta carpeta. Ese sitio anterior es **solo referencia** (diseño v4 en `../mockup/inicio-v4.html` y `../resources/views/web/`); no se modifica desde aquí.

El plan de trabajo y las especificaciones (S1–S9) están en `../odd/tasks/rediseno-sitio-jjmm.md`. El contexto de negocio y los datos que se pueden publicar, en `../PRODUCT.md`.

## Comandos

Se usa **pnpm**. Desde la raíz del repositorio, antepón `-C sitio` (por ejemplo `pnpm -C sitio test`).

| Comando                                            | Qué hace                                                                                  |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `pnpm dev`                                         | Servidor de desarrollo (sitio en `/`, panel en `/admin`). Requiere PostgreSQL.            |
| `pnpm build` / `pnpm start`                        | Compilación y servidor de producción. La compilación no necesita base de datos.           |
| `pnpm typecheck`                                   | `tsc --noEmit`                                                                            |
| `pnpm lint`                                        | ESLint sin advertencias permitidas                                                        |
| `pnpm format` / `pnpm format:check`                | Prettier                                                                                  |
| `pnpm test`                                        | Vitest (`src/**/*.test.{ts,tsx}`)                                                         |
| `pnpm test src/compartido/dominio/celular.test.ts` | Un solo archivo de prueba                                                                 |
| `pnpm test -t "rechaza teléfonos fijos"`           | Una sola prueba por nombre                                                                |
| `pnpm test:e2e`                                    | Playwright (`e2e/`). En local reutiliza o levanta `pnpm dev`; en CI levanta `pnpm start`. |
| `pnpm lighthouse`                                  | Lighthouse CI con `lighthouserc.json`; requiere `pnpm build` previo.                      |
| `pnpm generate:types`                              | Regenera `src/payload-types.ts` tras cambiar colecciones. No necesita base de datos.      |
| `pnpm generate:importmap`                          | Regenera el mapa de componentes del panel.                                                |

Variables de entorno: copia `.env.example` a `.env`. `.env` no se versiona.

## Reglas de ingeniería

La arquitectura y sus motivos están en [`docs/adr/0001-arquitectura.md`](docs/adr/0001-arquitectura.md). Léela antes de crear un módulo o un bloque.

**Estructura por módulos de negocio** en `src/modulos/<modulo>/` (portada, nosotros, servicios, planes, sedes, clientes, avisos, vencimientos, blog, contacto, navegacion, usuarios). Lo transversal va en `src/compartido/`. Las rutas viven en `src/app/` y solo componen módulos. Cada módulo crea solo las capas que necesita:

- `dominio/`: tipos y reglas puras. Sin Payload, sin `payload-types`, sin React, sin Next.
- `aplicacion/`: casos de uso que reciben sus repositorios por parámetro (interfaces). Mismas prohibiciones que `dominio/`.
- `infraestructura/`: colecciones, bloques y adaptadores de Payload que implementan esas interfaces.
- `componentes/`: contenedores y presentación. Sin `payload`, `@payloadcms/*` ni `@payload-config`.

Las dependencias apuntan hacia adentro. `no-restricted-imports` en `eslint.config.mjs` lo hace cumplir por carpeta y `src/limites-de-capas.test.ts` lo prueba.

Estado actual:

| Ruta                                                         | Qué es                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `src/modulos/usuarios/infraestructura/coleccion-usuarios.ts` | Colección `usuarios` (acceso al panel)                       |
| `src/compartido/infraestructura/coleccion-medios.ts`         | Colección `medios` (archivos, en Wasabi si está configurado) |
| `src/compartido/componentes/bloques/`                        | `RegistroDeBloques`, `RenderizadorDeBloques` y su error      |
| `src/compartido/dominio/`                                    | Reglas transversales (por ejemplo, `celular.ts`)             |

Colecciones: archivo `coleccion-<nombre>.ts`, exportación `coleccion<Nombre>`, slug en español y en plural.

**Componentes**

- Contenedor (Server Component que obtiene y prepara datos) separado de presentación (solo props y marcado).
- Una responsabilidad por componente; ninguno obtiene, transforma y dibuja varias secciones.
- `"use client"` solo en piezas interactivas: slider, menú móvil, rueda con pestañas, selector de plan y formulario.
- Props chicas: no pases un objeto entero para usar un campo.

**SOLID aplicado**

- Las secciones de página son bloques de Payload con un registro `tipo → componente` (`RegistroDeBloques<B>`, donde `B` es la unión de bloques de `payload-types.ts`). Un bloque nuevo se agrega con una entrada más, sin tocar los existentes, y todos reciben solo `{ bloque }` (`PropsDeBloque`). Un tipo sin registrar lanza `TipoDeBloqueDesconocidoError`; quitar un bloque exige migrar sus datos.
- Los casos de uso reciben repositorios por parámetro para probarlos con dobles, sin base de datos.

**Límites que ESLint hace cumplir** en `src/**/*.{ts,tsx}`, como error:

- `max-lines` 150 por archivo y `max-lines-per-function` 40 (sin contar líneas en blanco ni comentarios). Superarlos exige dividir, no desactivar la regla.
- `complexity` 10.
- `@typescript-eslint/no-explicit-any`.

Quedan fuera los archivos que genera Payload: `src/payload-types.ts`, `src/app/(payload)/**` y `importMap.js`. Las pruebas no tienen límite por función.

**Calidad**

- TypeScript `strict` y `noUncheckedIndexedAccess`. Sin `any` ni `as` sin una justificación escrita junto al código.
- Datos normalizados: colecciones y relaciones, nunca JSON genéricos (por ejemplo, planes = plan, característica e inclusión).
- Estilos con CSS Modules y los tokens de la v4 como variables CSS.
- Nombres en español; archivos en kebab-case. Los nombres que exige el framework (`page.tsx`, `layout.tsx`, `payload.config.ts`) se respetan.
- Pruebas primero en reglas de dominio: escribe la prueba que falla antes de implementar.
- La configuración del panel es código (colecciones y globales en TypeScript), nunca cambios manuales.

**Rendimiento (S3)**, verificado por Lighthouse CI en móvil: rendimiento ≥ 0,9, LCP ≤ 2500 ms, CLS ≤ 0,1 y como máximo 170 KB de JavaScript transferido en el inicio.

## Reglas de contenido

- Todo el contenido público se edita desde el panel; nada queda escrito en el código.
- Solo se publican celulares (951 965 242 y 952 249 102); nunca teléfonos fijos.
- Los planes muestran «Consultar»; no se publican montos.
- No se inventan testimonios, cifras, fotos ni número de colegiatura.
- WCAG 2.1 AA, comprobado con axe en Playwright.
- Textos en español neutro con tuteo (público peruano).

## Detalles no evidentes

- **Wasabi:** `src/compartido/infraestructura/almacenamiento-wasabi.ts` registra `@payloadcms/storage-s3` solo si existen las cinco variables `WASABI_*`. Sin ellas, Payload guarda los archivos de la colección `medios` en `media/` (`staticDir`, solo para desarrollo).
- **Mapa de componentes del panel:** el adaptador de Wasabi agrega `S3ClientUploadHandler` al `importMap.js`. Por eso `pnpm generate:importmap` define variables `WASABI_*` ficticias: así el mapa siempre incluye el componente, esté Wasabi activo o no. No lo generes con `pnpm payload generate:importmap` directo.
- **Base de datos:** el adaptador de PostgreSQL sincroniza el esquema automáticamente solo en desarrollo. Producción y CI necesitan migraciones (`pnpm payload migrate:create` y `pnpm payload migrate`).
- `src/app/(payload)/` lo genera Payload; no lo edites salvo que la documentación de Payload lo indique.
- Node: Payload 3.94 exige Node `^22.23.5 || ^24.22.3 || >=26.13.1`.
- El CI está en `../.github/workflows/sitio.yml`: tipos, lint, formato, pruebas y compilación; luego Playwright y Lighthouse CI con PostgreSQL de servicio.
