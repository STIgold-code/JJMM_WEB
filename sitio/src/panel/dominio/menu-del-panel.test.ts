import { describe, expect, it } from 'vitest'

import { iniciales, menuDelPanel, migasDeRuta, nombreDelRol } from './menu-del-panel'
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

  it('solo el inicio tiene ruta: el resto aún no existe y va sin enlace', () => {
    const conRuta = entradas(menuDelPanel('administrador', { mensajesNuevos: 0 })).filter(
      (e) => e.ruta !== null,
    )
    expect(conRuta).toEqual([expect.objectContaining({ clave: 'inicio', ruta: RUTA_DEL_INICIO })])
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

describe('migasDeRuta', () => {
  it('el inicio del panel es «Inicio»', () => {
    expect(migasDeRuta(RUTA_DEL_INICIO)).toEqual([{ texto: 'Inicio', ruta: null }])
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
