import { describe, expect, it } from 'vitest'

import { saludo, textoDeMensajesNuevos } from './enlace-rapido'

describe('textoDeMensajesNuevos', () => {
  it('no muestra nada cuando no hay mensajes pendientes', () => {
    expect(textoDeMensajesNuevos(0)).toBeNull()
  })

  it('usa el singular para un mensaje', () => {
    expect(textoDeMensajesNuevos(1)).toBe('1 mensaje nuevo')
  })

  it('usa el plural desde dos mensajes', () => {
    expect(textoDeMensajesNuevos(2)).toBe('2 mensajes nuevos')
    expect(textoDeMensajesNuevos(15)).toBe('15 mensajes nuevos')
  })
})

describe('saludo', () => {
  it('saluda por el nombre si la cuenta lo tiene', () => {
    expect(saludo('  Ana ')).toBe('Hola, Ana.')
  })

  it('saluda sin nombre si la cuenta no lo tiene', () => {
    expect(saludo(null)).toBe('Hola.')
    expect(saludo('   ')).toBe('Hola.')
  })
})
