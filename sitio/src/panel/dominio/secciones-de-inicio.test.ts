import { describe, expect, it } from 'vitest'

import {
  estaDesactualizada,
  idsDeSecciones,
  leerMarcaDeTiempo,
  reemplazarSeccion,
  reordenarSecciones,
} from './secciones-de-inicio'

// Secciones como las guarda Payload (con campos que el panel no conoce), más un tipo de bloque
// que el panel no reconoce: todo se conserva tal cual.
const CARRUSEL = {
  id: 'a1',
  blockType: 'carrusel-de-portadas',
  segundosPorPortada: 9,
  portadas: [],
}
const QUIENES = {
  id: 'b2',
  blockType: 'quienes-somos',
  titulo: 'Quiénes somos',
  presentacion: { root: { children: [{ type: 'paragraph', version: 1 }] } },
  cifras: [{ id: 'c1', valor: 100, descripcion: 'clientes' }],
}
const DESCONOCIDA = { id: 'z9', blockType: 'bloque-del-futuro', dato: { anidado: [1, 2] } }
const SECCIONES = [CARRUSEL, QUIENES, DESCONOCIDA]

describe('reemplazarSeccion', () => {
  it('cambia solo la sección pedida y deja las demás idénticas (misma referencia)', () => {
    const nuevas = reemplazarSeccion(SECCIONES, 'a1', (s) => ({ ...s, segundosPorPortada: 12 }))
    expect(nuevas).toEqual([{ ...CARRUSEL, segundosPorPortada: 12 }, QUIENES, DESCONOCIDA])
    expect(nuevas?.[1]).toBe(QUIENES)
    expect(nuevas?.[2]).toBe(DESCONOCIDA)
  })

  it('conserva un tipo de bloque desconocido en su lugar', () => {
    const nuevas = reemplazarSeccion(SECCIONES, 'a1', (s) => s)
    expect(nuevas?.map((s) => s.blockType)).toEqual([
      'carrusel-de-portadas',
      'quienes-somos',
      'bloque-del-futuro',
    ])
  })

  it('devuelve null si la sección no existe o el reemplazo la rechaza', () => {
    expect(reemplazarSeccion(SECCIONES, 'no-existe', (s) => s)).toBeNull()
    expect(reemplazarSeccion(SECCIONES, 'b2', () => null)).toBeNull()
  })
})

describe('reordenarSecciones', () => {
  it('devuelve las mismas secciones en el orden pedido', () => {
    const nuevas = reordenarSecciones(SECCIONES, ['z9', 'a1', 'b2'])
    expect(nuevas).toEqual([DESCONOCIDA, CARRUSEL, QUIENES])
    expect(nuevas?.[0]).toBe(DESCONOCIDA)
  })

  it('rechaza una lista que no es exactamente la guardada', () => {
    expect(reordenarSecciones(SECCIONES, ['a1', 'b2'])).toBeNull()
    expect(reordenarSecciones(SECCIONES, ['a1', 'b2', 'b2'])).toBeNull()
    expect(reordenarSecciones(SECCIONES, ['a1', 'b2', 'otra'])).toBeNull()
    expect(reordenarSecciones(SECCIONES, 'a1,b2,z9')).toBeNull()
    expect(reordenarSecciones(SECCIONES, [1, 2, 3])).toBeNull()
  })

  it('rechaza ordenar si alguna sección guardada no tiene id', () => {
    expect(reordenarSecciones([CARRUSEL, { blockType: 'planes' }], ['a1'])).toBeNull()
  })
})

describe('idsDeSecciones', () => {
  it('lista los ids en orden, o null si alguna sección no tiene id', () => {
    expect(idsDeSecciones(SECCIONES)).toEqual(['a1', 'b2', 'z9'])
    expect(idsDeSecciones([CARRUSEL, { blockType: 'planes', id: null }])).toBeNull()
  })
})

describe('estaDesactualizada', () => {
  it('es falsa solo si lo guardado es lo mismo que se cargó en el formulario', () => {
    expect(estaDesactualizada('2026-11-27T10:00:00.000Z', '2026-11-27T10:00:00.000Z')).toBe(false)
    expect(estaDesactualizada('2026-11-27T10:05:00.000Z', '2026-11-27T10:00:00.000Z')).toBe(true)
    expect(estaDesactualizada(null, '2026-11-27T10:00:00.000Z')).toBe(true)
  })
})

describe('leerMarcaDeTiempo', () => {
  it('acepta una fecha ISO y rechaza cualquier otra cosa', () => {
    expect(leerMarcaDeTiempo('2026-11-27T10:00:00.000Z')).toBe('2026-11-27T10:00:00.000Z')
    expect(leerMarcaDeTiempo('')).toBeNull()
    expect(leerMarcaDeTiempo('ayer')).toBeNull()
    expect(leerMarcaDeTiempo(12)).toBeNull()
    expect(leerMarcaDeTiempo('x'.repeat(100))).toBeNull()
  })
})
