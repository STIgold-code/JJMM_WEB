import { describe, expect, it } from 'vitest'

import {
  esEstadoDeMensaje,
  estadoDelFiltro,
  LARGO_MAXIMO_DE_BUSQUEDA,
  leerConsultaDeMensajes,
  leerIdDeMensaje,
  puedeEliminarMensajes,
  RUTA_DE_MENSAJES,
  rutaDeMensajes,
} from './mensajes'

describe('leerConsultaDeMensajes', () => {
  it('sin parámetros muestra los nuevos, sin búsqueda, en la primera página y sin mensaje abierto', () => {
    expect(leerConsultaDeMensajes({})).toEqual({
      filtro: 'nuevo',
      busqueda: '',
      pagina: 1,
      mensaje: null,
    })
  })

  it('lee el filtro, la búsqueda, la página y el mensaje abierto de la URL', () => {
    expect(
      leerConsultaDeMensajes({ filtro: 'atendido', q: '  plame ', pagina: '3', mensaje: '42' }),
    ).toEqual({ filtro: 'atendido', busqueda: 'plame', pagina: 3, mensaje: 42 })
    expect(leerConsultaDeMensajes({ filtro: 'todos' }).filtro).toBe('todos')
  })

  it('un filtro desconocido vuelve al predeterminado, nunca a uno inventado', () => {
    expect(leerConsultaDeMensajes({ filtro: 'borrados' }).filtro).toBe('nuevo')
  })

  it('con un parámetro repetido usa el primero', () => {
    expect(leerConsultaDeMensajes({ filtro: ['atendido', 'nuevo'] }).filtro).toBe('atendido')
  })

  it('una página que no es un entero positivo es la primera', () => {
    for (const pagina of ['0', '-2', '1.5', 'abc', '']) {
      expect(leerConsultaDeMensajes({ pagina }).pagina).toBe(1)
    }
  })

  it('un mensaje que no es un id válido no abre nada', () => {
    for (const mensaje of ['0', '-1', 'abc', '2.5', '9'.repeat(20)]) {
      expect(leerConsultaDeMensajes({ mensaje }).mensaje).toBeNull()
    }
  })

  it('recorta la búsqueda al largo máximo', () => {
    const larga = 'a'.repeat(LARGO_MAXIMO_DE_BUSQUEDA + 20)
    expect(leerConsultaDeMensajes({ q: larga }).busqueda).toHaveLength(LARGO_MAXIMO_DE_BUSQUEDA)
  })
})

describe('rutaDeMensajes', () => {
  it('sin nada distinto del predeterminado es la ruta limpia', () => {
    expect(rutaDeMensajes({ filtro: 'nuevo', busqueda: '', pagina: 1, mensaje: null })).toBe(
      RUTA_DE_MENSAJES,
    )
    expect(RUTA_DE_MENSAJES).toBe('/panel/mensajes')
  })

  it('pone en la URL solo lo que cambia, con la búsqueda codificada', () => {
    expect(rutaDeMensajes({ filtro: 'todos', busqueda: 'sac ñ', pagina: 2, mensaje: 7 })).toBe(
      '/panel/mensajes?filtro=todos&q=sac+%C3%B1&pagina=2&mensaje=7',
    )
    expect(rutaDeMensajes({ mensaje: 5 })).toBe('/panel/mensajes?mensaje=5')
  })

  it('ida y vuelta: lo que escribe se lee igual', () => {
    const consulta = { filtro: 'atendido', busqueda: 'igv', pagina: 4, mensaje: 9 } as const
    const parametros = Object.fromEntries(
      new URL(rutaDeMensajes(consulta), 'http://x').searchParams,
    )
    expect(leerConsultaDeMensajes(parametros)).toEqual(consulta)
  })
})

describe('leerIdDeMensaje', () => {
  it('acepta enteros positivos, como número o como texto', () => {
    expect(leerIdDeMensaje(12)).toBe(12)
    expect(leerIdDeMensaje('12')).toBe(12)
  })

  it('rechaza todo lo demás', () => {
    for (const valor of [0, -3, 1.5, Number.NaN, '12a', '', null, undefined, {}, '1e3']) {
      expect(leerIdDeMensaje(valor)).toBeNull()
    }
  })
})

describe('esEstadoDeMensaje', () => {
  it('solo «nuevo» y «atendido» son estados', () => {
    expect(esEstadoDeMensaje('nuevo')).toBe(true)
    expect(esEstadoDeMensaje('atendido')).toBe(true)
    expect(esEstadoDeMensaje('todos')).toBe(false)
    expect(esEstadoDeMensaje(1)).toBe(false)
  })
})

describe('estadoDelFiltro', () => {
  it('«todos» no filtra por estado', () => {
    expect(estadoDelFiltro('nuevo')).toBe('nuevo')
    expect(estadoDelFiltro('atendido')).toBe('atendido')
    expect(estadoDelFiltro('todos')).toBeNull()
  })
})

describe('puedeEliminarMensajes', () => {
  it('solo el administrador elimina mensajes (L4 e)', () => {
    expect(puedeEliminarMensajes('administrador')).toBe(true)
    expect(puedeEliminarMensajes('editor')).toBe(false)
  })
})
