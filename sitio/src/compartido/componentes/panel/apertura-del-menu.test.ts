import { describe, expect, it } from 'vitest'

import { debeAbrirMenu, eleccionAlPulsarElBoton } from './apertura-del-menu'

const ESCRITORIO = { hasta1440: true, hasta1024: false }

describe('debeAbrirMenu', () => {
  it('abre el menú en un escritorio de hasta 1440 px, donde Payload lo cierra al cargar', () => {
    expect(debeAbrirMenu({ ...ESCRITORIO, abierto: false, cerradoPorLaPersona: false })).toBe(true)
  })

  // Payload vuelve a cerrarlo en cada cambio de página: hay que reabrirlo todas las veces,
  // no solo la primera.
  it('lo vuelve a abrir cada vez que Payload lo cierra', () => {
    const estado = { ...ESCRITORIO, abierto: false, cerradoPorLaPersona: false }

    expect(debeAbrirMenu(estado)).toBe(true)
    expect(debeAbrirMenu(estado)).toBe(true)
  })

  it('respeta a quien lo cerró con el botón', () => {
    expect(debeAbrirMenu({ ...ESCRITORIO, abierto: false, cerradoPorLaPersona: true })).toBe(false)
  })

  it('no hace nada si ya está abierto', () => {
    expect(debeAbrirMenu({ ...ESCRITORIO, abierto: true, cerradoPorLaPersona: false })).toBe(false)
  })

  it('no lo toca en pantallas anchas, donde Payload ya respeta la preferencia', () => {
    expect(
      debeAbrirMenu({
        hasta1440: false,
        hasta1024: false,
        abierto: false,
        cerradoPorLaPersona: false,
      }),
    ).toBe(false)
  })

  it('lo deja cerrado en tabletas y celulares, donde el menú tapa la pantalla', () => {
    expect(
      debeAbrirMenu({
        hasta1440: true,
        hasta1024: true,
        abierto: false,
        cerradoPorLaPersona: false,
      }),
    ).toBe(false)
  })
})

describe('eleccionAlPulsarElBoton', () => {
  it('recuerda «cerrado» cuando la persona pulsa el botón con el menú abierto', () => {
    expect(eleccionAlPulsarElBoton(true)).toBe('cerrado')
  })

  it('recuerda «abierto» cuando lo pulsa con el menú cerrado', () => {
    expect(eleccionAlPulsarElBoton(false)).toBe('abierto')
  })
})
