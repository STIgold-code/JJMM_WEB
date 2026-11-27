# Rediseño del sitio del Estudio Contable JJMM desde cero

Objetivo: reemplazar por completo el sitio público y su panel por una aplicación nueva con panel administrativo, construida con Claude Code.
Stack: Next.js + Payload CMS (una sola aplicación) · TypeScript estricto · PostgreSQL · Railway · Wasabi · Cloudflare. Runner de pruebas: Vitest (unidad) y Playwright (extremo a extremo), con Lighthouse CI.
Entrega: commits por unidad de trabajo en `main` de este mismo repositorio. El proyecto nuevo vive en la carpeta `sitio/` y, al terminar, reemplaza al resto del repositorio (T16).

## Specs

**S1. Reemplazo completo desde cero.**
Cita: «cual sería el stack ideal para hacer esto de 0, ya que vamos a reemplazarlo por completo».
Alcance: sitio público (inicio, guía de clientes, blog) y panel. El sistema Laravel actual deja de usarse.
Aceptación: el sitio nuevo sirve todas las rutas públicas actuales (`/`, `/guia`, `/blog` y sus detalles) o las redirige con 301.

**S2. Panel administrativo sin tocar código.**
Cita: «habrá un panel administrativo para hacer cambios sin necesidad de modificar el codigo».
Aceptación: todo texto, imagen, teléfono, sede, plan, área de servicio, cliente, aviso, vencimiento, publicación y enlace del menú se edita desde el panel. Ningún contenido del sitio público queda escrito en el código.

**S3. Optimización y rendimiento.**
Cita: «ten en cuenta la optimización y rendimiento».
Criterio propuesto y aceptado («dale»): Lighthouse móvil con rendimiento ≥ 90, LCP < 2,5 s, CLS < 0,1 y un límite de JavaScript por página, verificados en cada push por Lighthouse CI.

**S4. Construcción con Claude Code.**
Cita: «lo hará con claude code todo».
Consecuencia: el repositorio tiene un `CLAUDE.md` con comandos, convenciones y estas reglas. La configuración del panel vive en código (colecciones de Payload en TypeScript), nunca en clics.

**S5. Diseño aprobado.**
Citas: «nos vamos a quedar con la v4» · «conserva el hero siempre» · «no quiero un cambio de 180 grados, que quede como está pero hacerla más moderna».
Referencia: `mockup/inicio-v4.html` y su implementación en `resources/views/web/index.blade.php` de este repositorio.
Aceptación: el inicio nuevo reproduce la v4 sección por sección, con el hero de cuatro portadas sin cambios.

**S6. Animaciones del sitio actual.**
Cita: «fíjate que la pag de producción tiene animaciones».
Aceptación: se conservan los tipos de entrada medidos en producción (WOW y Revolution Slider, ver L9), hechos con CSS e `IntersectionObserver`, y se desactivan con `prefers-reduced-motion`.

**S7. Guía de clientes y SIGEFact desde el panel.**
Cita: «hay guia de clientes, y un hiperviculo a sigefact, eso va a derivar a otro lado, entiendo que esto se dará por el lado administrativo».
Aceptación:
- SIGEFact es un ítem del menú, con dirección, logo y pestaña nueva editables.
- La guía es una página interna. Sus avisos (cierre tributario, cierre de planilla) y sus vencimientos se editan como registros en texto, no como imágenes.

**S8. Reglas de buenas prácticas.**
Cita: «donde va a existir reglas de buenas practicas de programación, nada de god Componets, principios solid».
Aceptación: se cumplen las reglas de la sección «Reglas de ingeniería» y el lint y la revisión las verifican en cada cambio.

**S9. Restricciones de contenido vigentes** (de `PRODUCT.md`, no nuevas):
- Solo se publican celulares; nunca teléfonos fijos.
- Los planes muestran «Consultar»; no se publican montos.
- No se inventan testimonios, cifras, fotos ni colegiaturas.
- WCAG 2.1 AA.
- Español neutro con tuteo.

## Reglas de ingeniería (S8)

Criterios propuestos para cumplir S8. Cada uno se puede verificar.

**Arquitectura**
- **Arquitectura que grita, organizada por módulos de negocio:** `src/modulos/{portada,nosotros,servicios,planes,sedes,clientes,avisos,vencimientos,blog,contacto,navegacion}`.
- **Cada módulo tiene tres capas:**
  - `dominio/`: tipos y reglas puras, sin Payload ni React.
  - `aplicacion/`: casos de uso, que dependen de interfaces.
  - `infraestructura/`: adaptadores de Payload.
- **Interfaz de usuario:** vive en `src/app` y en los `componentes/` de cada módulo.
- **Dependencias hacia adentro:** la interfaz de usuario y los casos de uso dependen de interfaces de repositorio, nunca de Payload directamente. Se cambia el adaptador sin tocar la interfaz ni el dominio.

**Componentes (nada de God Components)**
- **Contenedor y presentación separados.** Los contenedores, que son Server Components, obtienen y preparan los datos. Los componentes de presentación solo reciben props y dibujan.
- **Una responsabilidad por componente.** Ningún componente obtiene datos, los transforma y dibuja más de una sección a la vez.
- **Límites de tamaño:** 150 líneas por componente y 40 por función, controlados con `max-lines` y `max-lines-per-function` de ESLint. Superarlos exige dividir.
- **Interactividad mínima.** `"use client"` solo en las piezas interactivas: slider, menú móvil, rueda con pestañas, selector de plan y formulario.

**SOLID**
- **S (responsabilidad única):** un motivo de cambio por archivo; las reglas de negocio no viven en los componentes.
- **O (abierto/cerrado):** las secciones de página son bloques de Payload con un registro `tipo → componente`. Un bloque nuevo se agrega sin modificar los existentes.
- **L (sustitución de Liskov):** todos los bloques cumplen la misma interfaz de props base y son intercambiables en el registro.
- **I (segregación de interfaces):** props e interfaces chicas; ningún componente recibe un objeto entero para usar un campo.
- **D (inversión de dependencias):** los casos de uso reciben sus repositorios por parámetro, lo que permite probarlos con dobles sin base de datos.

**Calidad**
- **Tipado:** TypeScript `strict`, sin `any` ni `as` sin justificar.
- **Lint y formato:** ESLint y Prettier.
- **Estilos:** CSS Modules con los tokens de la v4 como variables CSS.
- **Nombres:** en español; archivos en kebab-case.
- **Pruebas primero:** las reglas de dominio (por ejemplo, la fecha de vencimiento por dígito de RUC) se escriben primero como prueba que falla.
- **Herramientas de prueba:** Vitest para dominio y aplicación; Playwright para los flujos clave; axe para accesibilidad; Lighthouse CI para los límites de S3.
- **Datos normalizados:** sin JSON genéricos. Por ejemplo, la matriz de planes son tres colecciones: plan, característica e inclusión.
- **Commits:** prefijos conventional con descripción en español, con la cuenta personal de Gian.
- **Bloqueo en CI:** no se integra nada con errores de tipos, lint o pruebas.

## Tasks

| ID | Specs | Tarea | Ruta | Estado | Commit |
|---|---|---|---|---|---|
| T1 | S1, S4 | Resolver las decisiones abiertas (ver L6, L10 y L11) | en línea | hecha; dominio y Cloudflare pasan a T14 | — |
| T2 | S4, S8 | Crear el proyecto Next.js + Payload: TypeScript estricto, ESLint, Prettier, pnpm, `CLAUDE.md`, CI (tipos, lint, pruebas, Lighthouse CI) | delegada (contexto largo) | hecha; Playwright y Lighthouse CI solo corren en CI | `24a8c91` |
| T3 | S8 | Estructura de módulos y capas, registro de bloques, ADR de arquitectura | delegada (contexto largo) | hecha | ver L13 |
| T4 | S2, S7, S9 | Modelo de datos en Payload: configuración, navegación, sedes, portada, cifras, áreas, planes (3 colecciones), clientes, valores, avisos, vencimientos, blog, mensajes, medios en Wasabi, usuarios con roles | delegada (contexto largo) | hecha; verificación de seguridad independiente: PASS | ver L14 |
| T5 | S2, S9 | Carga inicial con el contenido real del sitio actual | delegada (contexto largo) | hecha; falta ejecutarla contra PostgreSQL | ver L15 |
| T6 | S5, S6 | Estructura común: barra superior, cabecera, menú desde el panel, pie, WhatsApp flotante | delegada (contexto largo) | hecha; falta revisión visual en navegador | ver L16 |
| T7 | S5, S6 | Inicio: hero, quiénes somos, servicios, planes, por qué elegirnos, clientes, contacto, con sus animaciones | delegada (paralela con T9 y T10) | hecha; falta revisión visual en navegador | ver L19 |
| T8 | S2 | Contacto: guardar el mensaje, avisar por correo y abrir WhatsApp | delegada (junto con T7) | hecha salvo el aviso por correo (falta proveedor y casilla, L6) | ver L19 |
| T9 | S7 | Guía de clientes: avisos y vencimientos | delegada (paralela con T7+T8 y T10) | hecha; consulta por RUC sin datos hasta cargar el cronograma oficial | ver L18 |
| T10 | S1, S2 | Blog: listado, detalle, categoría y etiqueta | delegada (paralela con T7+T8 y T9) | hecha; redirecciones de URL antiguas pasan a T11 | ver L17 |
| T11 | S1, S3 | SEO: títulos por página, sitemap, robots, datos estructurados, canonical, redirecciones 301 | delegada (contexto largo) | hecha; falta verificar en navegador (CI detenida) | ver L20 |
| T12 | S3 | Rendimiento: imágenes, fuentes, revalidación al publicar, caché, límites medidos | delegada (contexto largo) + verificación independiente | hecha; límites de Lighthouse sin medir (CI detenida) | ver L21 |
| T13 | S9 | Accesibilidad: axe en Playwright y recorrido con teclado | en línea | pendiente | — |
| T14 | S1, S3 | Infraestructura: Railway (aplicación y PostgreSQL), Wasabi, Cloudflare, respaldos, entorno de prueba | en línea | en curso: Railway en marcha; faltan Wasabi, Cloudflare, dominio y respaldos | ver L22 |
| T15 | S1 | Salida a producción: cambio de DNS con aprobación de Gian y verificación | en línea | pendiente | — |
| T16 | S1 | Borrar el sitio anterior del repositorio y dejar solo el proyecto nuevo, con confirmación explícita de Gian antes de borrar | en línea | pendiente | — |

Ruta: todas en línea por defecto. Se delega solo si se cumple un disparador (unidades paralelas independientes o contexto largo), y queda registrado aquí.

## Log

**L1** (26/11/2026), pedido original: «ok, ahora que ya sabes lo que quiero, quiero que como profesional senior me digas, cual sería el stack ideal para hacer esto de 0, ya que vamos a reemplazarlo por completo, y habrá un panel administrativo para hacer cambios sin necesidad de modificar el codigo»

**L2** (26/11/2026): «lo hará con claude code todo, así que dime tú, ten en cuenta la optimización y rendimiento»
Decisión: Next.js + Payload en una sola aplicación, sobre PostgreSQL, Railway, Wasabi y Cloudflare.
Motivos:
- La configuración del panel es código y Claude Code la puede crear y revisar.
- El tipado de punta a punta detecta errores del agente al compilar.
- Una sola aplicación para desplegar y mantener.
Descartadas:
- Astro con CMS aparte: dos despliegues para ahorrar unos 70 KB.
- Laravel con Filament: sin tipado de punta a punta; el blog actual tiene un solo artículo real.

**L3** (26/11/2026): «dale, ahora si te das cuenta hay guia de clientes, y un hiperviculo a sigefact, eso va a derivar a otro lado, entiendo que esto se dará por el lado administrativo»
Verificado en el código:
- SIGEFact es externo (`https://sigefact.pse.pe/`).
- La guía es interna (`/guia`): tres imágenes (cierre tributario, cierre de planilla y vencimientos tributarios).
- La guía publica `recursoshumanos@jjmm.com.pe`, que no figura en `PRODUCT.md`.

**L4** (26/11/2026): «arma un plan de trabajo, un odd, donde va a existir reglas de buenas practicas de programación, nada de god Componets, principios solid, alguna duda?»
Se crea este documento.

**L5**, decisiones de diseño previas:
- «nos vamos a quedar con la v4»
- «conserva el hero siempre»
- «no quiero un cambio de 180 grados, que quede como está pero hacerla más moderna»

**L6**, decisiones abiertas para T1:
- ¿Repositorio nuevo o este mismo?
- Comentarios del blog: ¿se mantienen?
- AdSense: ¿se mantiene?
- Dominio, DNS y Cloudflare.
- Casilla que recibe los mensajes del formulario.

**L7**, contenido a confirmar con el estudio. No bloquea el desarrollo porque se carga desde el panel:
- Sede Miraflores.
- Celular por sede y cuáles tienen WhatsApp.
- Vigencia de la asesoría gratuita.
- Nombres de `client-logo2` y `client-logo6`.
- Vigencia de `recursoshumanos@jjmm.com.pe`.
- Cronograma oficial de SUNAT por dígito de RUC.

**L8**, entrega: Gian sube a `main` lo que está implementado y verificado (regla vigente) y los commits van con su cuenta personal. Si el avance supera unas 400 líneas por entrega, se evalúa dividir en PR encadenados.

**L9**, animaciones medidas en producción con Playwright el 26/11/2026:
- WOW:
  - barra superior: `fadeInDown`;
  - slider: `bounceIn`, 0,6 s;
  - banda: `fadeInLeft`;
  - texto: `fadeInRight`, 1 s;
  - círculos: `fadeInUp`, 0,2 / 0,4 / 0,6 / 0,8 s;
  - títulos, columnas de planes, clientes y pie: `fadeInUp`.
- Revolution Slider:
  - 9 s por portada;
  - transiciones: `slideleft`, `fade`, `papercut` y `slidedown`;
  - textos: `lfl`, `lft` y `lfr` escalonados entre 1000 y 2500 ms, y `randomrotate`.

**L10** (26/11/2026), respuestas de Gian a las decisiones abiertas:
- Repositorio: «este mismo repo pero en otra carpeta, luego borrarás todo y solo dejarás esta». El proyecto va en `sitio/`; el borrado final es T16 y requiere su confirmación explícita.
- Comentarios del blog: «Quitarlos». No se migran ni se implementan.
- AdSense: «que es AdSense?». Sigue abierta; se explicó qué es y se espera su decisión.
- Dominio y Cloudflare: «luego vemos eso». Se decide en T14.

**L11** (26/11/2026): «lo quitamos, al final, luego se puede agregar, no?»
Decisión: el sitio nuevo sale sin AdSense. Si se decide agregarlo, es una tarea chica: un campo en la configuración del sitio (ID de cliente y activo) y el script cargado con `next/script` en modo diferido. No se deja preparado de antemano.

**L12** (27/11/2026): «dale arranca desde ya todo directo a main»
T2 terminada. Gian confirmó los archivos en `24a8c91`.
Versiones fijas: Next 16.4.6, React 19.2.9, Payload 3.94.2 (adaptadores Postgres y S3), TypeScript 5.9.3, ESLint 10.15.0, Vitest 4.0.18, Playwright 1.63.0, Lighthouse CI 0.16.1.
Verificado en local: `typecheck`, `lint`, `format:check`, `test` (9 pruebas), `generate:types` y `build`, sin base de datos.
Pendiente de la CI: Playwright y Lighthouse CI necesitan un servidor, así que corren solo en el job `extremo-a-extremo` con Postgres propio.
Para las tareas siguientes:
- Node local 24.13.0 está por debajo del mínimo de Payload (24.22.3); conviene actualizarlo.
- Railway expone `DATABASE_URL` y el proyecto usa `DATABASE_URI`: se mapea en T14.
- Wasabi queda desactivado si faltan las variables `WASABI_*`; `generate:importmap` usa valores ficticios para que el panel funcione con Wasabi activo.
- En producción y CI el esquema necesita migraciones (T4).
- `Users` y `Media` conservan los nombres de la plantilla; T3/T4 los mueven a módulos en español.
- Presupuesto de JavaScript del inicio: 170 KB transferidos.
- Sin Tailwind: estilos con CSS Modules, como dice la sección de reglas.

**L13** (27/11/2026), T3 terminada:
- Colecciones movidas: `usuarios` (`src/modulos/usuarios/infraestructura/`) y `medios` (`src/compartido/infraestructura/`, con `staticDir: 'media'`).
- Registro de bloques tipado y `RenderizadorDeBloques`; un tipo de bloque desconocido lanza `TipoDeBloqueDesconocidoError` en lugar de omitirse en silencio.
- Límites de capas en ESLint (`no-restricted-imports`) con 22 pruebas que lo demuestran.
- ADR `sitio/docs/adr/0001-arquitectura.md`; el patrón de repositorio queda como ejemplo en el ADR hasta el primer caso de uso real en T4.
- Verificado: `typecheck`, `lint`, `format:check`, `test` (36 pruebas, RED observado antes), `generate:types`, `build`.

**L14** (27/11/2026), T4 terminada:
- Modelo completo en Payload: global `pagina-de-inicio` con 7 bloques, `guia-de-clientes`, `pagina-del-blog`, `navegacion`, `configuracion-del-sitio` y 17 colecciones (ver `sitio/CLAUDE.md`, «Modelo de datos»).
- Reglas de dominio con prueba primero: celular, slug, destino de enlace, roles, texto resaltado, montos prohibidos en planes, áreas P1–P9 y rueda, RUC y cronograma SUNAT.
- Migración inicial `src/migrations/20261127_140109_inicial.ts`, generada sin base de datos; la CI la aplica antes de Playwright.
- Verificado: `typecheck`, `lint`, `format:check`, `test` (129 pruebas), `generate:types`, `generate:importmap`, `build`.
- Riesgo: punto 2 (permisos y usuarios). Verificación de seguridad independiente: PASS, sin bloqueos. Se aplicó su observación de `unlock: soloAdministradores` en `usuarios`.
- Observaciones pendientes, sin bloqueo:
  - anti-spam y límite de envíos del formulario (T8);
  - impedir que se elimine o degrade el último administrador;
  - pruebas de integración del descarte del campo `rol` y del estado `nuevo` forzado.

**L15** (27/11/2026), T5 terminada:
- Semilla idempotente en `sitio/src/semilla/` (`pnpm semilla`). Carga:
  - 21 medios, 2 sedes y 9 áreas;
  - 4 planes, 22 características y 88 inclusiones;
  - 6 valores, 11 clientes, 3 avisos y 14 vencimientos;
  - configuración, navegación con SIGEFact, la página de inicio con sus 7 secciones, y las páginas de la guía y del blog.
- Queda sin cargar:
  - el cronograma SUNAT, porque falta el oficial;
  - las publicaciones del blog, que viven en la base de producción;
  - los usuarios, salvo que se definan `SEMILLA_ADMIN_*`.
- Verificado con 43 pruebas nuevas, sin base de datos: reglas de S9 sobre todos los datos y el cargador con un doble en memoria; también `typecheck`, `lint`, `format:check` y `build`. La ejecución real queda pendiente.
- Falta en el modelo, para revisar en T9:
  - los avisos no tienen campo de nota ni grupos de documentos; «Documentos para análisis» quedó como un aviso aparte;
  - no hay campo para `elegirnos.webp`.
- A confirmar con el estudio, además de lo de L7:
  - qué celular corresponde a cada sede;
  - la fecha de CONAFOVICER, SENCICO y OSCE;
  - los títulos que se agregaron porque el sitio actual no los tiene.

**L16** (27/11/2026), T6 terminada:
- Estructura común con datos del panel: barra superior, cabecera compacta con seguimiento de sección, menú móvil accesible (foco atrapado, Escape, `inert`), pie, WhatsApp flotante y botón para subir.
- Tokens de la v4 en `src/app/(frontend)/estilos-globales.css`, fuentes locales con `next/font/local` y utilidad de revelado al hacer scroll (`propsDeRevelado`) que usa T7.
- Datos públicos con `overrideAccess: false`. El layout queda en `force-dynamic` hasta T12, para que el build no necesite base de datos. Se corrigió `images.localPatterns` a `/api/medios/file/**`.
- Verificado: `typecheck`, `lint`, `format:check`, `test` (230 pruebas, RED observado antes) y `build`.
- Sin revisar todavía: el resultado visual en un navegador y los hooks de cliente. Los cubre Playwright con datos cargados.
- Abierto: etiquetas para lectores de pantalla, nombres de redes y el sufijo «por WhatsApp» quedaron en código. Si se quieren editables, se agrega un campo en la configuración.

Siguiente paso: T7 + T8, T9 y T10 en paralelo, cada una con superficies de edición disjuntas (disparador de escritores paralelos).

**L17** (27/11/2026), T10 terminada:
- Rutas: `/blog` (9 por página con `?pagina=`), `/blog/[slug]`, `/blog/categoria/[slug]` y `/blog/etiqueta/[slug]`, con 404 para borradores, slugs inválidos y páginas fuera de rango.
- Solo publicaciones publicadas: `overrideAccess: false`, `draft: false` y `_status: published` explícito, con una prueba que lo exige.
- El contenido enriquecido se dibuja en `src/app/(frontend)/blog/[slug]/contenido-enriquecido.tsx`, porque `componentes/` no puede importar `@payloadcms/*`.
- Verificado: `typecheck`, `lint`, `test` (396 pruebas en total, 66 del blog, RED observado antes) y `build`.
- Riesgo: punto 6. Los filtros por relación y la exclusión de borradores solo tienen pruebas unitarias hasta que Playwright corra en CI.
- Para T11:
  - redirecciones 301 de las URL antiguas (supuestas: `/posts/:slug`, `/category/:slug`, `/tag/:slug`, `?page=`), a confirmar contra producción porque `routes/web.php` no está en el repositorio;
  - `metadataBase` en el layout;
  - `/blog` y un artículo en Lighthouse CI.

**L18** (27/11/2026), T9 terminada:
- `/guia` muestra:
  - un encabezado con datos del panel;
  - los avisos como tarjetas con su correo en `mailto:`;
  - los vencimientos agrupados en mensuales y anuales;
  - el cronograma SUNAT con consulta por RUC, que es la única isla de cliente. La tabla de los 10 dígitos funciona sin JavaScript.
- Sin cronograma cargado, muestra «Todavía no publicamos el cronograma de SUNAT de {año}. Consulta tu fecha de vencimiento con el estudio.».
- No se cambió el modelo. Si se quiere agrupar «Documentos para análisis» dentro de «Cierre tributario», hace falta un arreglo de grupos en `avisos-para-clientes` y una migración.
- Verificado: `typecheck`, `lint`, `test` (RED observado antes) y `build`.
- La CI ahora corre `pnpm semilla` después de las migraciones. Sin eso, `/guia` y el inicio daban 404 en las pruebas de extremo a extremo con la base vacía.

**L19** (27/11/2026), T7 y T8 terminadas:
- El inicio se arma desde `pagina-de-inicio` con el registro de bloques: carrusel con las 4 transiciones, sello y lista escalonada; quiénes somos con contadores en CSS puro; pestañas 3×3 sincronizadas con la rueda; matriz de planes con selector móvil; por qué elegirnos; clientes; contacto.
- Islas de cliente: carrusel, pestañas con rueda, tabla de planes, pista de clientes y formulario.
- Desvíos de la v4:
  - «Por qué elegirnos» sin foto de fondo, porque el modelo no tiene campo;
  - «Ver mapa» abre el enlace en lugar de incrustar el mapa;
  - el formulario suma celular obligatorio y correo opcional;
  - borde de campos más oscuro para cumplir el contraste 3:1.
- Contacto:
  - validación compartida entre cliente y servidor;
  - el mensaje se guarda con una Server Action y se abre WhatsApp;
  - anti-spam: honeypot, mínimo de 3 s y 5 envíos por IP cada 10 minutos en memoria (vale para una sola instancia);
  - aviso por correo con un puerto `NotificadorDeMensajes` sin implementar.
- Verificación de unión de las tres unidades paralelas: `test` (448 pruebas), `format:check`, `lint`, `typecheck` y `build` pasan con el árbol completo.
- Riesgo: punto 6. El comportamiento en navegador solo lo cubre Playwright en CI.

**L20** (27/11/2026), CI detenida y T11 terminada:
- GitHub Actions no inicia ningún job: «recent account payments have failed or your spending limit needs to be increased». Playwright y Lighthouse CI nunca corrieron. Lo resuelve Gian en la facturación de la cuenta.
- Limitador del formulario endurecido tras la revisión automática de seguridad (`7c71054`, `d56a520`, `069742b`):
  - tope estricto de claves que falla cerrado (decisión: los canales directos siguen disponibles);
  - IP validada con `node:net`;
  - IPv6 agrupada por /64.
- T11, URL antiguas verificadas en producción con GET de solo lectura: `/blog/posts/:slug`, `/blog/category/:slug`, `/blog/tag/:slug`, `?page=N`, `/guia_clientes.html` (enlazada, da 404) y `/login`. Las 301 están en `src/app/redirecciones-heredadas.ts`, sin bucles.
- `NEXT_PUBLIC_SITE_URL` es obligatoria y se valida en producción. `metadataBase`, canonical y Open Graph están en todas las páginas.
- JSON-LD: `AccountingService` en el inicio y `BlogPosting` + `BreadcrumbList` en cada artículo, solo con datos del panel.
- `sitemap.xml` es dinámico y solo incluye lo publicado. `robots.txt` bloquea `/admin` y `/api`, salvo los archivos de medios.
- Lighthouse CI suma `/guia` y `/blog`.
- Verificado: `typecheck`, `lint`, `format:check`, `test` (496 pruebas, RED observado antes) y `build`.
- Riesgo:
  - punto 3: cambió la forma de `metadatosPorDefecto` y `DetalleDePublicacion`; todos los usos están actualizados;
  - punto 6: las 301 y las respuestas de sitemap y robots solo las cubre Playwright.

**L21** (27/11/2026), T12 terminada:
- El HTML sigue dinámico, así el build no necesita base de datos. Cada lectura de Payload se guarda con `unstable_cache` y etiquetas (`coleccion:`, `global:`, `documento:publicaciones:`), con renovación de respaldo cada 10 minutos.
- Ganchos de revalidación asignados en un solo lugar (`src/contenido.ts`):
  - publicar, despublicar y borrar revalidan;
  - un borrador de algo nunca publicado no revalida;
  - la semilla los desactiva por contexto.
- Medios con `max-age=3600, stale-while-revalidate=86400`; imágenes en AVIF/WebP. Decisión documentada en ADR `docs/adr/0002-cache-y-revalidacion.md`.
- Riesgo: punto 4 (caché y concurrencia). Verificación independiente con un bloqueo: el detalle de una publicación no se invalidaba al renombrar o despublicar otra publicación que enlaza en su contenido. Corregido en `etiquetas-del-blog.ts`, con prueba (RED observado antes).
- Advertencias sin corregir:
  - una ventana de milisegundos entre la invalidación y el commit;
  - la caché es por instancia, así que con varias réplicas en Railway hace falta un `cacheHandler` compartido;
  - guardar un borrador sobre algo publicado revalida de más.
- Verificado: `typecheck`, `lint`, `format:check`, `test` (545 pruebas) y `build` del escritor.

**L22** (27/11/2026): «amiwo pon todo en railway» y «ya está en publico, hazlo»
- Railway (cuenta `code@stigold.com`), proyecto `jjmm-web`:
  - servicio `web` con Railpack y Node 24.22.3;
  - PostgreSQL;
  - volumen en `/app/media` para los archivos del panel, sin Wasabi por ahora;
  - dominio `https://web-production-bc6921c6.up.railway.app`.
- Variables: `DATABASE_URI` (referencia a Postgres), `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, `ENCABEZADO_IP_CLIENTE` y `RAILPACK_NODE_VERSION`.
- Despliegue con `railway up sitio --path-as-root --service web`. El `preDeployCommand` de `railway.json` no se aplicó, así que las migraciones pasan a `prodMigrations` (documentado por Payload): se aplican al iniciar el servidor en producción.
- Las 21 imágenes de la carga inicial se copiaron a `sitio/semilla/imagenes/`. La carga ya no depende del sitio anterior, lo que deja libre T16.
- La migración y `pnpm semilla` se corrieron dentro del contenedor. Comprobado con peticiones reales: `/`, `/guia`, `/blog` y `/admin` responden 200, y `/blog/posts/:slug` redirige con 301.
- Error propio: se listaron las variables con `--kv` y se vieron los valores. `PAYLOAD_SECRET` se rotó; la contraseña de PostgreSQL quedó vista en el historial de la sesión (solo sirve dentro de la red interna de Railway).
- Gian hizo público el repositorio y la CI empezó a correr. Se revisó el historial: no hay credenciales ni `.env` versionados.
- Primera corrida de Playwright: 45 de 48 pruebas. Dos causas corregidas en `dbc76c7`:
  - la tabla de planes repetía el nombre accesible de su sección;
  - axe medía el contraste en medio del fundido de entrada.
- Segunda corrida: 48 de 48. Lighthouse en móvil cumple rendimiento, CLS y peso de JavaScript, y falla solo el LCP: 3,35 s en el inicio y 2,89 s en `/guia` y `/blog`, contra 2,5 s. En análisis.
