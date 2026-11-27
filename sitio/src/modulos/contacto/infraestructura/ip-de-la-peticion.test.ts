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

  it('agrupa las direcciones IPv6 por su prefijo /64', () => {
    const una = new Headers({ 'x-real-ip': '2001:db8:abcd:12:1111:2222:3333:4444' })
    const otra = new Headers({ 'x-real-ip': '2001:db8:abcd:12::9' })

    expect(ipDeLaPeticion(una, 'x-real-ip')).toBe('2001:db8:abcd:12::/64')
    expect(ipDeLaPeticion(otra, 'x-real-ip')).toBe('2001:db8:abcd:12::/64')
  })

  it('expande la forma abreviada de IPv6 antes de tomar el prefijo', () => {
    const encabezados = new Headers({ 'x-real-ip': '2001:db8::1' })

    expect(ipDeLaPeticion(encabezados, 'x-real-ip')).toBe('2001:db8:0:0::/64')
  })
})
