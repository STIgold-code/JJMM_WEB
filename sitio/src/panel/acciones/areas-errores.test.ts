import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TEXTOS_DE_AREAS } from '../aplicacion/gestionar-areas'
import { ERROR_DE_POLIGONO } from '../dominio/validacion-de-area'
import { conSesion, dobles, EDITOR, reiniciarDobles } from './prueba/dobles-de-payload'

// Los errores de Payload en las acciones de áreas, con la guardia y el adaptador reales (solo Next
// y la Local API son dobles): un 400 vuelve tipado y nunca rompe la pantalla; cualquier otro
// error se propaga tal cual.
vi.mock('next/headers', () => ({ headers: async () => new Headers() }))
vi.mock('next/navigation', async () => ({
  redirect: (await import('./prueba/dobles-de-payload')).redireccionDePrueba,
}))
vi.mock('next/cache', async () => ({
  revalidatePath: (await import('./prueba/dobles-de-payload')).dobles.revalidatePath,
}))
vi.mock('@/compartido/infraestructura/instancia-payload', async () => {
  const { payloadDoble } = await import('./prueba/dobles-de-payload')
  return { obtenerPayload: async () => payloadDoble }
})

const { guardarElArea, ordenarLasAreas } = await import('./areas')

const FORMULARIO = {
  nombre: 'Legal',
  nombreCorto: 'Legal',
  descripcion: 'Abogados y contadores.',
  puntos: ['Asesoría legal', 'Servicios legales'],
  mensaje: '',
  poligono: '72.8,155.8 174.1,78.7 216.5,191.5',
}

const rechazo400 = (...paths: string[]) => ({
  status: 400,
  data: { errors: paths.map((path) => ({ path })) },
})

beforeEach(() => {
  reiniciarDobles({
    'areas-de-servicio': [
      { id: 1, nombre: 'Legal', orden: 0 },
      { id: 2, nombre: 'Tributaria', orden: 1 },
    ],
  })
  conSesion(EDITOR)
})

describe('errores de Payload en las áreas', () => {
  it('un 400 vuelve tipado junto a su campo, sin lanzar ni revalidar', async () => {
    dobles.update.mockRejectedValueOnce(rechazo400('poligonoEnLaRueda', 'puntos.1.texto'))
    expect(await guardarElArea(1, FORMULARIO)).toEqual({
      estado: 'invalido',
      errores: { poligono: ERROR_DE_POLIGONO, punto: { 1: 'Revisa este punto.' } },
    })
    dobles.update.mockRejectedValueOnce(rechazo400('codigo'))
    expect(await guardarElArea(1, FORMULARIO)).toEqual({
      estado: 'error',
      error: TEXTOS_DE_AREAS.invalido,
    })
    dobles.update.mockRejectedValueOnce({ status: 404 })
    expect(await guardarElArea(1, FORMULARIO)).toEqual({
      estado: 'error',
      error: TEXTOS_DE_AREAS.inexistente,
    })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('cualquier otro error se propaga: nunca se muestra como un dato inválido', async () => {
    const caida = Object.assign(new Error('conexión rechazada'), { status: 500 })
    dobles.update.mockRejectedValueOnce(caida)
    await expect(guardarElArea(1, FORMULARIO)).rejects.toBe(caida)
    dobles.update.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(ordenarLasAreas([2, 1])).rejects.toThrow('sin conexión')
    expect(dobles.rollbackTransaction).toHaveBeenCalledWith('tx-1')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
