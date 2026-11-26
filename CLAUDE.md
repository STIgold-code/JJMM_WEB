# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repositorio

Frontend del sitio web del Estudio Contable JJMM S.A.C., extraído de una aplicación Laravel 8. Contiene solo vistas Blade, estilos, scripts e imágenes. **No hay backend aquí**: no existen `composer.json`, `artisan`, rutas, controladores ni modelos, por lo que nada se puede renderizar ni ejecutar desde este repositorio por sí solo.

El contenido actual es una copia fiel de producción y sirve como línea base para un rediseño. El alcance del rediseño es: página de inicio, guía de clientes y blog (listado y detalle).

Antes de tocar contenido o diseño, lee `PRODUCT.md`: define usuarios, posicionamiento, restricciones de contenido y los hechos que se pueden publicar.

## Comandos

```bash
pnpm install
pnpm dev      # compila resources/css/app.css y resources/js/app.js con Laravel Mix
pnpm watch    # recompila al guardar
pnpm prod     # build de producción: purga Tailwind y versiona los archivos
```

- No hay tests ni lint configurados.
- El lockfile versionado es `package-lock.json` y los scripts de `package.json` invocan `npm run` internamente.
- `public/css/app.css`, `public/js/app.js` y `public/mix-manifest.json` están versionados y corresponden a un build de **producción** (CSS purgado, manifest con `?id=`). `pnpm dev` los sobrescribe con una salida sin purgar ni versionar; no confirmes esa salida.
- Para ver el sitio hace falta el backend Laravel corriendo en local con estos archivos en sus mismas rutas: `/` (inicio), `/guia` (guía de clientes), `/blog` (blog).

## Arquitectura

Se conserva la estructura de carpetas de Laravel para que cada archivo pueda volver al backend en la misma ruta. No muevas ni renombres archivos sin considerar ese contrato.

Hay **tres frontends independientes** que no comparten layout, CSS ni JavaScript:

1. **Sitio público** (`resources/views/web/index.blade.php`, `guia.blade.php`). Cada vista es un documento HTML completo, sin layout ni parciales. `public/web/` no pasa por ningún proceso de compilación: se edita directamente.
   - **Inicio** (`index.blade.php`): rediseñado a partir del mockup aprobado `mockup/inicio-v4.html`. No usa jQuery ni plugins: sus estilos están en `public/web/css/inicio.css`, su comportamiento en `public/web/js/inicio.js` (slider, menú, pestañas, rueda, formulario a WhatsApp, animaciones al hacer scroll), sus imágenes en `public/web/images/inicio/` y sus fuentes en `public/web/fonts/`. Las animaciones reproducen las del sitio anterior (WOW y Revolution Slider) con CSS y respetan `prefers-reduced-motion`.
   - **Guía de clientes** (`guia.blade.php`): sigue con la plantilla antigua basada en jQuery (Revolution Slider, jCarousel, Owl Carousel, WOW, Font Awesome 4, varias versiones de jQuery a la vez). Los estilos propios del estudio están en `public/web/css/estilos_lenin.css` y `servicios.css`; el resto es de la plantilla.

2. **Blog, autenticación y perfil** (`resources/views/posts/`, `auth/`, `profile/`, `layouts/`). Usan Jetstream con Livewire 2, Tailwind 2 y Alpine 2, compilados con Laravel Mix. Las vistas del blog usan `<x-app-layout>` (`layouts/app.blade.php`), que monta `@livewire('navigation')`; las de autenticación usan `<x-guest-layout>`. La entrada de CSS es `resources/css/app.css`, que importa Tailwind y `resources/css/style.css`.

3. **Panel de administración** (`resources/views/admin/`). Extiende `adminlte::page` (paquete Laravel-AdminLTE, Bootstrap 4) y usa los recursos publicados en `public/vendor/`. Queda fuera del alcance del rediseño.

### Contrato con el backend

Las vistas dependen de datos, rutas y componentes que define el backend y que no se pueden verificar desde aquí. Al editar una vista, conserva lo que consume:

- Variables inyectadas por los controladores y componentes Livewire (`$posts`, `$post`, `$similares`, `$category`, `$tag`, `$categories`).
- Rutas con nombre (`posts.show`, `posts.category`, `posts.tag`, entre otras) y helpers `asset()`, `mix()` y `Storage::url()`.
- Componentes Livewire referenciados por nombre: `navigation`, `commentaries`, `admin.post-index`, `admin.user-index` y los de Jetstream. Sus clases PHP viven en el backend; aquí solo está la vista.
- Componentes `x-jet-*` de Jetstream, publicados en `resources/views/vendor/jetstream/`.

### Detalles que no son evidentes

- `tailwind.config.js` purga también `./vendor/...` y `./storage/...`, rutas que solo existen en el proyecto Laravel. Un build de producción hecho aquí solo analiza `resources/views/`.
- Hay clases de Tailwind construidas dinámicamente (por ejemplo `bg-{{ $tag->color }}-600` en las vistas del blog). La purga no las detecta por análisis estático.
- `resources/js/Pages/` y `resources/js/Jetstream/` contienen archivos `.vue`, pero Vue no es una dependencia y Mix no los compila. `resources/js/app.js` solo carga `bootstrap.js` y Alpine.
- `public/web/` incluye muchos recursos de la plantilla original que las vistas no referencian (`style-switcher`, `portfolio`, `thumbszoom`, varias imágenes). Verifica el uso con una búsqueda antes de asumir que un archivo está activo.
- No se incluyen `public/index.php`, `public/.htaccess`, `public/web.config` ni `public/storage`, porque pertenecen al servidor y al backend.
- `CRITICA.md` reúne la crítica de diseño del sitio en producción, con hallazgos priorizados (P0 a P3) y evidencia por archivo y línea. Es la base del rediseño; léela antes de proponer cambios visuales. El archivo de cada corrida queda en `.impeccable/critique/`.
- `.gitignore` excluye el material de trabajo de Impeccable (`mocks/`, `review/`, `questions/`).
- Producción (`https://sigemype.com/`) no coincide del todo con este repositorio: muestra una tercera sede y otro teléfono en la barra superior.

## Reglas de contenido

- Textos visibles para el usuario en español neutro con tuteo (público peruano).
- Solo se publican los celulares 951 965 242 y 952 249 102. Los teléfonos fijos no se publican; el inicio ya no los muestra, pero `web/guia.blade.php` todavía sí.
- No se publican precios: los planes muestran "Consultar".
- No inventes testimonios, casos de éxito, fotografías, cifras ni número de colegiatura. Las cifras y los planes válidos están documentados en `PRODUCT.md`.
- El formulario de contacto no tiene backend funcional: el contacto se resuelve con enlaces de WhatsApp, llamada y correo.
- Objetivo de accesibilidad: WCAG 2.1 nivel AA.
- Commits en español con prefijos conventional (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
