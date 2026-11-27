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
| P5 | S1, S3, S4.2 | Fase 3: el catálogo principal | por definir | bloqueada por P2 | — |
| P6 | S1, S3, S4.2 | Fase 4: el resto de secciones | por definir | bloqueada por P2 | — |
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

Siguiente paso: P5.
