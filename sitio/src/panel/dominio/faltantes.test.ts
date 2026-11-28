import { describe, expect, it } from 'vitest'

import { cantidadPorCompletar, digitosConFecha, faltantesDelSitio, porcentaje } from './faltantes'

describe('digitosConFecha', () => {
  it('cuenta los dígitos del 0 al 9 que tienen fecha, sin repetir', () => {
    expect(
      digitosConFecha([
        { digito: 0, fecha: '2026-12-15' },
        { digito: 1, fecha: '2026-12-16' },
        { digito: 1, fecha: '2026-12-16' },
        { digito: 2, fecha: '' },
        { digito: 12, fecha: '2026-12-16' },
      ]),
    ).toBe(2)
  })

  it('sin cronograma son cero dígitos', () => {
    expect(digitosConFecha(null)).toBe(0)
  })
})

describe('porcentaje', () => {
  it('redondea a un decimal y nunca pasa de 100', () => {
    expect(porcentaje(11, 14)).toBe(78.6)
    expect(porcentaje(3, 1)).toBe(100)
    expect(porcentaje(0, 0)).toBe(0)
  })
})

describe('faltantesDelSitio', () => {
  const COMPLETO = {
    digitosDelCronograma: 10,
    sedes: { activas: 2, conCelular: 2 },
    publicadas: 3,
  }

  it('arma el cronograma de SUNAT sobre 10 dígitos', () => {
    const [cronograma] = faltantesDelSitio({ ...COMPLETO, digitosDelCronograma: 0 })
    expect(cronograma).toMatchObject({
      clave: 'cronograma',
      texto: 'Cargar el cronograma de SUNAT por dígito del RUC',
      actual: 0,
      total: 10,
      etiqueta: '0 de 10 dígitos',
      completo: false,
      href: '/panel/guia#cronograma',
    })
  })

  it('cuenta las sedes activas con al menos un celular', () => {
    const sedes = faltantesDelSitio({ ...COMPLETO, sedes: { activas: 2, conCelular: 1 } })[1]
    expect(sedes).toMatchObject({ actual: 1, total: 2, etiqueta: '1 de 2 sedes', completo: false })
  })

  it('las sedes llevan a su sección del panel', () => {
    expect(faltantesDelSitio(COMPLETO)[1]?.href).toBe('/panel/sedes')
  })

  it('pide la primera publicación del blog hasta que haya una publicada', () => {
    const sinPublicar = faltantesDelSitio({ ...COMPLETO, publicadas: 0 })[2]
    const conTres = faltantesDelSitio(COMPLETO)[2]
    expect(sinPublicar).toMatchObject({ actual: 0, total: 1, etiqueta: '0 publicadas' })
    expect(conTres).toMatchObject({ actual: 1, total: 1, etiqueta: '3 publicadas', completo: true })
  })

  it('omite lo que la cuenta no puede leer y las sedes cuando no hay ninguna activa', () => {
    const faltantes = faltantesDelSitio({
      digitosDelCronograma: null,
      sedes: { activas: 0, conCelular: 0 },
      publicadas: 1,
    })
    expect(faltantes.map((f) => f.clave)).toEqual(['publicaciones'])
  })

  it('cuenta como «por completar» solo lo que no está completo', () => {
    expect(cantidadPorCompletar(faltantesDelSitio(COMPLETO))).toBe(0)
    expect(
      cantidadPorCompletar(
        faltantesDelSitio({ ...COMPLETO, digitosDelCronograma: 4, publicadas: 0 }),
      ),
    ).toBe(2)
  })
})
