import { describe, expect, it } from 'vitest'

import { filasPendientes, LIMITE_DE_PENDIENTES } from './pendientes'

const mensaje = (id: number, recibido: string, servicio: string | null = 'Constitución') => ({
  id,
  nombre: `Persona ${id}`,
  servicio,
  recibido,
})

describe('filasPendientes', () => {
  it('une mensajes nuevos y borradores, lo más reciente primero', () => {
    const filas = filasPendientes(
      [mensaje(1, '2026-11-25T10:00:00Z'), mensaje(2, '2026-11-27T10:00:00Z')],
      [{ id: 7, titulo: 'Cierre del año', actualizado: '2026-11-26T10:00:00Z' }],
    )
    expect(filas.map((f) => f.clave)).toEqual(['mensaje-2', 'borrador-7', 'mensaje-1'])
  })

  it('«Ver» de un mensaje lo abre en el panel lateral de /panel/mensajes', () => {
    const [mensajeNuevo] = filasPendientes([mensaje(5, '2026-11-27T10:00:00Z')], [])
    expect(mensajeNuevo).toMatchObject({
      titulo: 'Persona 5',
      detalle: 'Constitución',
      tipo: 'Mensaje de contacto',
      href: '/panel/mensajes?mensaje=5',
      etiquetaDeAccion: 'Ver el mensaje de Persona 5',
    })
  })

  it('«Ver» de un borrador sigue abriendo el documento en /admin (sección aún sin panel)', () => {
    const [, borrador] = filasPendientes(
      [mensaje(5, '2026-11-27T10:00:00Z')],
      [{ id: 7, titulo: 'Cierre del año', actualizado: '2026-11-26T10:00:00Z' }],
    )
    expect(borrador).toMatchObject({
      titulo: 'Cierre del año',
      detalle: 'Borrador sin publicar',
      tipo: 'Publicación',
      href: '/admin/collections/publicaciones/7',
      etiquetaDeAccion: 'Ver el borrador «Cierre del año»',
    })
  })

  it('un mensaje sin servicio elegido lo dice, en vez de dejar el dato vacío', () => {
    const [fila] = filasPendientes([mensaje(1, '2026-11-27T10:00:00Z', null)], [])
    expect(fila?.detalle).toBe('Sin servicio indicado')
  })

  it('muestra como máximo el límite de filas', () => {
    const muchos = Array.from({ length: LIMITE_DE_PENDIENTES + 3 }, (_, i) =>
      mensaje(i, `2026-11-${String(10 + i).padStart(2, '0')}T10:00:00Z`),
    )
    expect(filasPendientes(muchos, [])).toHaveLength(LIMITE_DE_PENDIENTES)
  })
})
