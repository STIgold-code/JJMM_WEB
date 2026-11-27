# CLAUDE.md

Guía para Claude Code al trabajar en `sitio/`.

## Qué es

Sitio público y panel administrativo del Estudio Contable JJMM, en una sola aplicación: Next.js (App Router) + Payload CMS 3, PostgreSQL, medios en un volumen de Railway (o en Wasabi si se definen sus variables). Reemplaza al sitio Laravel anterior, cuyo código ya no está en el repositorio. La referencia de diseño es el mockup aprobado `../mockup/inicio-v4.html`, salvo «Contáctanos», que sigue la de `../mockup/inicio-v5.html` (elegida por el estudio): una pestaña por sede activa, con WhatsApp, llamada, «Cómo llegar» y un mapa que solo carga Google Maps al pulsar «Ver mapa», y el formulario de tres campos.

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

| Ruta                                     | Qué es                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------- |
| `src/contenido.ts`                       | Raíz de composición: lista de colecciones y globales que registra `payload.config.ts` |
| `src/compartido/infraestructura/`        | `medios`, `configuracion-del-sitio`, control de acceso (`acceso.ts`) y campos comunes |
| `src/compartido/componentes/bloques/`    | `RegistroDeBloques`, `RenderizadorDeBloques` y su error                               |
| `src/compartido/dominio/`                | Reglas transversales: celular, slug, destino de enlace, roles                         |
| `src/modulos/<modulo>/infraestructura`   | Colecciones, globales y bloques de cada módulo (ver «Modelo de datos»)                |
| `src/migrations/`                        | Migraciones de PostgreSQL que genera Payload                                          |
| `src/app/(frontend)/`                    | Layout público, `estilos-globales.css` (tokens v4) y fuentes locales (`fuentes/`)     |
| `src/compartido/componentes/estructura/` | Barra superior, cabecera, pie y botones flotantes (contenedor + presentación)         |
| `src/compartido/componentes/revelado/`   | Aparición al hacer scroll: `propsDeRevelado` y `ObservadorDeRevelado`                 |
| `src/compartido/componentes/iconos/`     | Sprite SVG (`SpriteDeIconos`, una vez en el layout) e `Icono`                         |

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

**Rendimiento (S3)**, verificado por Lighthouse CI en móvil sobre `/`, `/guia` y `/blog`: rendimiento ≥ 0,9, LCP ≤ 2500 ms, CLS ≤ 0,1 y como máximo 170 KB de JavaScript transferido por página. El detalle de una publicación no se mide en CI porque la semilla no carga publicaciones.

### Carga inicial

`src/semilla/` carga en Payload el contenido real del sitio actual (inicio v4, guía de clientes, `PRODUCT.md`). Está fuera de los módulos porque es una herramienta de una sola vez, no parte del sitio:

- `datos/`: datos puros y tipados con `payload-types.ts`, así un cambio del modelo que rompa la semilla falla en `pnpm typecheck`. Los medios se nombran por su archivo y las relaciones por su clave natural; el `orden` sale de la posición en cada lista. Las pruebas de `datos/*.test.ts` aplican las reglas de dominio y de contenido (S9) a toda la semilla.
- `carga/` y `cargar.ts`: el cargador depende de `PuertoDeCarga` (`puerto-de-carga.ts`), no de Payload, y se prueba con `prueba/puerto-en-memoria.ts`. `adaptador-payload.ts` lo implementa con la Local API e `index.ts` es la entrada de `pnpm semilla` (`payload run`, que lee el `.env`).
- Idempotente: cada documento se busca por su clave natural (código del área, nombre del plan, `filename` del medio, logotipo del cliente, plan + característica, obligación + periodicidad) y se crea o se actualiza; las globales se reemplazan. Un archivo solo se sube al crear su medio.
- Las imágenes se suben desde `semilla/imagenes/`, dentro del proyecto, así la carga funciona también en el contenedor de Railway (`railway ssh --service web -- pnpm semilla`).
- Si `media/` conserva archivos de una base borrada, Payload sube el medio con otro nombre (`-1`) y la siguiente carga lo duplica: vacía `media/` al recrear la base local.
- El administrador se crea solo con `SEMILLA_ADMIN_CORREO` y `SEMILLA_ADMIN_CLAVE`; una cuenta existente no se toca.
- No se cargan `cronogramas-sunat` (falta el cronograma oficial), publicaciones, categorías ni etiquetas (viven en la base de producción, no en el repositorio).

### Sitio público

- **Lectura de datos:** cada contenedor (Server Component) llama a una función de `componentes/obtener-*.ts` o `estructura/datos-del-sitio.ts`, que une el caso de uso con su adaptador de Payload y la envuelve en `cache` de React (una lectura por petición). Los adaptadores usan la Local API con `overrideAccess: false` y sin usuario, así que solo leen lo público.
- **Datos ausentes:** si una global nunca se guardó, su mapeador devuelve `null` y la pieza no se dibuja. Los errores reales (base caída, celular que no es celular) se propagan.
- **Renderizado y caché** ([ADR 0002](docs/adr/0002-cache-y-revalidacion.md)): el layout de `(frontend)` y `sitemap.ts` exportan `dynamic = 'force-dynamic'`, así la compilación no necesita base de datos y el HTML se arma en cada petición. Las lecturas de Payload, en cambio, se guardan en la caché de datos de Next:
  - Cada método de un adaptador `repositorio-*-payload.ts` se envuelve con `leerEnCache(clave, etiquetas, leer)` (`compartido/infraestructura/lectura-en-cache.ts`). La clave es única por lectura (`'<slug>.<metodo>'`) y las etiquetas nombran todo lo que la lectura trae, también lo poblado con `depth: 1` (por ejemplo `medios`). Lo que devuelve se guarda como JSON: sin `Date` ni `Map`.
  - Las etiquetas salen de `compartido/dominio/etiquetas-de-cache.ts`: `coleccion:<slug>`, `global:<slug>` y `documento:publicaciones:<slug>` para el detalle de una publicación.
  - `contenido.ts` envuelve cada colección y global que el sitio lee con `conRevalidacion` / `globalConRevalidacion`, que agregan los hooks de `compartido/infraestructura/revalidacion/` y llaman a `revalidateTag(etiqueta, { expire: 0 })`. Quedan fuera `mensajes-de-contacto` y `usuarios` (`COLECCIONES_SIN_REVALIDACION`); `src/contenido.test.ts` lo exige. Una colección o global nueva que el sitio lea debe pasar por el envoltorio.
  - Borradores: guardar un borrador de una publicación que nunca fue pública no invalida nada; publicar, despublicar o guardar un borrador sobre una publicada sí.
  - Red de seguridad: cada entrada se renueva como máximo cada 10 minutos aunque nada la invalide.
  - Fuera de Next (`pnpm semilla`) los hooks se apagan con `CONTEXTO_SIN_REVALIDACION`; toda escritura con la Local API fuera de una petición de Next debe pasarlo.
- **Tokens y estilos:** `estilos-globales.css` define los tokens de la v4 (`--azul`, `--titulo`, `--salida`…) y las clases compartidas (`contenedor`, `oculto`, `boton`, `boton-contacto`, `boton-linea`, `boton-azul`, `icono`, `marca-icono`, `oscuro`). Lo propio de cada componente va en su CSS Module.
- **Aparición al hacer scroll (S6):** usa `propsDeRevelado({ desde: 'izquierda' | 'derecha', retraso: 0.2, clase })` y esparce el resultado en el elemento (`<li {...propsDeRevelado({ retraso: 0.1 })}>`). El `ObservadorDeRevelado` del layout agrega `visible`; sin JavaScript o con `prefers-reduced-motion` todo se ve de inmediato.
- **Menú:** las secciones se enlazan como `/#ancla` para que funcionen desde cualquier página; una sección del inicio se marca como actual cuando su elemento con ese `id` cruza el centro de la pantalla.
- **Imágenes de Payload:** `next/image` con `localPatterns` en `/api/medios/file/**` (en disco o en Wasabi la ruta es la misma), formatos AVIF y WebP, y `deviceSizes` hasta 1920 px. Esos archivos salen con `Cache-Control: public, max-age=3600, stale-while-revalidate=86400` (`headers()` en `next.config.ts`): no son `immutable` porque su nombre no lleva hash. Fuentes y JavaScript van en `/_next/static`, con hash e `immutable` por defecto.

### SEO

- **URL del sitio:** `NEXT_PUBLIC_SITE_URL` (solo el origen). `next.config.ts` la valida con `leerUrlDelSitio` (`src/compartido/dominio/url-del-sitio.ts`) al compilar y al arrancar en producción; si falta o está mal escrita, falla ahí con un mensaje claro. En desarrollo y pruebas, si falta, se usa `http://localhost:3000`. El código la lee con `urlDelSitio()` (`compartido/infraestructura/url-del-sitio-configurada.ts`).
- **Metadatos:** el layout define `metadataBase`, la plantilla del título y el Open Graph del sitio (`metadatos-por-defecto.ts`). Cada página pone su canonical con una ruta relativa. Un `openGraph` de página reemplaza entero al del layout (Next no los combina): repite lo que necesites.
- **Sitemap y robots:** `src/app/sitemap.ts` (dinámico: inicio, guía, blog, publicaciones publicadas y las categorías y etiquetas que tienen publicaciones, con la fecha de su publicación más reciente) y `src/app/robots.ts` (bloquea `/admin` y `/api`, salvo `/api/medios/file/`). La lógica pura está en `src/app/mapa-y-robots.ts`.
- **Datos estructurados (JSON-LD):** se arman con funciones puras y probadas (`compartido/dominio/datos-estructurados-del-estudio.ts`, `json-ld.ts` y `modulos/blog/dominio/datos-estructurados-de-publicacion.ts`) y se dibujan con `DatosEstructurados`, que escapa `<`. El inicio publica `AccountingService` con la configuración y las sedes; cada publicación, `BlogPosting` y `BreadcrumbList`. Solo datos del panel: un campo vacío no se publica.
- **Redirecciones 301:** `src/app/redirecciones-heredadas.ts` lista las URL del sitio Laravel (verificadas en producción): `/blog/posts/:slug`, `/blog/category/:slug`, `/blog/tag/:slug`, `?page=N` → `?pagina=N`, `/guia_clientes.html` y `/login` → `/admin`. `next.config.ts` la importa, así que ese archivo no usa alias ni importa código.

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
