import { describe, expect, it } from 'vitest'

import { ipDeLaPeticion } from './ip-de-la-peticion'

describe('ipDeLaPeticion', () => {
  it('lee solo el encabezado configurado como confiable', () => {
    const encabezados = new Headers({ 'x-real-ip': '200.1.1.1', 'cf-connecting-ip': '9.9.9.9' })

    expect(ipDeLaPeticion(encabezados, 'x-real-ip')).toBe('200.1.1.1')
    expect(ipDeLaPeticion(encabezados, 'cf-connecting-ip')).toBe('9.9.9.9')
  })

  it('toma la primera dirección de una lista', () => {
    const encabezados = new Headers({ 'x-forwarded-for': '200.1.1.1, 10.0.0.1' })

    expect(ipDeLaPeticion(encabezados, 'x-forwarded-for')).toBe('200.1.1.1')
  })

  it('agrupa como «desconocida» la petición sin el encabezado', () => {
    expect(ipDeLaPeticion(new Headers(), 'x-real-ip')).toBe('desconocida')
  })
})
