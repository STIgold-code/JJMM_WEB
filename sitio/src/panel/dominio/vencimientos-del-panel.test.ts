import { describe, expect, it } from 'vitest'

import {
  contarSinFecha,
  filtrarVencimientos,
  filtrosDeVencimientos,
  formularioDeVencimiento,
  hayCambiosEnElVencimiento,
  sinFechaPublicada,
  textoSinVencimientos,
  type VencimientoDelPanel,
} from './vencimientos-del-panel'

const vencimiento = (
  id: number,
  obligacion: string,
  periodicidad: VencimientoDelPanel['periodicidad'],
  cuandoVence = 'Los 07 de cada mes.',
): VencimientoDelPanel => ({ id, obligacion, periodicidad, cuandoVence, nota: null, orden: id })

const LISTA = [
  vencimiento(1, 'PDT 621 (IGV y Renta)', 'mensual'),
  vencimiento(2, 'CONAFOVICER', 'mensual', 'Consulta la fecha con el estudio.'),
  vencimiento(3, 'Declaración jurada anual', 'anual', 'Inicia la declaración el 01 de marzo.'),
  vencimiento(4, 'SENCICO', 'anual', ' consulta la fecha con el estudio '),
]

describe('sinFechaPublicada', () => {
  it('reconoce el texto de la guía para las obligaciones sin fecha, sin importar mayúsculas', () => {
    expect(sinFechaPublicada('Consulta la fecha con el estudio.')).toBe(true)
    expect(sinFechaPublicada(' consulta la fecha con el estudio ')).toBe(true)
    expect(sinFechaPublicada('Los 07 de cada mes.')).toBe(false)
  })

  it('cuenta las obligaciones sin fecha publicada', () => {
    expect(contarSinFecha(LISTA)).toBe(2)
  })
})

describe('filtrosDeVencimientos', () => {
  it('cuenta todos, mensuales y anuales', () => {
    expect(filtrosDeVencimientos(LISTA)).toEqual([
      { filtro: 'todos', texto: 'Todos', cantidad: 4 },
      { filtro: 'mensual', texto: 'Mensuales', cantidad: 2 },
      { filtro: 'anual', texto: 'Anuales', cantidad: 2 },
    ])
  })
})

describe('filtrarVencimientos', () => {
  it('filtra por periodicidad y respeta el orden del panel', () => {
    expect(filtrarVencimientos(LISTA, 'anual', '').map((v) => v.id)).toEqual([3, 4])
  })

  it('busca en la obligación sin tildes ni mayúsculas', () => {
    expect(filtrarVencimientos(LISTA, 'todos', 'declaracion').map((v) => v.id)).toEqual([3])
    expect(filtrarVencimientos(LISTA, 'mensual', 'declaracion')).toEqual([])
  })
})

describe('textoSinVencimientos', () => {
  it('explica qué falta según el filtro o la búsqueda', () => {
    expect(textoSinVencimientos('todos', '')).toBe('No hay vencimientos.')
    expect(textoSinVencimientos('anual', '')).toBe('No hay vencimientos anuales.')
    expect(textoSinVencimientos('mensual', ' itan ')).toBe(
      'Ninguna obligación coincide con «itan». Prueba con otra palabra.',
    )
  })
})

describe('formularioDeVencimiento', () => {
  it('uno nuevo empieza vacío y mensual; uno guardado trae sus datos', () => {
    expect(formularioDeVencimiento(null)).toEqual({
      obligacion: '',
      periodicidad: 'mensual',
      cuandoVence: '',
      nota: '',
    })
    expect(formularioDeVencimiento({ ...LISTA[2]!, nota: 'Solo si superas el monto.' })).toEqual({
      obligacion: 'Declaración jurada anual',
      periodicidad: 'anual',
      cuandoVence: 'Inicia la declaración el 01 de marzo.',
      nota: 'Solo si superas el monto.',
    })
  })

  it('detecta cambios campo por campo', () => {
    const original = formularioDeVencimiento(LISTA[0]!)
    expect(hayCambiosEnElVencimiento(original, { ...original })).toBe(false)
    expect(hayCambiosEnElVencimiento(original, { ...original, periodicidad: 'anual' })).toBe(true)
  })
})
