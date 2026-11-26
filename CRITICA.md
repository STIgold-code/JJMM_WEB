# Crítica de diseño del sitio público

El sitio en producción no cumple su único objetivo, que un visitante escriba o llame al estudio: el formulario de contacto pierde los mensajes y no existe ningún teléfono que se pueda tocar ni enlace de WhatsApp. El puntaje de usabilidad es **7 de 36 (crítico)**. Este documento reúne todos los hallazgos, con su evidencia, como base del rediseño.

| Dato | Valor |
|---|---|
| Fecha | 24 de noviembre de 2026 |
| Sitio evaluado | `https://sigemype.com/` (`jjmm.com.pe` redirige aquí con un 301) |
| Páginas | Inicio, `/guia`, `/blog`, un artículo y una categoría |
| Tamaños | Celular 390×844 y escritorio 1440×900 |
| Referencia | `PRODUCT.md` (usuarios, restricciones, principios, WCAG 2.1 AA) |
| Fuera de alcance | `/login` y el panel de administración |

## Lo más urgente

1. **El formulario de contacto pierde los mensajes.** Envía a `php/sendemail.php`, que responde 404. No puede esperar al rediseño.
2. **No hay teléfonos tocables ni WhatsApp.** Cero enlaces `tel:` y cero `wa.me` en todo el sitio.
3. **Se publican teléfonos fijos y un precio**, contra lo que establece `PRODUCT.md`.
4. **El blog público muestra publicaciones de prueba** y un registro abierto.
5. **El inicio pesa 7,7 MB** y tarda 9,8 s en mostrar su contenido principal en el celular.

## Cómo leer este documento

| Prioridad | Significado |
|---|---|
| **P0** | Impide completar la tarea. Se corrige de inmediato. |
| **P1** | Causa una dificultad grave o incumple `PRODUCT.md`. Se corrige antes de publicar. |
| **P2** | Molestia con alternativa. Se corrige en la siguiente pasada. |
| **P3** | Pulido. Se corrige si hay tiempo. |

Las rutas de archivo son relativas a la raíz del repositorio. Las vistas del sitio están en `resources/views/web/`.

## Puntaje de usabilidad

Heurísticas de Nielsen, de 0 a 4 cada una. La heurística 7 no aplica a superficies de persuadir y de leer, por lo que el máximo es 36.

| # | Heurística | Puntaje | Problema principal |
|---|---|---|---|
| 1 | Visibilidad del estado | 1 | El formulario no responde y termina en 404. El menú no marca la sección activa. La rueda resaltó P1 mientras mostraba el texto de P2. |
| 2 | Coincidencia con el mundo real | 1 | PDT 621, DAOT, Kardex, ITAN y SEE-OSE sin explicar. "Sistema de Calidad Genuino" no le dice nada a un dueño de MYPE. En el blog, fechas en inglés y "Login/Register". |
| 3 | Control y libertad | 2 | El menú móvil no tiene botón para cerrar. Desde el blog no se vuelve a las secciones del inicio ni al contacto. |
| 4 | Consistencia y estándares | 0 | Tres interfaces distintas: el inicio, la guía (con otro menú) y el blog (con dos diseños de tarjeta). Los teléfonos fijos cambian entre el inicio y la guía. |
| 5 | Prevención de errores | 0 | Formulario sin etiquetas visibles, sin `required` ni `autocomplete`, con el teléfono como `type=number`, que envía a un endpoint inexistente. |
| 6 | Reconocer en lugar de recordar | 1 | Ocho de las nueve áreas solo aparecen al hacer clic en la rueda, sin ninguna pista. En el celular los nombres de los planes desaparecen al bajar por la tabla. |
| 7 | Flexibilidad y eficiencia | n/a | No hay usuario experto en estas superficies. |
| 8 | Estética y minimalismo | 1 | Ruido de plantilla, fotos de stock y texto dentro de imágenes. "Por qué elegirnos" son seis palabras sueltas con íconos. |
| 9 | Recuperación de errores | 0 | El formulario lleva a 404. Los nueve "Ver Servicio" llevan a 404. Hay imágenes rotas en la guía y en el blog. |
| 10 | Ayuda y documentación | 1 | La guía existe, pero son tres JPG ilegibles en el celular, sin texto alternativo, título ni búsqueda. |
| **Total** | | **7/36** | **Crítico (19 %)** |

El inicio y el blog fallan de forma distinta: el inicio está recargado y roto; el blog está vacío y sin marca.

## ¿Es un diseño propio del estudio?

**No.** Es una plantilla jQuery de alrededor de 2017 que cualquier empresa podría usar cambiando el logo:

- Revolution Slider con fotos de stock.
- Títulos en Oswald.
- Íconos de Font Awesome sobre una foto oscura.
- Carrusel de logos.

**La rueda SIGE Mype es el único elemento propio y está mal resuelta:**

- Es un SVG con etiquetas de unos 9 px, algunas invertidas (P6, P7, P8).
- Solo se activa con clic, y su lógica está escondida en `public/web/js/wow.min.js:30-127`, un archivo de una librería externa.
- No explica, en lenguaje de dueño de negocio, qué gana el cliente con el sistema. Eso contradice el principio 2 de `PRODUCT.md`.

**El blog es Jetstream/Tailwind sin personalizar:** barra gris oscura, "Login/Register" y una foto de Pixabay de un lago repetida en las tarjetas.

**La marca se contradice:** el logo dice "Mariñas & Asociados" y el texto dice "Estudio Contable JJMM S.A.C.", sin explicar la relación.

## Lo que funciona

1. **Las cuatro cifras.** Más de 100 clientes, más de 100 requerimientos de SUNAT, más de 10 años y más de 20 empresas: concretas y legibles de un vistazo.
2. **La matriz de planes.** Compara alcances reales. El contenido vale; la presentación no.
3. **El blog es técnicamente sano.** Lighthouse móvil 90/100/96/100, cuerpo de 16 px con contraste correcto y foco visible.

## Problemas por prioridad

### P0: impiden contactar

#### 1. El formulario de contacto pierde los mensajes

- **Evidencia:** `index.blade.php:697` envía a `php/sendemail.php`, que responde 404.
- **Por qué importa:** es el único contacto fuerte del inicio, y los cuatro botones "Solicitar" de los planes llevan a él. El mensaje se pierde sin aviso.
- **Corrección:** retirarlo y resolver el contacto con enlaces de WhatsApp, llamada y correo por sede, como establece `PRODUCT.md`.

#### 2. No hay teléfonos tocables ni WhatsApp

- **Evidencia:** 0 enlaces `tel:` y 0 enlaces `wa.me` en todo el sitio. El único contacto enlazado es el `mailto` de la barra superior. Los celulares del pie son texto plano.
- **Por qué importa:** en el celular, el contacto está a más de cinco pantallas y no se puede tocar. Contradice el principio 1 de `PRODUCT.md`.
- **Corrección:** barra fija inferior con WhatsApp y Llamar, y enlaces `tel:` en cada sede.

### P1: graves o contra `PRODUCT.md`

#### 3. Se publican teléfonos fijos

- **Evidencia:** barra superior con (01) 480-0125 y 567-0693 en el inicio, y (01) 425-0125 y 567-0693 en la guía. En el pie: `index.blade.php:722,740` y `guia.blade.php:85,141,159`.
- **Por qué importa:** incumple la restricción de publicar solo celulares, y los números no coinciden entre páginas.
- **Corrección:** eliminarlos.

#### 4. Se publica un precio

- **Evidencia:** "Costo por Trabajador en planilla adicional: S/ 10.00" en los cuatro planes (`index.blade.php:507,533,559,585`).
- **Por qué importa:** incumple la restricción de no publicar montos.
- **Corrección:** reemplazar por "Consultar" o retirar la fila.

#### 5. Las nueve áreas de servicio están ocultas y sus enlaces rotos

- **Evidencia:** solo P1 es visible. Las demás requieren clic en segmentos SVG sin foco, rol ni indicación. Los nueve "Ver Servicio" van a `servicios.html`, que responde 404 (`index.blade.php:299-443`).
- **Por qué importa:** las áreas son el argumento central del estudio y casi nadie las ve.
- **Corrección:** lista o acordeón accesible con las nueve áreas a la vista; la rueda queda como ilustración.

#### 6. El inicio es lento y pesado en el celular

- **Evidencia:** 110 peticiones, 7,7 MB, LCP 9,8 s, TTI 16,3 s y rendimiento 56 en Lighthouse. Detalle en [Evidencia medida](#evidencia-medida).
- **Por qué importa:** el visitante principal llega desde el celular, con datos móviles.
- **Corrección:** imágenes en formato moderno y con dimensiones, una sola copia de jQuery o ninguna, y menos hojas de estilo.

#### 7. La accesibilidad está por debajo de AA

| Falla | Evidencia |
|---|---|
| Zoom bloqueado | `maximum-scale=1` en `index.blade.php:16` y `guia.blade.php:20` (WCAG 1.4.4) |
| Foco invisible | `:focus{outline:0}` en `public/web/css/reset.css:63`; también en `style.css` y `tabs.css` |
| Imágenes sin texto alternativo | 93 de 95 en el inicio, entre ellas los 11 logos de clientes; el slider usa `alt="Image 4"` (`index.blade.php:173,180`) |
| Menú móvil inoperable con teclado | La hamburguesa es un `<img alt="">` sin rol ni `tabindex` (`index.blade.php:146`) |
| Rueda inoperable con teclado | Segmentos SVG sin foco ni rol |
| Sin enlace para saltar al contenido | No existe en ninguna página |
| Movimiento | `prefers-reduced-motion` no aparece en las 22 hojas de estilo; el slider se mueve solo y `animate.css` usa `bounceIn` |
| Contraste del "P1:" amarillo | `#feee00` sobre `#f5f5f5`: 1.1:1 |
| Contraste de menú, pie y correo | `#1889c1` sobre blanco: 3.89:1 a 12 o 13 px |
| Enlaces sin nombre accesible | 6 en el inicio (Facebook, Twitter, YouTube, logo, SIGEFact y `/login`) y 5 en la guía |
| Mapa | `iframe` sin `title` |

#### 8. La guía de clientes son tres imágenes

- **Evidencia:** tres JPG sin texto alternativo ni título, con texto de 5 a 7 px en el celular y sin zoom. La página tiene `lang="en-gb"` y ningún `<h1>`.
- **Errores en producción:** `WOW is not defined`, un fallo en `ddsmoothmenu.js` y Google Fonts bloqueado por contenido mixto, por lo que no carga ninguna fuente web.
- **Por qué importa:** el cliente actual abre la guía para ver vencimientos y no puede leerlos ni buscarlos.
- **Corrección:** pasar los vencimientos a HTML, con listas y tablas.

#### 9. El blog público muestra datos de prueba

- **Evidencia:** publicaciones "Prueba 1", "Prueba 2" y "Prueba 3", "Extracto 1", comentarios "HOLA" y un "Register" abierto al público.
- **Por qué importa:** destruye la confianza justo donde el estudio debería demostrar criterio.
- **Corrección:** despublicar las pruebas y cerrar el registro, o sacar el blog del menú hasta tener contenido.

#### 10. Contenido tributario desactualizado sin advertencia

- **Evidencia:** "Nuevos requisitos CPE 2021" es el único artículo real y se presenta como vigente.
- **Por qué importa:** para un estudio contable, una norma vencida publicada sin aviso es un riesgo de credibilidad.
- **Corrección:** fecha de revisión y aviso de vigencia, o retirarlo.

### P2: molestias con alternativa

#### 11. Navegación rota en la guía

- BLOG apunta a `/#section5`, que está comentado en el inicio (`index.blade.php:630`).
- GUIA DE CLIENTES apunta a `guia_clientes.html`, que responde 404 (`guia.blade.php:102,104`).
- El logo de SIGEFact no carga: `/images/sigefact.png` responde 404.

#### 12. El blog está desconectado del estudio

- No tiene pie, contacto ni marca. Su menú solo tiene dos categorías y Login/Register.
- Las etiquetas salen sin color: `bg-{{ $tag->color }}-600` no se genera (`posts/index.blade.php:12`).
- La tarjeta de "Prueba 2" queda con texto blanco sobre gris claro, y su imagen responde 404.
- Hay dos diseños de tarjeta: texto sobre foto en el listado y tarjeta blanca en la categoría.
- Hay varios `<h1>` por página (4 en el listado y en la categoría, 2 en el artículo) y saltos de `h1` a `h3`.
- Las fechas salen en inglés ("Thursday, 03 March 2022").
- Las fechas sobre imagen tienen contraste de entre 1.1:1 y 2.2:1.

#### 13. La tabla de planes no funciona en el celular

- El encabezado no queda fijo al bajar por las 22 filas.
- El texto mide 10 px.
- Los botones "Solicitar" se ocultan (miden 0×0).
- No hay ninguna llamada a la acción después de la tabla.
- "Para empresas con Ventas Anuales hasta de: Consultar" es una fila sin sentido.
- "Estados Financieros Intermedios" tiene ✗ en los cuatro planes.

#### 14. Composición en el celular

- La cabecera fija mide unos 100 px y tapa el título "Contactanos" al usar el ancla CONTACTO.
- `div.texto_servicio` desborda 20 px a 390 px y corta palabras ("informació", "vigente").
- La rueda se corta en los bordes.
- El cuerpo de "Quiénes somos" mide 12 px y los `placeholder`, 13 px.
- El botón ENVIAR mide 32 px de alto.

#### 15. SEO y metadatos

- El `<title>` es el mismo en todas las páginas, incluidos los artículos.
- `canonical` y `og:url` apuntan a `jjmm.com.pe`, que redirige.
- El inicio tiene dos `meta description`, una vacía; la de la guía está vacía.
- `og:image` es una foto de Pexels.
- El favicon responde 404 (`/images/favicon.png`).
- El inicio hace dos redirecciones antes de cargar (unos 630 ms en el celular).
- El artículo no tiene `doctype` válido.

### P3: pulido

#### 16. Ortografía y redacción

"BUSSINES", "ESCOGER NUESTRO SERVICIOS", "Contactanos", "Telefono", "CATEGORIA", "Elaboracion", "presentacion", "Determinacion", "Asesoria Contable Legales", "normas comerciales vigente", "San isidro".

#### 17. Pie de página

- "Copyright © 2017 STIGold.com All rights reserved." está en inglés y con año antiguo.
- El enlace es relativo (`href="www.stigold.com"`, `index.blade.php:764`) y está roto.
- El logo grande queda descentrado entre las sedes.

#### 18. Tipografía

- Se mezclan ocho familias, entre ellas Calibri, Rockwell y Berlin Sans heredadas del SVG.
- Falta `font-display` en cuatro fuentes.

#### 19. Terceros sin beneficio claro

- AdSense (pendiente decidir si permanece, según `PRODUCT.md`).
- Google Maps: 14 peticiones y unos 420 a 460 KB.
- Plugin de Facebook en el artículo: 22 peticiones y 731 KB.

#### 20. Detalles

- Los íconos sociales no tienen nombre accesible y X/Twitter usa el ícono antiguo.
- El mapa ubica una sola sede.
- La rueda tiene flechas en sentido antihorario y numeración en sentido horario.
- El carrusel de clientes corta un logo en el borde derecho, en escritorio.
- El blog usa `lang="es"` y el inicio `lang="es-PE"`.

## Carga cognitiva

Fallan 7 de 8 puntos del checklist: carga alta.

| Punto | Resultado |
|---|---|
| Un solo foco | Falla. Compiten el slider, las cifras, la rueda, la tabla, el carrusel, el formulario y el mapa. |
| Bloques de cuatro o menos | Falla |
| Jerarquía visual | Falla |
| Una cosa a la vez | Falla |
| Pocas opciones por decisión | Falla |
| Memoria de trabajo | Falla. En el celular hay que recordar a qué columna corresponde cada ✓ después de unas 20 filas. |
| Revelado progresivo | Falla. Se usa para esconder contenido, no para dosificarlo. |
| Agrupamiento | Pasa a medias |

Decisiones con más de cuatro opciones visibles:

- Menú: 8 opciones más SIGEFact.
- Rueda: 9.
- Tabla de planes: 4 planes por 22 características.
- Valores: 6.
- Pie: 3 sedes por 5 datos, con los teléfonos repetidos.

## Recorrido emocional

| Momento | Qué ocurre |
|---|---|
| Primer contacto | Foto de stock genérica y el lema dentro de una imagen. "ASESORIA GRATUITA" es la promesa más fuerte del sitio y no tiene ningún botón. |
| Primer bache | Un párrafo de 12 px de autoelogio. |
| Mejor momento | Las cuatro cifras en círculos. |
| Bache profundo | La tabla de 22 filas con jerga. |
| Momento de mayor riesgo | El visitante decide contactar y encuentra un formulario que no entrega el mensaje y números que no se pueden tocar. |
| Cierre | "Copyright © 2017 STIGold.com All rights reserved", en inglés y con enlace roto. |
| Cierre en el blog | "Prueba 1", "Extracto 1" y comentarios "HOLA". |

## Personas

| Persona | Qué le falla |
|---|---|
| **Rosa, dueña de una MYPE** (usuario principal) | Llega preocupada por las multas de SUNAT y el sitio le habla de un sistema de calidad. La única promesa útil, "ASESORIA GRATUITA", está dentro de una imagen. Quiere escribir por WhatsApp y no puede. |
| **Cliente actual** (usuario secundario) | Abre la guía en el celular y no puede leer las fechas ni buscarlas. Entra al blog y encuentra un artículo de 2021, mientras el Facebook del estudio sí tiene publicaciones recientes. |
| **Casey, celular con una mano** | Ningún número es tocable. El contacto está a más de cinco pantallas. La hamburguesa está arriba a la derecha. ENVIAR mide 32 px. La guía no se puede leer ni ampliar. |
| **Jordan, primera vez** | No entiende PDT, DAOT ni Kardex. No sabe qué plan elegir. "Ver Servicio" lo lleva a un 404. Envía el formulario y no recibe confirmación. |
| **Riley, busca los límites** | El formulario acepta todo vacío. Los teléfonos cambian entre páginas. Hay una imagen rota en el artículo. La rueda resalta un área y muestra otra. |

## Evidencia medida

### Lighthouse

Puntajes de rendimiento, accesibilidad, buenas prácticas y SEO.

| Página | Celular | Escritorio | Métricas en el celular |
|---|---|---|---|
| Inicio | 56 / 74 / 55 / 85 | 40 / 74 / 57 / 85 | LCP 9,8 s, FCP 3,5 s, TTI 16,3 s, CLS 0,117 (0,512 en escritorio) |
| Guía | 68 / 75 / 71 / 83 | 77 / 75 / 74 / 83 | LCP 4,8 s |
| Blog | 90 / 100 / 96 / 100 | 97 / 100 / 96 / 100 | LCP 3,4 s |
| Artículo | 79 / 86 / 93 / 100 | 95 / 80 / 93 / 100 | LCP 5,3 s |
| Categoría | 84 / 98 / 96 / 100 | 98 / 96 / 96 / 100 | LCP 4,3 s |

### Peso y red

| Página | Peticiones | Peso | Respuestas 404 |
|---|---|---|---|
| Inicio | 110 | 7,70 MB | `/images/favicon.png` |
| Guía | 45 | 1,20 MB | `/images/sigefact.png`, `/js/wow.min.js` |
| Blog y categoría | 10 | 0,46 MB | Una imagen de `storage/posts` |
| Artículo | 47 | 1,65 MB | La misma imagen y un recurso de Facebook |

Detalle del inicio:

- **Imágenes más pesadas:** `fondoweb/portada1.png` (2,81 MB), `portada3.png` (1,54 MB), `portada4.png` (1,03 MB) y `portada2.png` (0,58 MB).
- **Ahorro estimado:** 4,5 MB con imágenes adaptadas al tamaño y 4,8 MB con formatos modernos.
- **Imágenes sin dimensiones:** 88.
- **Copias de jQuery:** cuatro (`jquery-1.11.3` desde CDN, `universal/jquery.js`, `style-switcher/jquery-1.js` y `mainmenu/jquery-1.7.1.min.js`).
- **En el `<head>`:** 18 hojas de estilo y 2 scripts síncronos. El blog carga 2 hojas y ningún script síncrono.

### Errores de JavaScript en producción

| Página | Error |
|---|---|
| Inicio | `Cannot read properties of null (reading 'top')` en `sticky-menu/core.js` |
| Guía | `WOW is not defined` |
| Guía | `Cannot set properties of undefined (setting 'className')` en `ddsmoothmenu.js` |
| Guía | Contenido mixto: hoja de Google Fonts solicitada por `http` |

### Detector de Impeccable

Sobre los 13 archivos Blade: 2 hallazgos, ambos `overused-font` (Open Sans) en `index.blade.php:19` y `guia.blade.php:23`.

Sobre las páginas en producción:

| Página | A 390 px | A 1440 px | Reglas principales |
|---|---|---|---|
| Inicio | 50 | 10 | `cramped-padding` ×22, `tight-leading` ×9, `undersized-ui-text` ×8, `low-contrast`, `tiny-text` |
| Guía | 4 | 4 | `low-contrast`, `script-error` ×2 |
| Blog | 7 | 5 | `low-contrast` (texto sobre imagen) |
| Artículo | 9 | 7 | `body-text-viewport-edge`, `line-length`, `nested-cards`, `skipped-heading` |
| Categoría | 1 | 1 | `skipped-heading` |

Probables falsos positivos: `overused-font` (regla de estilo), `repeated-container-text` en el pie, `hard-offset-shadow` y `nested-cards` en el artículo.

## Preguntas para el estudio

1. ¿Desde cuándo no llega ningún mensaje del formulario y cuántos contactos se perdieron?
2. Si "Asesoría gratuita" es una oferta real, ¿por qué no es el botón principal del sitio?
3. El Facebook del estudio está activo y el blog no publica desde 2021: ¿se mantiene el blog o se reemplaza por los vencimientos del mes?
4. ¿Cuál es la marca ante el cliente: "Mariñas & Asociados", "JJMM S.A.C." o "SIGE Mype"?
5. ¿Qué celular atiende cada sede?

## Recomendación

El sitio no se corrige con pulido: la plantilla, la rueda y la guía en imágenes deben reemplazarse. Orden sugerido:

1. **Corregir el contacto hoy**, sin esperar al rediseño: cada mensaje del formulario se pierde.
2. **Rediseñar el inicio:** contacto a un toque, las nueve áreas a la vista y planes legibles en el celular.
3. **Rediseñar la guía:** vencimientos en HTML.
4. **Limpiar el contenido:** retirar los fijos, el "S/ 10.00" y las pruebas del blog; corregir la ortografía.
5. **Optimizar y auditar** el resultado: peso, rendimiento y WCAG 2.1 AA.
6. **Pulir** al final.

## Pendientes fuera de esta crítica

Se resolverán cuando el sitio sea administrable:

- Producción muestra una tercera sede, Miraflores, que no está en el repositorio ni en `PRODUCT.md`.
- El celular de Miraflores, "+51 946 068 4372", tiene diez dígitos; un celular peruano tiene nueve. Es una inferencia por el formato y debe confirmarse.
- El teléfono fijo de la barra superior es distinto en producción y en el repositorio.

## Método y límites

- **Dos evaluaciones independientes:** una revisión de diseño en el navegador y una medición con el detector de Impeccable y Lighthouse 12.2.1. No compartieron resultados entre sí.
- **Verificado en el código:** el `action` del formulario, los enlaces a `servicios.html`, el `maximum-scale=1` y la regla de foco de `reset.css`.
- **No se hizo:** enviar el formulario, probar con un lector de pantalla, probar la paginación del blog (solo hay cuatro publicaciones), medir objetivos táctiles de 44 px ni registrar advertencias de consola.
- **Dato calculado, no medido:** el contraste de los enlaces del menú en la revisión de diseño; la medición con Lighthouse lo confirmó en 3.89:1.
- **Sin superposición visual:** el navegador de medición estaba bloqueado por otra instancia.
- **Archivo de la corrida:** `.impeccable/critique/2026-11-25T00-53-41Z__sigemype-com.md`.
