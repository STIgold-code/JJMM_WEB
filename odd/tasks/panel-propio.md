# Panel administrativo propio del Estudio Contable JJMM

Objetivo: reemplazar el `/admin` de Payload como herramienta del cliente por un panel propio en Next.js; Payload queda solo como motor.
Rama y entrega: commits por unidad de trabajo en `main`; Railway despliega con cada push. Runner de pruebas: Vitest y Playwright (`pnpm -C sitio test`, `pnpm -C sitio test:e2e` en CI).
Estrategia de entrega: por fases publicables (ver S4). Nada se construye sin la aprobación de la maqueta.

## Specs

Texto del encargo, literal (L1). Cada bloque es una especificación.

**S0. Principio.**
«En este proyecto Payload es solo el motor: base de datos, sesiones, permisos, subida de archivos e idiomas. El panel que usa el cliente NO es el /admin de Payload: es un panel propio en Next.js, diseñado para las tareas reales del negocio. Nunca debe verse ni comportarse como Payload: nada de su cabecera con migas e «Idioma», listados con «Columnas/Filtros», «Editar | API», franja de «Última modificación» ni campos de subida «Crear o Elegir de los existentes».»

**S1. Arquitectura.**
- «Panel en su propio grupo de rutas (por ejemplo `src/app/(panel)/panel`), con su layout, su ingreso y su menú.»
- «Componentes con shadcn/ui + Tailwind, usados solo dentro del panel; el sitio público conserva su propio CSS.»
- «Lecturas con la API local de Payload desde componentes de servidor. Escrituras con server actions que autentican con `payload.auth({ headers })` y llaman a la API local con `overrideAccess: false` y el `user`, para que rijan los permisos de las colecciones. Ninguna acción escribe sin sesión.»
- «El /admin de Payload queda oculto y solo para el desarrollador, como respaldo.»
- «Cada cambio de esquema se hace en tres lugares: la colección de Payload (con su migración y `generate:types`), el formulario del panel y sus pruebas.»

**S2. Diseño.**
- «Paleta tomada del logo del cliente: un color de marca para la acción principal, un neutro teñido del color dominante para superficies y bordes, y colores de estado con significado fijo (pendiente, en curso, listo, error).»
- «Tema claro por defecto, salvo que el uso real indique otra cosa.»
- «Una tipografía de interfaz legible para todo; la tipografía de la marca solo en el nombre y los títulos principales.»
- «Menú lateral con la marca arriba, secciones agrupadas por tarea, contadores de pendientes y el usuario abajo. Barra superior con la ruta» (sin buscador en la barra: ver L4). Los buscadores de cada listado (S3) se mantienen.

**S3. Patrones de pantalla.**
- «Inicio: saludo según la hora y la fecha; tarjetas de «Requiere atención» que toman color solo si hay algo pendiente; cifras del negocio con ícono; tabla de pendientes con acción «Ver»; lista de lo que falta completar con su avance.»
- «Listados: miniatura, nombre con dato secundario, etiquetas de estado, filtros segmentados con conteo, buscador, interruptores en la fila para cambios rápidos (por ejemplo, visible) y orden por arrastre cuando importe el orden.»
- «Edición: secciones en una sola página (no pestañas para todo); campos bilingües uno al lado del otro; vista previa de cómo se verá publicado; botón «Guardar cambios» activo solo con cambios y aviso de «Cambios sin guardar».»
- «Detalles rápidos (como un mensaje recibido) en un panel lateral, no en una página nueva. Confirmaciones de acciones destructivas en un diálogo propio.»
- «Avisos breves al guardar. Estados vacíos que expliquen qué va a aparecer ahí.»

**S4. Forma de trabajo.**
1. «Antes de programar, maqueta HTML navegable de las pantallas principales, con datos reales del cliente donde existan y los de ejemplo marcados como tales. No se construye nada sin su aprobación.»
2. «Construcción por fases publicables: base y escritorio; la tarea de uso diario; el catálogo principal; el resto de secciones.»
3. «Cada pantalla se revisa con capturas en escritorio y celular antes de entregarla, y lleva pruebas de que sin sesión no se puede escribir.»
4. «Textos del panel en español neutral, sin voseo.»

Supuestos, marcados como tales (no son parte del encargo):
- El sitio hoy tiene un solo idioma, así que «campos bilingües uno al lado del otro» no aplica a ninguna pantalla actual. Se pregunta en la revisión de la maqueta.
- «La tarea de uso diario» se interpreta como atender los mensajes de contacto, y «el catálogo principal» como los planes y las áreas de servicio. Se confirma con la maqueta.

## Tasks

| ID | Specs | Tarea | Ruta | Estado | Commit |
|---|---|---|---|---|---|
| P1 | S2, S3, S4.1 | Maqueta HTML navegable de las pantallas principales, con datos reales | delegada (contexto largo de la sesión) | hecha: `mockup/panel/index.html` | ver L3 |
| P2 | S4.1 | Aprobación de la maqueta por Gian | — | aprobada (L4) | — |
| P3 | S1, S2, S4.2 | Fase 1: base (rutas, ingreso, layout, menú, shadcn/ui + Tailwind acotados al panel) e inicio | delegada (respaldo de contexto: sesión larga) + verificador independiente (riesgo 2: sesión y permisos; riesgo 5: dependencias) | hecha y verificada en producción (L5) | `45d9675`, `2d828a6`, `563c0b5`, `7ca09f6` |
| P4 | S1, S3, S4.2 | Fase 2: la tarea de uso diario (mensajes de contacto) | delegada (respaldo de contexto) + verificador (riesgo 2: primeras escrituras del panel) | hecha y verificada en producción (L6) | `46b5582` |
| P5 | S1, S3, S4.2 | Fase 3: el catálogo principal (planes) | delegada (respaldo de contexto) + verificador (riesgo 1: migración; riesgo 2: escrituras; riesgo 3: tabla pública) | hecha y verificada en producción (L7) | `8b6ef1e` |
| P6 | S1, S3, S4.2 | Fase 4: el resto de secciones, por pantalla: sedes, página de inicio, guía de clientes, publicaciones, imágenes, usuarios, mi cuenta | delegada por pantalla (respaldo de contexto) + verificador por escrituras | hechas y en producción: sedes, usuarios, mi cuenta, guía, imágenes, página de inicio (L8–L12); publicaciones espera la maqueta L13 | `7154a08`, `90d4f85`, `d36c598`, `c0f0e19`, `a82bf8f` |
| P6b | S4.1 | Maqueta de lo que no estaba en la aprobada: áreas, características, valores, clientes, datos del estudio, menú, secciones del inicio, publicaciones | delegada (respaldo de contexto) | hecha (L13); esperando la aprobación de Gian | — |
| P7 | S0, S1 | Ocultar el `/admin` de Payload y dejarlo solo para el desarrollador | por definir | bloqueada por P3 | — |

## Log

**L1** (27/11/2026), pedido original: Gian pegó el texto «Panel administrativo con Payload» sin otro comentario. Queda citado completo y literal en S0 a S4.

**L2** (27/11/2026), contexto:
- Ese mismo día se había rediseñado el `/admin` de Payload (commits `6d8e67c` a `78ef095`): español, marca, inicio propio, ojo de contraseña. Con este encargo, ese `/admin` pasa a ser el respaldo del desarrollador (S1) y deja de ser lo que usa el cliente.
- Decisión anterior que cambia: el proyecto no usaba Tailwind. Ahora entra, junto con shadcn/ui, solo dentro del panel (S1); el sitio público sigue con CSS Modules.
- Riesgo a revisar en P3: seguridad (punto 2). Las escrituras pasan a server actions propias; cada una lleva prueba de que sin sesión no escribe (S4.3).

**L3** (27/11/2026), P1 terminada:
- Maqueta en `mockup/panel/` (entrada `index.html`), HTML, CSS y JS propios, sin red. 15 pantallas:
  - ingreso e inicio;
  - mensajes, con panel lateral y diálogo de borrado;
  - planes y su edición con vista previa; sedes y su edición;
  - página de inicio y portadas;
  - guía de clientes, publicaciones, imágenes, usuarios y mi cuenta.
- Un botón «Maqueta» cambia de escenario: administrador o editor, con o sin pendientes, con o sin mensajes, blog vacío, error de ingreso.
- Diseño:
  - color de marca `#004c8c`, tomado del logo (8,70:1 con blanco) y neutros teñidos de azul;
  - estados con significado fijo: pendiente (ámbar), en curso (violeta), listo (verde), error (rojo);
  - Open Sans en toda la interfaz y Oswald solo en el nombre del estudio y los títulos de página;
  - variables CSS con los nombres de los tokens de shadcn/ui.
- Datos reales de la semilla: planes con su matriz, sedes, secciones del inicio, avisos, vencimientos e imágenes. Van marcados «Ejemplo» los mensajes, las publicaciones, los usuarios y el nombre de la cuenta.
- No incluido (visible como deshabilitado):
  - editor de publicaciones;
  - portadas 2 a 4;
  - las demás secciones del inicio;
  - Áreas de servicio, Clientes, Datos del estudio y Menú del sitio.
- Verificado con capturas a 1440×900, 1024×768 y 390×844: sin errores de JavaScript ni desborde, y las pruebas de interacción pasan. El orquestador revisó inicio, mensajes y edición de plan, y corrigió la marca del menú, que partía el nombre en dos líneas.
- Sin verificar: lector de pantalla real, arrastrar archivos desde el escritorio, Firefox y Safari.
- Preguntas abiertas para Gian:
  - a) ¿se quita lo de campos bilingües? El sitio tiene un solo idioma;
  - b) ¿la tarea de uso diario es atender los mensajes?;
  - c) ¿el catálogo principal son los planes, junto con las áreas de servicio?;
  - d) los planes no tienen campo «visible»: el interruptor de la fila exige un cambio de esquema;
  - e) hoy solo el administrador borra mensajes: ¿también los editores?;
  - f) avisos, vencimientos y cronograma SUNAT van en una sola pantalla «Guía de clientes».

**L4** (27/11/2026), Gian sobre la maqueta, literal: «aprobado pero el buscador está demás».
- Se quitó el buscador de la barra superior (maqueta y S2). Interpretación del orquestador: se refiere al buscador global de la barra; los buscadores de los listados son parte de S3 y se mantienen.
- Gian no respondió las preguntas de L3. Al aprobar la maqueta quedan como se muestran en ella, y se le informa:
  - a) sin campos bilingües mientras el sitio tenga un solo idioma;
  - b) la tarea de uso diario son los mensajes de contacto (P4);
  - c) el catálogo principal son los planes (P5); las áreas de servicio van en P6;
  - d) el interruptor «visible» de los planes se construye, con su cambio de esquema, en P5;
  - e) solo el administrador borra mensajes, como hoy;
  - f) una sola pantalla «Guía de clientes».

**L5** (27/11/2026), P3 terminada:
- Panel en `/panel`: ingreso propio (misma cookie que `/admin`, mismo bloqueo por intentos), guardia `exigirSesion()` en el layout y en cada página, menú por rol, barra con la ruta e inicio con cifras reales. Código en `sitio/src/panel/` y `sitio/src/app/(panel)/`. Tailwind v4 y shadcn/ui solo en el panel.
- Verificador independiente: sin bloqueos. `cn@0.5.2` es el paquete oficial de shadcn (comprobado en el registro de npm); queda con versión fija.
- Avisos anotados, anteriores a este cambio: el login de Payload delata por tiempo si un correo existe; no hay límite de intentos por IP; `auth.cookies.secure` sin definir.
- Dos fallos encontrados al desplegar y corregidos: la compilación generaba `/panel/ingreso` y necesitaba la base (`563c0b5`, `force-dynamic`); el logotipo daba 400 en `next/image` y el menú recortaba «Próximamente» (`7ca09f6`).
- Verificado en producción con capturas a 1440×900 y 390×844: sin sesión redirige al ingreso; contraseña incorrecta muestra el mensaje único; ingreso y salida funcionan; inicio y cajón del celular sin desborde ni errores; el sitio público y `/admin` responden 200.
- Diferencias con la maqueta: los «Ver» abren `/admin` hasta P4–P6; «Lo que falta completar» solo muestra lo calculable (cronograma SUNAT, celular por sede, publicaciones); la tabla de pendientes en celular oculta una columna en vez de apilar tarjetas.
- Sin verificar: la vista de un editor (no existe la cuenta) y las pruebas de Playwright nuevas, que corren en CI.
- P7 no puede entrar antes de que P4–P6 reemplacen los enlaces a `/admin`.

**L6** (27/11/2026), P4 terminada (`46b5582` y el commit de dependencias anterior):
- `/panel/mensajes`: filtros con conteo y buscador en la URL, 25 por página, detalle en panel lateral, datos de contacto (celular y correo, que la colección ya tenía), marcar como atendido o volver a nuevo, borrado solo del administrador con diálogo propio, avisos y estados vacíos. El menú y el inicio enlazan aquí.
- Escrituras: server actions que llaman a `exigirSesion()`, rol tomado de la sesión del servidor, Local API con `overrideAccess: false` y el `user`, entradas validadas en el servidor.
- Verificador: un bloqueo (B1: un correo que el panel aceptaba y Payload rechazaba rompía la pantalla). Corregido en un lote y recomprobado: regla de correo igual a la de Payload (hay que volver a copiarla si Payload cambia de versión), el 400 llega como error de campo o aviso, `error.tsx` propio como red de seguridad.
- Sin nota interna: la colección no tiene ese campo y esta fase no cambia el esquema.
- La prueba de Playwright del aviso de ingreso fallaba en CI por el anunciador de rutas de Next (`role="alert"`); se filtró por texto.
- Verificado en producción a 1440×900 y 390×844 con un mensaje de prueba enviado desde el formulario público («Prueba del panel (borrar)», id 1): redirección sin sesión, lista, panel lateral, error de correo inválido en el campo, marcar como atendido con aviso, conteos del menú y del inicio actualizados. Corregido después: los avisos tapaban los botones del panel lateral (ahora salen arriba).
- Sin verificar: borrado real (el mensaje de prueba sigue en producción hasta que Gian confirme), vista de un editor, paginación con más de 25 mensajes.

**L7** (27/11/2026), P5 terminada (`8b6ef1e` y el commit de esquema anterior):
- Esquema: `planes.activo` (`campoActivo`), migración `20261127_233245_planes_visible` (`ADD COLUMN "activo" boolean DEFAULT true`), tipos regenerados. El sitio público no dibuja los planes ocultos; con todos visibles el HTML de la tabla es idéntico al anterior (comparación byte a byte). Clave de caché renombrada a `planes.listarConVisibilidad`.
- Hook `beforeDelete` en `planes`: borra sus inclusiones en la misma transacción (antes quedaban huérfanas, `ON DELETE SET NULL`); vale también para `/admin`.
- `/panel/planes`: interruptor «visible», orden por arrastre (mouse) y con flechas, «Nuevo plan» en diálogo (se crea oculto y último). `/panel/planes/[id]`: datos, matriz «Qué incluye», vista previa, barra de guardado con estado de cambios, aviso al salir, eliminar (solo administrador). Plan e inclusiones se guardan en una transacción.
- Verificador independiente: sin bloqueos. Aviso A1 corregido antes de subir (las celdas huérfanas se descartan al leer en vez de romper la pantalla). Avisos anotados: los ocultos cuentan dentro del máximo de 12 planes de la consulta pública; un plan oculto se lee por `/api/planes`; un editor aún puede borrar planes desde `/admin` (se resuelve con P7); el adaptador de Payload no informa una falla al confirmar la transacción.
- Verificado en producción a 1440×900 y 390×844: la migración se aplicó y el sitio sigue mostrando los cuatro planes; listado y edición sin desborde ni errores; con un plan de prueba oculto («Plan de prueba (borrar)», id 5): creación, rechazo de un monto («No publiques montos…»), «Cambios sin guardar», guardado con aviso, persistencia tras recargar, aviso del navegador al salir con cambios, y el sitio público sin la columna del plan oculto.
- Sin verificar: mostrar y ocultar un plan real, reordenar, eliminar (el plan de prueba sigue en producción hasta que Gian confirme), arrastre con el mouse, vista de un editor.
- Detalles pendientes: la vista previa parte «trabajadores» sin guion; el aviso de guardado dice que la tabla ya muestra los cambios aunque el plan esté oculto; la ruta termina en «Editar plan»; editar las características (filas) queda para P6.
- P6 se divide: lo que tiene maqueta aprobada (sedes, página de inicio, guía de clientes, publicaciones, imágenes, usuarios, mi cuenta) se construye; Áreas de servicio, Clientes, Datos del estudio y Menú del sitio no tienen maqueta («No incluida») y por S4.1 necesitan la suya antes.

**L8** (27/11/2026), P6 · Sedes terminada (`7154a08`):
- `/panel/sedes`, `/panel/sedes/[id]` y `/panel/sedes/nueva`, sin cambio de esquema. Lo genérico de planes pasó a `sitio/src/panel/componentes/comunes/` y a `dominio/orden.ts`; planes usa esas piezas (los archivos movidos son idénticos, según el verificador).
- Decisiones: se permite ocultar o borrar la última sede visible, con advertencia (el sitio público funciona con cero sedes); crear una sede es una página completa (la colección exige dirección y celular); los celulares se reordenan porque el orden decide el botón de WhatsApp.
- Verificador independiente: sin bloqueos. El enlace del mapa usa la misma regla que la colección y el sitio (`esMapaIncrustadoDeGoogle`: origen `https://www.google.com`, ruta `/maps/embed`). Avisos anotados, anteriores al cambio: el sitio usa el nombre de la sede como `key` de React y nada impide nombres repetidos; el correo acepta `?`, `&` y `=` antes de la `@` (regla de Payload); el `iframe` público no lleva `sandbox`.
- Verificado en producción a 1440×900 y 390×844: listado y edición con los datos reales de las dos sedes, sin desborde ni errores; planes sigue igual tras el refactor; el sitio público mantiene sus dos pestañas y sus cuatro planes.
- Sin verificar: ninguna escritura sobre sedes (son datos reales del estudio), arrastre, vista de un editor.

**L9** (27/11/2026), P6 · Usuarios y Mi cuenta terminadas (`90d4f85`):
- `/panel/usuarios` (solo administrador, guardia `exigirAdministrador()`): filtro por rol, buscador, crear, editar, restablecer la contraseña de otra cuenta, eliminar. `/panel/cuenta`: nombre y contraseña propios, verificando la actual con `payload.login`. Sin cambio de esquema. El enlace de la cuenta del menú ya no abre `/admin`.
- Reglas del servidor: un editor no ejecuta ninguna acción de administrador ni cambia su rol; nadie elimina ni edita su propia cuenta desde «Usuarios»; el último administrador no se elimina ni se degrada; contraseña nueva de 10 a 256 caracteres, nunca solo espacios.
- Verificador independiente: sin bloqueos. Corregidos antes de subir los avisos A1 y A2 (una contraseña de solo espacios rompía la pantalla o creaba una cuenta que no podía entrar).
- Pendiente (A3): la regla del último administrador vive solo en el panel; dos administradores a la vez podrían saltársela y desde `/admin` un administrador puede eliminarse. Va como hook en `coleccion-usuarios.ts`, en un cambio aparte.
- Pendiente: el único administrador no puede cambiar su propio correo (ni en «Usuarios», que no edita la cuenta propia, ni en «Mi cuenta», donde es de solo lectura).
- Verificado en producción a 1440×900 y 390×844, solo lectura: listado, diálogo «Nueva cuenta» y «Mi cuenta», sin desborde ni errores.
- Sin verificar: ninguna escritura (crear una cuenta en producción necesita el visto bueno de Gian) ni la vista de un editor.

**L10** (27/11/2026), P6 · Guía de clientes terminada (`d36c598`):
- `/panel/guia` en una pantalla con tres partes y anclas (`#avisos`, `#vencimientos`, `#cronograma`): avisos (interruptor, orden, edición en panel lateral, documentos uno por línea como en la maqueta), vencimientos (filtro con conteo y buscador), cronograma de SUNAT (periodo con diez fechas por dígito del RUC y la de buenos contribuyentes). Sin cambio de esquema.
- Fechas: se guardan como mediodía de Lima (`T17:00:00.000Z`) y se leen con `diaEnLima`, igual que `/guia`; el verificador confirmó que ningún camino corre el día, tampoco con lo cargado antes desde `/admin`.
- Verificador independiente: sin bloqueos. Avisos anotados: dos cargas simultáneas del mismo periodo darían un mensaje genérico; `/guia` usa textos como `key` de React (dos líneas iguales dan una advertencia); un cronograma anterior a 2020 no se puede volver a guardar desde el panel.
- Diferencias con la maqueta: «Fecha por confirmar» sale del texto «Consulta la fecha con el estudio.» (no hay campo de fecha); el cronograma sí se puede cargar; los avisos nuevos nacen ocultos; los textos de la página (global `guia-de-clientes`) quedaron fuera.
- Verificado en producción a 1440×900 y 390×844, solo lectura: los 3 avisos, los 14 vencimientos y el estado vacío del cronograma con su formulario, sin desborde ni errores; `/guia` público sin cambios.
- Sin verificar: ninguna escritura (datos reales) ni la vista de un editor.

**L11** (27/11/2026), P6 · Imágenes terminada (`c0f0e19`):
- `/panel/imagenes`: cuadrícula con filtros por uso y buscador, paginación, subida de una o varias imágenes con texto alternativo obligatorio, detalle en panel lateral con «Se usa en», borrado solo del administrador y solo si la imagen no está en uso. `SelectorDeImagen` reutilizable en `componentes/comunes/` (aún sin conectar a ningún formulario).
- Subida: manejador de ruta `POST /panel/imagenes/subir` (las server actions aceptan 1 MB): sesión antes de leer el cuerpo (401), mismo origen (403), tope de 10 MB (413), tipo real por los primeros bytes (JPEG, PNG, WebP, AVIF) y extensión reemplazada por la del tipo real.
- Colección `medios`: `upload.mimeTypes` limitado a esos cuatro tipos (vale para `/admin` y `/api/medios`). Sin cambio de esquema. Payload valida el tipo guardado en cada actualización: se comprobó por la API pública que las 21 imágenes de producción son PNG (15) o WebP (6), así que ninguna queda sin poder editarse.
- Las llaves foráneas a `medios` son `ON DELETE SET NULL`: borrar una imagen en uso vaciaría en silencio campos obligatorios. El bloqueo por uso del panel es la única defensa; el verificador confirmó que el inventario cubre los 12 campos que apuntan a `medios`.
- Verificador independiente: dos bloqueos, resueltos antes de subir (el de los tipos existentes, con el dato de producción; una frase desactualizada de `sitio/CLAUDE.md`). Avisos anotados: un editor aún puede borrar imágenes en uso desde `/admin` o la API (falta un hook `beforeDelete` o P7); algunos AVIF válidos se rechazan; el texto de «Quiénes somos» no se revisa en el inventario (el sitio solo dibuja su texto).
- Verificado en producción a 1440×900 y 390×844, solo lectura: 21 miniaturas sin ninguna rota, filtros con conteo, detalle con «Se usa en», sin desborde ni errores; la subida sin sesión responde 401.
- Sin verificar: una subida real, editar un texto alternativo y un borrado.

**L12** (27/11/2026), P6 · Página de inicio (orden y carrusel) terminada (`a82bf8f`):
- `/panel/pagina-de-inicio`: las siete secciones en su orden real, reordenables con la barra de guardado; el carrusel abre su editor y las otras seis quedan «Próximamente». `/panel/pagina-de-inicio/portadas`: todas las portadas con sus campos reales (imagen, imagen para celular, encuadre, sello, textos, lista de puntos, hasta dos botones), `SelectorDeImagen`, vista previa y barra de guardado. No se tocó ningún componente público ni el esquema.
- Guardado de la global: el servidor lee `pagina-de-inicio` con `depth: 0`, cambia solo el bloque del carrusel (o el orden) y escribe `secciones` en una llamada; del navegador solo toma los campos del carrusel. Un formulario cuyo `updatedAt` ya no coincide se rechaza y pide recargar. Cero portadas se bloquea en el servidor (el bloque tiene `minRows: 1` y el `h1` del inicio sale de la primera portada con título).
- Verificador independiente: sin bloqueos. Confirmó en el código de Payload y drizzle que los otros seis bloques vuelven iguales (ids, listas anidadas, imágenes como ids, texto enriquecido) y que `seo` no se toca. Avisos anotados: Payload valida TODAS las secciones en cada guardado, así que un dato inválido ya guardado en otra sección bloquearía el carrusel (el panel lo informa, pero su mensaje manda a recargar); queda una ventana de milisegundos entre la comprobación de `updatedAt` y la escritura; no se pudo comprobar sin base que el texto enriquecido real de «Quiénes somos» pase su validación al reescribirse.
- Diferencias con la maqueta: «Sin texto» se llama «Imagen completa» (el sitio igual dibuja título y botones); segundos por portada de 3 a 30 (límites del bloque).
- Verificado en producción a 1440×900 y 390×844, solo lectura: la lista con las siete secciones y el editor con las cuatro portadas reales, imágenes sin romper, vista previa, sin desborde ni errores; el inicio público conserva su `h1` y sus secciones.
- Sin verificar: ningún guardado. El primer guardado real es el que confirma el punto del texto enriquecido; conviene hacerlo con Gian presente.

**L13** (27/11/2026), P6b · maqueta de lo que falta, lista para aprobar:
- En `mockup/panel/` (portada `index.html`, bloque «Pantallas nuevas por aprobar»): `areas.html` y `area-editar.html`; `caracteristicas.html` (filas de la tabla, bajo Planes); `clientes.html`; `valores.html`; seis `seccion-*.html` del inicio con un mismo patrón; `portada-editar.html` (portadas 2 a 4); `publicacion-editar.html` (borrador, publicada, nueva) y `categorias-y-etiquetas.html`; `datos-del-estudio.html` y `menu-del-sitio.html` (solo administrador); textos de página de la guía, el blog y el SEO del inicio en paneles laterales.
- Solo muestra campos que existen en el modelo; áreas, clientes, valores, menú y datos del estudio usan datos reales; publicaciones, categorías y etiquetas van marcadas «Ejemplo».
- Verificado por quien la hizo con capturas a 1440×900 y 390×844 y 41 pruebas de interacción; el orquestador revisó el editor de publicaciones y el menú del sitio.
- Preguntas para Gian:
  1. ¿«Valores» lleva entrada propia en el menú o se llega desde Página de inicio?
  2. ¿«Filas de la tabla» es pantalla propia bajo Planes o una pestaña dentro de Planes?
  3. ¿Áreas, valores y características necesitan un campo «Visible»? Hoy no lo tienen.
  4. ¿Se pueden agregar o quitar secciones del inicio, o solo reordenarlas?
  5. ¿Un editor puede publicar o solo guardar borradores? ¿Se puede programar una fecha futura?
  6. ¿Cuáles son los nombres reales de los dos clientes de las posiciones 2 y 6?
- Para la construcción: borrar una característica deja huérfanas sus celdas (falta un hook `beforeDelete`, como en planes).

**Estado al cierre de la sesión del 27/11/2026.** En producción: ingreso, inicio, mensajes, planes, sedes, guía de clientes, imágenes, página de inicio (orden y carrusel), usuarios y mi cuenta. Pendiente de Gian: aprobar la maqueta L13; decidir sobre los datos de prueba en producción (mensaje id 1 «Prueba del panel (borrar)», plan id 5 «Plan de prueba (borrar)», oculto), la cuenta de editor de prueba y las pruebas de escritura con datos reales. Pendiente técnico: hook del último administrador en `coleccion-usuarios.ts`; hook de borrado en `medios`; el único administrador no puede cambiar su correo; mensaje del aviso general de la página de inicio; P7 (ocultar `/admin`) cuando todo lo anterior esté construido.

**L14** (28/11/2026), Gian sobre la maqueta L13 y las decisiones pendientes, literal: «dale dale».
- Interpretación del orquestador: la maqueta L13 queda aprobada y se construye; las seis preguntas de L13 quedan como se ven en la maqueta (Valores se alcanza desde Página de inicio; «Filas de la tabla» es pantalla bajo Planes; sin campo «Visible» nuevo en áreas, valores ni características; las secciones del inicio solo se reordenan; un editor puede publicar y no hay programación de fecha más allá del campo que ya existe; los dos clientes sin nombre siguen «por confirmar»).
- Sobre las tres decisiones de datos: el orquestador borra los datos de prueba que él creó (mensaje id 1, plan id 5), prueba las escrituras con datos de prueba que crea y borra, y para ver el panel como editor crea una cuenta temporal con contraseña aleatoria que elimina al terminar. No se modifica ningún dato real del estudio.
- Orden de construcción: (1) catálogo: áreas, valores, clientes y filas de la tabla; (2) datos del estudio y menú del sitio; (3) secciones del inicio, portadas y textos de páginas; (4) publicaciones, categorías y etiquetas; (5) reglas en las colecciones (último administrador, borrado de medios) y P7.

**L15** (28/11/2026), pruebas de escritura en producción con datos de prueba, todos creados y borrados por el orquestador (producción quedó con 4 planes, 2 sedes, 21 imágenes, 1 cuenta y 0 mensajes, como antes):
- Planes: eliminar el plan de prueba (id 5) con su diálogo; el sitio conserva sus 4 columnas y 22 filas.
- Mensajes: eliminar el mensaje de prueba (id 1); el listado vuelve a su estado vacío.
- Usuarios: crear una cuenta de editor temporal con contraseña aleatoria, entrar con ella y eliminarla. Como editor: no ve el grupo «Administración», `/panel/usuarios` muestra «Solo para el administrador», no hay botón «Eliminar plan», «Mi cuenta» muestra su rol. Todavía puede entrar a `/admin` (se resuelve con P7).
- Sedes: crear una sede oculta (un teléfono fijo se rechaza con su mensaje; con un celular se crea), comprobar que el sitio no la muestra, editarla, comprobar que persiste y eliminarla.
- Imágenes: subir un PNG real (aceptado; el control de mismo origen funciona detrás del proxy de Railway) y un HTML disfrazado de PNG (rechazado: «Solo se aceptan imágenes JPG, PNG, WebP o AVIF.»); editar su texto alternativo; eliminarla.
- Observado: tras borrar una imagen, pedir su archivo a `/api/medios/file/...` responde 500 en vez de 404 (comportamiento de Payload, anterior al panel).
- No se probó: guardar el carrusel ni la guía (no tienen dato de prueba posible: se publican al guardar) ni cargar un cronograma.

Siguiente paso: construcción (1), en curso.
