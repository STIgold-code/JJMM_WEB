import { describe, expect, it } from 'vitest'

import { esRutaActual, migasDeRuta } from './menu-del-panel'
import {
  RUTA_DE_LA_PAGINA_DE_INICIO,
  rutaDelCarrusel,
  resumenDeSeccion,
  type SeccionLeida,
} from './pagina-de-inicio'
import { RUTA_DEL_INICIO } from './rutas-del-panel'

const leida = (cambios: Partial<SeccionLeida>): SeccionLeida => ({
  id: 'a1',
  tipo: 'carrusel-de-portadas',
  titulo: null,
  portadas: null,
  segundos: null,
  cifras: null,
  ...cambios,
})

describe('resumenDeSeccion', () => {
  it('el carrusel se edita aquí y dice cuántas portadas tiene y cuánto dura cada una', () => {
    expect(resumenDeSeccion(leida({ portadas: 4, segundos: 9 }))).toEqual({
      clave: 'a1',
      id: 'a1',
      nombre: 'Carrusel de portadas',
      detalle: '4 portadas, 9 segundos cada una',
      icono: 'diseno',
      editar: rutaDelCarrusel('a1'),
      irA: null,
    })
    expect(resumenDeSeccion(leida({ portadas: 1, segundos: 1 })).detalle).toBe(
      '1 portada, 1 segundo cada una',
    )
  })

  it('las demás secciones usan su título, no se editan aún y enlazan a su lista', () => {
    const planes = resumenDeSeccion(leida({ id: 'p1', tipo: 'planes', titulo: 'Nuestros planes' }))
    expect(planes).toMatchObject({
      nombre: 'Nuestros planes',
      editar: null,
      irA: { texto: 'Ir a Planes', ruta: '/panel/planes' },
    })
    expect(resumenDeSeccion(leida({ tipo: 'quienes-somos', titulo: '', cifras: 4 }))).toMatchObject(
      {
        nombre: 'Quiénes somos',
        detalle: 'Presentación del estudio y 4 cifras',
      },
    )
  })

  it('un tipo que el panel no conoce se muestra como tal y no se edita', () => {
    expect(resumenDeSeccion(leida({ tipo: 'bloque-del-futuro' }))).toMatchObject({
      nombre: 'Sección sin nombre',
      editar: null,
    })
  })

  it('un carrusel sin id no se puede abrir', () => {
    expect(resumenDeSeccion(leida({ id: null }), 3)).toMatchObject({
      clave: 'posicion-3',
      editar: null,
    })
  })
})

describe('rutas', () => {
  it('el carrusel cuelga de «Página de inicio», que queda marcada en el menú', () => {
    expect(migasDeRuta('/panel/pagina-de-inicio')).toEqual([
      { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
      { texto: 'Página de inicio', ruta: null },
    ])
    expect(migasDeRuta('/panel/pagina-de-inicio/portadas')).toEqual([
      { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
      { texto: 'Página de inicio', ruta: '/panel/pagina-de-inicio' },
      { texto: 'Carrusel de portadas', ruta: null },
    ])
    expect(esRutaActual('/panel/pagina-de-inicio', '/panel/pagina-de-inicio/portadas')).toBe(true)
  })

  it('el carrusel se abre con el id de su sección', () => {
    expect(RUTA_DE_LA_PAGINA_DE_INICIO).toBe('/panel/pagina-de-inicio')
    expect(rutaDelCarrusel('6745 a')).toBe('/panel/pagina-de-inicio/portadas?seccion=6745%20a')
  })
})
