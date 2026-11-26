# JJMM_WEB

Frontend del sitio web del Estudio Contable JJMM S.A.C.

Este repositorio contiene **solo el frontend**: vistas, estilos, scripts e imágenes. El backend (Laravel 8, base de datos, rutas, controladores, panel de administración) vive en otro proyecto y no se modifica desde aquí.

## Estado actual

El contenido es una copia fiel del frontend en producción, sin cambios. Sirve como línea base para el rediseño.

Para conocer qué producto es, a quién se dirige y qué restricciones tiene, lee [`PRODUCT.md`](PRODUCT.md). La crítica de diseño del sitio actual (inicio, guía y blog) está en [`CRITICA.md`](CRITICA.md); el archivo de cada corrida queda en [`.impeccable/critique/`](.impeccable/critique/).

## Estructura

Se conserva la estructura de carpetas de Laravel para que cualquier archivo pueda volver al backend en la misma ruta.

| Ruta | Contenido |
|---|---|
| `resources/views/web/` | Página de inicio (`index.blade.php`) y guía de clientes (`guia.blade.php`) |
| `resources/views/posts/` | Blog público: listado, detalle, categoría y etiqueta |
| `resources/views/layouts/`, `components/`, `livewire/` | Layouts, componentes y vistas Livewire |
| `resources/views/admin/` | Panel de administración (AdminLTE) |
| `resources/views/auth/`, `profile/`, `api/`, `vendor/` | Vistas de autenticación y perfil (Jetstream) |
| `resources/css/`, `resources/js/` | Fuentes de Tailwind y Alpine que compila Laravel Mix |
| `resources/lang/`, `resources/markdown/` | Textos de la interfaz, términos y política |
| `public/web/` | CSS, JS e imágenes del sitio público |
| `public/css/`, `public/js/` | Salida compilada de Laravel Mix |
| `public/vendor/` | Recursos publicados de AdminLTE |

No se incluyen `public/index.php`, `public/.htaccess`, `public/web.config` ni `public/storage`, porque pertenecen al servidor y al backend.

## Cómo ver el sitio

Las vistas son plantillas Blade: necesitan el backend Laravel para renderizarse. Con el backend corriendo en local, el sitio público está en:

- `/` — página de inicio
- `/guia` — guía de clientes
- `/blog` — blog

## Compilar estilos

Las vistas del blog, la autenticación y el perfil usan Tailwind 2 compilado con Laravel Mix.

```bash
pnpm install
pnpm dev
```

El sitio público (`public/web/`) no pasa por ningún proceso de compilación.

## Convenciones

- Commits en español con prefijos conventional (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
- Textos visibles para el usuario en español neutro con tuteo.
- Solo se publican los celulares de las sedes; no se publican teléfonos fijos ni precios de los planes.
