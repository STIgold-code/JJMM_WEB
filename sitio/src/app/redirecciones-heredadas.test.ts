import { describe, expect, it } from 'vitest'

import {
  RUTA_DEL_BLOG,
  rutaDeCategoria,
  rutaDeEtiqueta,
  rutaDePublicacion,
} from '@/modulos/blog/dominio/rutas-del-blog'

import { REDIRECCIONES_HEREDADAS } from './redirecciones-heredadas'

const claveDe = (redireccion: (typeof REDIRECCIONES_HEREDADAS)[number]) =>
  JSON.stringify([redireccion.source, redireccion.has ?? [], redireccion.missing ?? []])

const buscar = (source: string, conPagina: boolean) =>
  REDIRECCIONES_HEREDADAS.find(
    (redireccion) => redireccion.source === source && Boolean(redireccion.has) === conPagina,
  )

describe('REDIRECCIONES_HEREDADAS', () => {
  it('todas son 301 entre rutas internas', () => {
    for (const redireccion of REDIRECCIONES_HEREDADAS) {
      expect(redireccion.source, redireccion.source).toMatch(/^\//)
      expect(redireccion.destination, redireccion.source).toMatch(/^\//)
      expect(redireccion).toHaveProperty('statusCode', 301)
      expect(redireccion).not.toHaveProperty('permanent')
    }
  })

  it('no repite una misma regla', () => {
    const claves = REDIRECCIONES_HEREDADAS.map(claveDe)
    expect(new Set(claves).size).toBe(claves.length)
  })

  it('lleva las URL del blog anterior a las nuevas', () => {
    expect(buscar('/blog/posts/:slug', false)?.destination).toBe(rutaDePublicacion(':slug'))
    expect(buscar('/blog/category/:slug', false)?.destination).toBe(rutaDeCategoria(':slug'))
    expect(buscar('/blog/tag/:slug', false)?.destination).toBe(rutaDeEtiqueta(':slug'))
  })

  it('traduce ?page=N a ?pagina=N en un solo salto, también desde las URL anteriores', () => {
    expect(buscar(RUTA_DEL_BLOG, true)?.destination).toBe('/blog?pagina=:pagina')
    expect(buscar('/blog/category/:slug', true)?.destination).toBe(
      `${rutaDeCategoria(':slug')}?pagina=:pagina`,
    )
    expect(buscar('/blog/tag/:slug', true)?.destination).toBe(
      `${rutaDeEtiqueta(':slug')}?pagina=:pagina`,
    )
    expect(buscar(rutaDeCategoria(':slug'), true)).toBeDefined()
    expect(buscar(rutaDeEtiqueta(':slug'), true)).toBeDefined()
  })

  it('las reglas de página van antes que las de ruta, para no dar dos saltos', () => {
    const indice = (source: string, conPagina: boolean) =>
      REDIRECCIONES_HEREDADAS.findIndex(
        (redireccion) => redireccion.source === source && Boolean(redireccion.has) === conPagina,
      )
    expect(indice('/blog/category/:slug', true)).toBeLessThan(indice('/blog/category/:slug', false))
    expect(indice('/blog/tag/:slug', true)).toBeLessThan(indice('/blog/tag/:slug', false))
  })

  it('una regla de página no se vuelve a aplicar sobre su destino (sin bucles)', () => {
    for (const redireccion of REDIRECCIONES_HEREDADAS.filter(({ has }) => has)) {
      expect(redireccion.missing, redireccion.source).toEqual([{ type: 'query', key: 'pagina' }])
    }
  })

  it('el valor de page acepta solo números de página válidos (Next lo ancla con ^…$)', () => {
    const regla = buscar(RUTA_DEL_BLOG, true)
    const [condicion] = regla?.has ?? []
    const patron = new RegExp(`^${condicion && 'value' in condicion ? condicion.value : ''}$`)

    expect('2'.match(patron)?.groups).toEqual({ pagina: '2' })
    expect(patron.test('12')).toBe(true)
    for (const valor of ['0', '02', 'dos', '']) expect(patron.test(valor), valor).toBe(false)
  })

  it('una regla sin condición nunca tiene como origen una ruta del sitio nuevo', () => {
    const rutasNuevas = [RUTA_DEL_BLOG, rutaDeCategoria(':slug'), rutaDeEtiqueta(':slug')]
    for (const redireccion of REDIRECCIONES_HEREDADAS.filter(({ has }) => !has)) {
      expect(rutasNuevas).not.toContain(redireccion.source)
    }
  })

  it('cubre las demás URL públicas que el sitio anterior sirve o enlaza', () => {
    expect(buscar('/guia_clientes.html', false)?.destination).toBe('/guia')
    expect(buscar('/login', false)?.destination).toBe('/admin')
  })
})
