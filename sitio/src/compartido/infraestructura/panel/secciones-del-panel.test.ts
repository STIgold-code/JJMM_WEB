import type { SanitizedPermissions } from 'payload'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({ revalidateTag: vi.fn(), unstable_cache: vi.fn() }))

import { COLECCIONES, GLOBALES } from '@/contenido'

import { ORDEN_DE_GRUPOS } from './grupos-del-panel'
import { armarSecciones, entidadesDelPanel } from './secciones-del-panel'

const ENTIDADES = entidadesDelPanel(COLECCIONES, GLOBALES)
const TODO = { create: true, read: true, update: true, delete: true, fields: {} } as const

// Permisos como los arma Payload: el administrador puede todo; el editor no crea cuentas
// (solo edita la suya) ni edita el menú ni la configuración del sitio, que sí puede leer.
const ADMINISTRADOR: SanitizedPermissions = {
  collections: Object.fromEntries(COLECCIONES.map(({ slug }) => [slug, TODO])),
  globals: Object.fromEntries(GLOBALES.map(({ slug }) => [slug, TODO])),
}
const EDITOR: SanitizedPermissions = {
  collections: {
    ...ADMINISTRADOR.collections,
    usuarios: { read: true, update: true, fields: {} },
  },
  globals: {
    ...ADMINISTRADOR.globals,
    navegacion: { read: true, fields: {} },
    'configuracion-del-sitio': { read: true, fields: {} },
  },
}

const clavesDe = (permisos: SanitizedPermissions) =>
  armarSecciones({ entidades: ENTIDADES, permisos, rutaDelPanel: '/admin', conteos: {} }).flatMap(
    ({ entradas }) => entradas.map(({ clave }) => clave),
  )

describe('entidadesDelPanel', () => {
  it('toma la etiqueta, el grupo y la descripción de cada colección y global', () => {
    const sedes = ENTIDADES.find(({ slug }) => slug === 'sedes')
    expect(sedes).toMatchObject({ tipo: 'coleccion', etiqueta: 'Sedes', grupo: 'Sitio' })
    expect(sedes?.descripcion).toMatch(/^Oficinas del estudio\./)
    expect(ENTIDADES).toHaveLength(COLECCIONES.length + GLOBALES.length)
  })
})

describe('armarSecciones', () => {
  it('ordena las secciones como el menú lateral', () => {
    const secciones = armarSecciones({
      entidades: ENTIDADES,
      permisos: ADMINISTRADOR,
      rutaDelPanel: '/admin',
      conteos: {},
    })
    expect(secciones.map(({ grupo }) => grupo)).toEqual([...ORDEN_DE_GRUPOS])
  })

  it('al administrador le muestra todo', () => {
    expect(clavesDe(ADMINISTRADOR)).toHaveLength(ENTIDADES.length)
  })

  it('al editor no le muestra lo que no puede editar', () => {
    const claves = clavesDe(EDITOR)
    expect(claves).not.toContain('coleccion:usuarios')
    expect(claves).not.toContain('global:navegacion')
    expect(claves).not.toContain('global:configuracion-del-sitio')
    expect(claves).toContain('coleccion:publicaciones')
    expect(claves).toContain('global:pagina-de-inicio')
  })

  it('omite una sección que queda vacía', () => {
    const secciones = armarSecciones({
      entidades: ENTIDADES,
      permisos: EDITOR,
      rutaDelPanel: '/admin',
      conteos: {},
    })
    expect(secciones.map(({ grupo }) => grupo)).not.toContain('Administración')
  })

  it('arma rutas reales, usa la primera oración como descripción y agrega el conteo', () => {
    const entradas = armarSecciones({
      entidades: ENTIDADES,
      permisos: ADMINISTRADOR,
      rutaDelPanel: '/admin',
      conteos: { sedes: 2 },
    }).flatMap(({ entradas }) => entradas)
    const sedes = entradas.find(({ clave }) => clave === 'coleccion:sedes')
    const inicio = entradas.find(({ clave }) => clave === 'global:pagina-de-inicio')
    expect(sedes).toMatchObject({
      href: '/admin/collections/sedes',
      descripcion: 'Oficinas del estudio.',
      cantidad: 2,
      icono: 'ubicacion',
    })
    expect(inicio).toMatchObject({ href: '/admin/globals/pagina-de-inicio', cantidad: null })
  })
})
