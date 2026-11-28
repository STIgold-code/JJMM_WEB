import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ERROR_DE_DATOS_DE_IMAGEN,
  ERROR_DE_IMAGEN_INEXISTENTE,
} from '../aplicacion/gestionar-imagenes'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Errores de Payload en las acciones de imágenes, con la guardia y el adaptador reales: un 400
// (o un 404) vuelve tipado y nunca rompe la pantalla; cualquier otro error se propaga tal cual.
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

const { eliminarLaImagen, guardarElTextoAlternativo } = await import('./imagenes')

beforeEach(() => {
  reiniciarDobles({ medios: [{ id: 3, filename: 'rueda.webp', alt: 'Rueda' }] })
})

describe('errores de Payload', () => {
  it('un 400 vuelve tipado, sin lanzar ni revalidar', async () => {
    conSesion(EDITOR)
    dobles.update.mockRejectedValueOnce({ status: 400, data: { errors: [{ path: 'alt' }] } })
    expect(await guardarElTextoAlternativo(3, { alt: 'x' })).toEqual({
      estado: 'invalido',
      errores: { alt: 'Revisa el texto alternativo.' },
    })
    dobles.update.mockRejectedValueOnce({ status: 400 })
    expect(await guardarElTextoAlternativo(3, { alt: 'x' })).toEqual({
      estado: 'error',
      error: ERROR_DE_DATOS_DE_IMAGEN,
    })
    conSesion(ADMINISTRADOR)
    dobles.delete.mockRejectedValueOnce({ status: 404 })
    expect(await eliminarLaImagen(3)).toEqual({ ok: false, error: ERROR_DE_IMAGEN_INEXISTENTE })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('cualquier otro error se propaga: nunca se muestra como un dato inválido', async () => {
    conSesion(ADMINISTRADOR)
    dobles.update.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(guardarElTextoAlternativo(3, { alt: 'x' })).rejects.toThrow('sin conexión')
    dobles.delete.mockRejectedValueOnce(Object.assign(new Error('caída'), { status: 500 }))
    await expect(eliminarLaImagen(3)).rejects.toThrow('caída')
    dobles.findGlobal.mockRejectedValueOnce(new Error('base caída'))
    await expect(eliminarLaImagen(3)).rejects.toThrow('base caída')
    expect(dobles.delete).toHaveBeenCalledTimes(1)
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
