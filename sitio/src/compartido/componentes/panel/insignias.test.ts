import { describe, expect, it } from 'vitest'

import { insigniaDeActivo, insigniaDeMensaje } from './insignias'

describe('insigniaDeMensaje', () => {
  it('destaca los mensajes nuevos', () => {
    expect(insigniaDeMensaje('nuevo')).toEqual({ texto: 'Nuevo', tono: 'atencion' })
  })

  it('muestra los atendidos en un tono tranquilo', () => {
    expect(insigniaDeMensaje('atendido')).toEqual({ texto: 'Atendido', tono: 'neutro' })
  })

  it('no inventa una insignia para un valor desconocido', () => {
    expect(insigniaDeMensaje('otro')).toBeNull()
    expect(insigniaDeMensaje(undefined)).toBeNull()
  })
})

describe('insigniaDeActivo', () => {
  it('dice si se muestra en el sitio', () => {
    expect(insigniaDeActivo(true)).toEqual({ texto: 'Se muestra', tono: 'positivo' })
    expect(insigniaDeActivo(false)).toEqual({ texto: 'Oculto', tono: 'neutro' })
  })

  it('trata un valor vacío como oculto', () => {
    expect(insigniaDeActivo(null)).toEqual({ texto: 'Oculto', tono: 'neutro' })
  })
})
