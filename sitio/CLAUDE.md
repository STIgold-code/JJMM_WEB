# CLAUDE.md

Guía para Claude Code al trabajar en `sitio/`.

## Qué es

Sitio público y panel administrativo del Estudio Contable JJMM, en una sola aplicación: Next.js (App Router) + Payload CMS 3, PostgreSQL, medios en Wasabi. Reemplaza al sitio Laravel que vive fuera de esta carpeta. Ese sitio anterior es **solo referencia** (diseño v4 en `../mockup/inicio-v4.html` y `../resources/views/web/`); no se modifica desde aquí.

El plan de trabajo y las especificaciones (S1–S9) están en `../odd/tasks/rediseno-sitio-jjmm.md`. El contexto de negocio y los datos que se pueden publicar, en `../PRODUCT.md`.

## Comandos

Se usa **pnpm**. Desde la raíz del repositorio, antepón `-C sitio` (por ejemplo `pnpm -C sitio test`).

| Comando                                            | Qué hace                                                                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `pnpm dev`                                         | Servidor de desarrollo (sitio en `/`, panel en `/admin`). Requiere PostgreSQL.             |
| `pnpm build` / `pnpm start`                        | Compilación y servidor de producción. La compilación no necesita base de datos.            |
| `pnpm typecheck`                                   | `tsc --noEmit`                                                                             |
| `pnpm lint`                                        | ESLint sin advertencias permitidas                                                         |
| `pnpm format` / `pnpm format:check`                | Prettier                                                                                   |
| `pnpm test`                                        | Vitest (`src/**/*.test.{ts,tsx}`)                                                          |
| `pnpm test src/compartido/dominio/celular.test.ts` | Un solo archivo de prueba                                                                  |
| `pnpm test -t "rechaza teléfonos fijos"`           | Una sola prueba por nombre                                                                 |
| `pnpm test:e2e`                                    | Playwright (`e2e/`). En local reutiliza o levanta `pnpm dev`; en CI levanta `pnpm start`.  |
| `pnpm lighthouse`                                  | Lighthouse CI con `lighthouserc.json`; requiere `pnpm build` previo.                       |
| `pnpm generate:types`                              | Regenera `src/payload-types.ts` tras cambiar colecciones. No necesita base de datos.       |
| `pnpm generate:importmap`                          | Regenera el mapa de componentes del panel.                                                 |
| `pnpm semilla`                                     | Carga inicial e idempotente del contenido real (ver «Carga inicial»). Requiere PostgreSQL. |

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

| Ruta                                   | Qué es                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------- |
| `src/contenido.ts`                     | Raíz de composición: lista de colecciones y globales que registra `payload.config.ts` |
| `src/compartido/infraestructura/`      | `medios`, `configuracion-del-sitio`, control de acceso (`acceso.ts`) y campos comunes |
| `src/compartido/componentes/bloques/`  | `RegistroDeBloques`, `RenderizadorDeBloques` y su error                               |
| `src/compartido/dominio/`              | Reglas transversales: celular, slug, destino de enlace, roles                         |
| `src/modulos/<modulo>/infraestructura` | Colecciones, globales y bloques de cada módulo (ver «Modelo de datos»)                |
| `src/migrations/`                      | Migraciones de PostgreSQL que genera Payload                                          |

Colecciones: archivo `coleccion-<nombre>.ts`, exportación `coleccion<Nombre>`, slug en español y en plural. Globales: `global-<nombre>.ts`, exportación `global<Nombre>`. Bloques: `bloque-<nombre>.ts`, exportación `bloque<Nombre>` e `interfaceName` `Bloque<Nombre>`.

### Modelo de datos

| Panel            | Slug                                                                                         | Módulo                              |
| ---------------- | -------------------------------------------------------------------------------------------- | ----------------------------------- |
| Inicio           | global `pagina-de-inicio` (bloques de secciones)                                             | `portada`                           |
| Inicio           | `areas-de-servicio`                                                                          | `servicios`                         |
| Inicio           | `planes`, `caracteristicas-de-plan`, `inclusiones-de-plan` (único por plan + característica) | `planes`                            |
| Inicio           | `valores`, `clientes`                                                                        | `nosotros`, `clientes`              |
| Guía de clientes | global `guia-de-clientes`, `avisos-para-clientes`, `vencimientos`, `cronogramas-sunat`       | `avisos`, `vencimientos`            |
| Blog             | global `pagina-del-blog`, `publicaciones` (con borradores), `categorias`, `etiquetas`        | `blog`                              |
| Contacto         | `mensajes-de-contacto`                                                                       | `contacto`                          |
| Sitio            | global `navegacion`, global `configuracion-del-sitio`, `sedes`, `medios`                     | `navegacion`, `sedes`, `compartido` |
| Administración   | `usuarios` (rol `administrador` o `editor`)                                                  | `usuarios`                          |

Bloques de `pagina-de-inicio`: `carrusel-de-portadas`, `quienes-somos`, `servicios`, `planes`, `por-que-elegirnos`, `clientes`, `contacto`. Las listas (áreas, planes, valores, clientes) salen de sus colecciones; el bloque solo guarda los textos de la sección.

**Acceso:** el contenido lo lee cualquiera y lo escribe el equipo (`ACCESO_DE_CONTENIDO`). `configuracion-del-sitio`, `navegacion` y la gestión de usuarios son solo del administrador; un editor solo ve y edita su propia cuenta y no puede cambiar su rol. El público solo lee publicaciones publicadas. `mensajes-de-contacto` lo crea cualquiera y lo lee solo el equipo. El primer usuario que se crea queda como administrador.

**Validaciones:** las reglas de negocio viven en `dominio/` con pruebas, y `compartido/infraestructura/campos/validaciones.ts` las adapta a la firma `validate` de Payload. Un `validate` propio reemplaza al de `required`, así que cada adaptador resuelve el campo vacío. Celulares (nunca fijos), montos en planes (prohibidos), destinos de enlace por tipo, slugs, códigos P1–P9, gajos de la rueda y cronogramas con una fecha por dígito del RUC.

**Orden:** las colecciones ordenables usan un campo numérico `orden` (menor primero), no `orderable` de Payload, que todavía es experimental.

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

### Carga inicial

`src/semilla/` carga en Payload el contenido real del sitio actual (inicio v4, guía de clientes, `PRODUCT.md`). Está fuera de los módulos porque es una herramienta de una sola vez, no parte del sitio:

- `datos/`: datos puros y tipados con `payload-types.ts`, así un cambio del modelo que rompa la semilla falla en `pnpm typecheck`. Los medios se nombran por su archivo y las relaciones por su clave natural; el `orden` sale de la posición en cada lista. Las pruebas de `datos/*.test.ts` aplican las reglas de dominio y de contenido (S9) a toda la semilla.
- `carga/` y `cargar.ts`: el cargador depende de `PuertoDeCarga` (`puerto-de-carga.ts`), no de Payload, y se prueba con `prueba/puerto-en-memoria.ts`. `adaptador-payload.ts` lo implementa con la Local API e `index.ts` es la entrada de `pnpm semilla` (`payload run`, que lee el `.env`).
- Idempotente: cada documento se busca por su clave natural (código del área, nombre del plan, `filename` del medio, logotipo del cliente, plan + característica, obligación + periodicidad) y se crea o se actualiza; las globales se reemplazan. Un archivo solo se sube al crear su medio.
- Las imágenes se suben desde `../public/web/images/`, sin copiarlas a `sitio/`. Antes de borrar el sitio anterior (T16), mueve esas imágenes o ejecuta la carga.
- Si `media/` conserva archivos de una base borrada, Payload sube el medio con otro nombre (`-1`) y la siguiente carga lo duplica: vacía `media/` al recrear la base local.
- El administrador se crea solo con `SEMILLA_ADMIN_CORREO` y `SEMILLA_ADMIN_CLAVE`; una cuenta existente no se toca.
- No se cargan `cronogramas-sunat` (falta el cronograma oficial), publicaciones, categorías ni etiquetas (viven en la base de producción, no en el repositorio).

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
- **Base de datos y migraciones:** `push` solo está activo con `NODE_ENV=development`; en CI y producción el esquema cambia únicamente con migraciones de `src/migrations/`. Tras cambiar colecciones, globales o bloques: `pnpm payload migrate:create <nombre>` (no necesita base de datos; para no tocar la local, pásale un `DATABASE_URI` inalcanzable con `cross-env`), luego `pnpm format`, y versiona el `.ts`, el `.json` y `index.ts`. El CI aplica `pnpm payload migrate` antes de Playwright. ESLint ignora `src/migrations/`.
- **Nombres de 63 caracteres:** PostgreSQL limita los identificadores y Payload deriva el nombre de tablas y enums del slug y de los campos anidados. Si `migrate:create` falla con «Exceeded max identifier length», usa `dbName` en el bloque o la colección (por ejemplo, `inicio_blocks_carrusel`). Payload usa el `dbName` de un bloque tal cual, sin el prefijo de la global.
- `src/app/(payload)/` lo genera Payload; no lo edites salvo que la documentación de Payload lo indique.
- Node: Payload 3.94 exige Node `^22.23.5 || ^24.22.3 || >=26.13.1`.
- El CI está en `../.github/workflows/sitio.yml`: tipos, lint, formato, pruebas y compilación; luego Playwright y Lighthouse CI con PostgreSQL de servicio.
