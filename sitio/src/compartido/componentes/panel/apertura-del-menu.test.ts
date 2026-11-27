import { describe, expect, it } from 'vitest'

import { debeAbrirMenu } from './apertura-del-menu'

describe('debeAbrirMenu', () => {
  it('abre el menú en un escritorio de hasta 1440 px, donde Payload lo cierra al cargar', () => {
    expect(
      debeAbrirMenu({ hasta1440: true, hasta1024: false, abierto: false, yaAbierto: false }),
    ).toBe(true)
  })

  it('no lo toca en pantallas anchas, donde Payload ya respeta la preferencia', () => {
    expect(
      debeAbrirMenu({ hasta1440: false, hasta1024: false, abierto: false, yaAbierto: false }),
    ).toBe(false)
  })

  it('lo deja cerrado en tabletas y celulares, donde el menú tapa la pantalla', () => {
    expect(
      debeAbrirMenu({ hasta1440: true, hasta1024: true, abierto: false, yaAbierto: false }),
    ).toBe(false)
  })

  it('lo abre una sola vez: si la persona lo cerró, no lo vuelve a abrir', () => {
    expect(
      debeAbrirMenu({ hasta1440: true, hasta1024: false, abierto: false, yaAbierto: true }),
    ).toBe(false)
    expect(
      debeAbrirMenu({ hasta1440: true, hasta1024: false, abierto: true, yaAbierto: false }),
    ).toBe(false)
  })
})
