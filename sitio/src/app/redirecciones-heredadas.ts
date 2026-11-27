import type { NextConfig } from 'next'

// Redirecciones 301 de las URL del sitio Laravel anterior (S1). Las importa `next.config.ts`,
// así que este archivo no usa alias (`@/`) ni importa código: solo datos.
//
// Verificadas contra producción (sigemype.com, 27/11/2026):
// - /blog/posts/<slug>, /blog/category/<slug> y /blog/tag/<slug> responden 200 y las enlaza /blog;
// - los listados paginan con ?page=N (enlaces de Laravel en /blog?page=2);
// - /login responde 200 y lo enlaza el inicio;
// - /guia enlaza guia_clientes.html, que da 404 pero puede estar indexado o guardado.

type Redireccion = Awaited<ReturnType<NonNullable<NextConfig['redirects']>>>[number]

const PERMANENTE = 301

// ?page=N → ?pagina=N. Next ancla el patrón con ^…$; solo acepta enteros positivos sin ceros
// a la izquierda, como `leerNumeroDePagina`. `missing` evita volver a aplicar la regla sobre
// su destino, porque Next conserva los parámetros de la petición original.
const conPagina = (source: string, destino: string): Redireccion => ({
  source,
  has: [{ type: 'query', key: 'page', value: '(?<pagina>[1-9]\\d*)' }],
  missing: [{ type: 'query', key: 'pagina' }],
  destination: `${destino}?pagina=:pagina`,
  statusCode: PERMANENTE,
})

const simple = (source: string, destination: string): Redireccion => ({
  source,
  destination,
  statusCode: PERMANENTE,
})

// Las reglas con página van primero: así una URL anterior paginada llega en un solo salto.
export const REDIRECCIONES_HEREDADAS: readonly Redireccion[] = [
  conPagina('/blog', '/blog'),
  conPagina('/blog/category/:slug', '/blog/categoria/:slug'),
  conPagina('/blog/tag/:slug', '/blog/etiqueta/:slug'),
  conPagina('/blog/categoria/:slug', '/blog/categoria/:slug'),
  conPagina('/blog/etiqueta/:slug', '/blog/etiqueta/:slug'),
  simple('/blog/posts/:slug', '/blog/:slug'),
  simple('/blog/category/:slug', '/blog/categoria/:slug'),
  simple('/blog/tag/:slug', '/blog/etiqueta/:slug'),
  simple('/guia_clientes.html', '/guia'),
  // El acceso del equipo pasa al panel de Payload.
  simple('/login', '/admin'),
]
