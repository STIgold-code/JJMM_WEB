import { describe, expect, it } from 'vitest'

import { pestanaPorTecla } from './pestana-por-tecla'

// Rejilla de 3 × 3 (P1–P9), como la v4.
const mover = (actual: number, tecla: string) => pestanaPorTecla(actual, tecla, 9, 3)

describe('pestanaPorTecla', () => {
  it('mueve una pestaña con las flechas izquierda y derecha, dando la vuelta', () => {
    expect(mover(0, 'ArrowRight')).toBe(1)
    expect(mover(8, 'ArrowRight')).toBe(0)
    expect(mover(0, 'ArrowLeft')).toBe(8)
  })

  it('mueve una fila (tres pestañas) con las flechas arriba y abajo, dando la vuelta', () => {
    expect(mover(1, 'ArrowDown')).toBe(4)
    expect(mover(7, 'ArrowDown')).toBe(1)
    expect(mover(1, 'ArrowUp')).toBe(7)
  })

  it('va a la primera y a la última con Inicio y Fin', () => {
    expect(mover(4, 'Home')).toBe(0)
    expect(mover(4, 'End')).toBe(8)
  })

  it('ignora otras teclas', () => {
    expect(mover(4, 'Enter')).toBeNull()
    expect(mover(4, 'a')).toBeNull()
  })
})
