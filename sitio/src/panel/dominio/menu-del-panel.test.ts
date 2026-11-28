import { describe, expect, it } from 'vitest'

import { esRutaActual, iniciales, menuDelPanel, nombreDelRol } from './menu-del-panel'
import { RUTA_DEL_INICIO } from './rutas-del-panel'

const entradas = (grupos: ReturnType<typeof menuDelPanel>) => grupos.flatMap((g) => g.entradas)

describe('menuDelPanel', () => {
  it('agrupa las secciones por tarea, en el orden de la maqueta', () => {
    expect(menuDelPanel('administrador', { mensajesNuevos: 0 }).map((g) => g.titulo)).toEqual([
      'Atención diaria',
      'Lo que ofreces',
      'Sitio web',
      'Para tus clientes',
      'Administración',
    ])
  })

  it('al editor no le muestra Usuarios, Datos del estudio ni Menú del sitio', () => {
    const textos = entradas(menuDelPanel('editor', { mensajesNuevos: 0 })).map((e) => e.texto)
    expect(textos).not.toContain('Usuarios')
    expect(textos).not.toContain('Datos del estudio')
    expect(textos).not.toContain('Menú del sitio')
    expect(textos).toContain('Mensajes de contacto')
  })

  const SECCIONES_DEL_EQUIPO = [
    expect.objectContaining({ clave: 'inicio', ruta: RUTA_DEL_INICIO }),
    expect.objectContaining({ clave: 'mensajes', ruta: '/panel/mensajes' }),
    expect.objectContaining({ clave: 'planes', ruta: '/panel/planes' }),
    expect.objectContaining({ clave: 'areas', ruta: '/panel/areas' }),
    expect.objectContaining({ clave: 'pagina-de-inicio', ruta: '/panel/pagina-de-inicio' }),
    expect.objectContaining({ clave: 'sedes', ruta: '/panel/sedes' }),
    expect.objectContaining({ clave: 'clientes', ruta: '/panel/clientes' }),
    expect.objectContaining({ clave: 'guia', ruta: '/panel/guia' }),
    expect.objectContaining({ clave: 'medios', ruta: '/panel/imagenes' }),
  ]

  it('para el editor tienen ruta el inicio, los mensajes, los planes, las áreas, la página de inicio, las sedes, los clientes, la guía y las imágenes', () => {
    const todas = entradas(menuDelPanel('editor', { mensajesNuevos: 0 }))
    expect(todas.filter((e) => e.ruta !== null)).toEqual(SECCIONES_DEL_EQUIPO)
    expect(todas.filter((e) => e.ruta === null).map((e) => e.clave)).toEqual(['publicaciones'])
  })

  it('para el administrador, además, «Usuarios» tiene ruta; el resto va sin enlace', () => {
    const todas = entradas(menuDelPanel('administrador', { mensajesNuevos: 0 }))
    expect(todas.filter((e) => e.ruta !== null)).toEqual([
      ...SECCIONES_DEL_EQUIPO,
      expect.objectContaining({ clave: 'usuarios', ruta: '/panel/usuarios' }),
    ])
  })

  it('las entradas solo del administrador existen para él; datos y menú siguen sin ruta', () => {
    const administracion = entradas(menuDelPanel('administrador', { mensajesNuevos: 0 })).filter(
      (e) => ['usuarios', 'configuracion', 'navegacion'].includes(e.clave),
    )
    expect(administracion).toHaveLength(3)
    expect(administracion.filter((e) => e.ruta === null).map((e) => e.clave)).toEqual([
      'configuracion',
      'navegacion',
    ])
  })

  it('«Valores» no tiene entrada propia: se llega desde «Página de inicio»', () => {
    const textos = entradas(menuDelPanel('administrador', { mensajesNuevos: 0 })).map(
      (e) => e.texto,
    )
    expect(textos).not.toContain('Valores')
  })

  it('pone el contador de mensajes nuevos en «Mensajes de contacto»', () => {
    const mensajes = entradas(menuDelPanel('editor', { mensajesNuevos: 3 })).find(
      (e) => e.clave === 'mensajes',
    )
    expect(mensajes?.contador).toBe(3)
  })

  it('sin permiso para contar, el contador queda en cero y no se inventa', () => {
    const mensajes = entradas(menuDelPanel('editor', { mensajesNuevos: null })).find(
      (e) => e.clave === 'mensajes',
    )
    expect(mensajes?.contador).toBe(0)
  })
})

describe('esRutaActual', () => {
  it('marca la sección también en sus páginas internas, salvo el inicio', () => {
    expect(esRutaActual('/panel/planes', '/panel/planes')).toBe(true)
    expect(esRutaActual('/panel/planes', '/panel/planes/7')).toBe(true)
    expect(esRutaActual('/panel/planes', '/panel/planes/filas')).toBe(true)
    expect(esRutaActual('/panel/areas', '/panel/areas/3')).toBe(true)
    expect(esRutaActual('/panel/planes', '/panel/planesx')).toBe(false)
    expect(esRutaActual(RUTA_DEL_INICIO, '/panel/planes')).toBe(false)
    expect(esRutaActual(RUTA_DEL_INICIO, RUTA_DEL_INICIO)).toBe(true)
  })
})

describe('nombreDelRol', () => {
  it('nombra cada rol en español', () => {
    expect(nombreDelRol('administrador')).toBe('Administrador')
    expect(nombreDelRol('editor')).toBe('Editor')
  })
})

describe('iniciales', () => {
  it('toma la inicial de las dos primeras palabras del nombre', () => {
    expect(iniciales('carmen quispe rojas', 'c@x.pe')).toBe('CQ')
  })

  it('sin nombre usa la primera letra del correo', () => {
    expect(iniciales(null, 'estudio@jjmm.pe')).toBe('E')
    expect(iniciales('  ', 'estudio@jjmm.pe')).toBe('E')
  })
})
