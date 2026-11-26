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
| T1 | S1, S4 | Resolver las decisiones abiertas (ver L6 y L10) | en línea | en curso: falta AdSense; dominio y Cloudflare pasan a T14 | — |
| T2 | S4, S8 | Crear el proyecto Next.js + Payload: TypeScript estricto, ESLint, Prettier, pnpm, `CLAUDE.md`, CI (tipos, lint, pruebas, Lighthouse CI) | en línea | pendiente | — |
| T3 | S8 | Estructura de módulos y capas, registro de bloques, ADR de arquitectura | en línea | pendiente | — |
| T4 | S2, S7, S9 | Modelo de datos en Payload: configuración, navegación, sedes, portada, cifras, áreas, planes (3 colecciones), clientes, valores, avisos, vencimientos, blog, mensajes, medios en Wasabi, usuarios con roles | en línea | pendiente | — |
| T5 | S2, S9 | Carga inicial con el contenido real del sitio actual | en línea | pendiente | — |
| T6 | S5, S6 | Estructura común: barra superior, cabecera, menú desde el panel, pie, WhatsApp flotante | en línea | pendiente | — |
| T7 | S5, S6 | Inicio: hero, quiénes somos, servicios, planes, por qué elegirnos, clientes, contacto, con sus animaciones | en línea | pendiente | — |
| T8 | S2 | Contacto: guardar el mensaje, avisar por correo y abrir WhatsApp | en línea | pendiente | — |
| T9 | S7 | Guía de clientes: avisos y vencimientos | en línea | pendiente | — |
| T10 | S1, S2 | Blog: listado, detalle, categoría y etiqueta | en línea | pendiente | — |
| T11 | S1, S3 | SEO: títulos por página, sitemap, robots, datos estructurados, canonical, redirecciones 301 | en línea | pendiente | — |
| T12 | S3 | Rendimiento: imágenes, fuentes, revalidación al publicar, caché, límites medidos | en línea | pendiente | — |
| T13 | S9 | Accesibilidad: axe en Playwright y recorrido con teclado | en línea | pendiente | — |
| T14 | S1, S3 | Infraestructura: Railway (aplicación y PostgreSQL), Wasabi, Cloudflare, respaldos, entorno de prueba | en línea | pendiente | — |
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

Siguiente paso: arrancar T2 en `sitio/`. La decisión de AdSense no lo bloquea: solo cambia si se agrega o no un script en T6.
