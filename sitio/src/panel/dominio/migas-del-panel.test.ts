import { describe, expect, it } from 'vitest'

import { migasDeRuta } from './migas-del-panel'
import { RUTA_DEL_INICIO } from './rutas-del-panel'

describe('migasDeRuta', () => {
  it('el inicio del panel es «Inicio»', () => {
    expect(migasDeRuta(RUTA_DEL_INICIO)).toEqual([{ texto: 'Inicio', ruta: null }])
  })

  it('una sección cuelga del inicio, que lleva enlace', () => {
    expect(migasDeRuta('/panel/mensajes')).toEqual([
      { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
      { texto: 'Mensajes de contacto', ruta: null },
    ])
    expect(migasDeRuta('/panel/guia')).toEqual([
      { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
      { texto: 'Guía de clientes', ruta: null },
    ])
    expect(migasDeRuta('/panel/imagenes')).toEqual([
      { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
      { texto: 'Imágenes', ruta: null },
    ])
    expect(migasDeRuta('/panel/clientes')).toEqual([
      { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
      { texto: 'Clientes', ruta: null },
    ])
  })

  it('la edición de un plan cuelga de «Planes», que lleva enlace', () => {
    expect(migasDeRuta('/panel/planes/7')).toEqual([
      { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
      { texto: 'Planes', ruta: '/panel/planes' },
      { texto: 'Editar plan', ruta: null },
    ])
  })

  it('«Filas de la tabla» cuelga de «Planes», como en la maqueta', () => {
    expect(migasDeRuta('/panel/planes/filas')).toEqual([
      { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
      { texto: 'Planes', ruta: '/panel/planes' },
      { texto: 'Filas de la tabla', ruta: null },
    ])
  })

  it('las áreas y la edición de un área', () => {
    expect(migasDeRuta('/panel/areas')).toEqual([
      { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
      { texto: 'Áreas de servicio', ruta: null },
    ])
    expect(migasDeRuta('/panel/areas/3')).toEqual([
      { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
      { texto: 'Áreas de servicio', ruta: '/panel/areas' },
      { texto: 'Editar área', ruta: null },
    ])
  })

  it('la edición y la creación de una sede cuelgan de «Sedes»', () => {
    const seccion = [
      { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
      { texto: 'Sedes', ruta: '/panel/sedes' },
    ]
    expect(migasDeRuta('/panel/sedes/2')).toEqual([
      ...seccion,
      { texto: 'Editar sede', ruta: null },
    ])
    expect(migasDeRuta('/panel/sedes/nueva')).toEqual([
      ...seccion,
      { texto: 'Nueva sede', ruta: null },
    ])
  })

  it('«Usuarios» cuelga del inicio y «Mi cuenta», que no está en el menú, también', () => {
    expect(migasDeRuta('/panel/usuarios')).toEqual([
      { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
      { texto: 'Usuarios', ruta: null },
    ])
    expect(migasDeRuta('/panel/cuenta')).toEqual([
      { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
      { texto: 'Mi cuenta', ruta: null },
    ])
  })

  it('una ruta que no es del menú se queda en «Inicio»', () => {
    expect(migasDeRuta('/panel/planesx')).toEqual([{ texto: 'Inicio', ruta: null }])
  })
})
