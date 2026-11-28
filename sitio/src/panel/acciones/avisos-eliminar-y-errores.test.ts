import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_DATOS_DEL_AVISO } from '../aplicacion/gestionar-avisos'
import { ERROR_SIN_PERMISO } from '../aplicacion/gestionar-mensajes'
import { ERROR_DE_CORREO } from '../dominio/respuesta-al-mensaje'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Eliminar avisos y los errores de Payload, con la guardia y el adaptador reales (solo Next y la
// Local API son dobles): un 400 vuelve tipado y nunca rompe la pantalla; cualquier otro error se
// propaga tal cual.
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

const { cambiarVisibilidadDelAviso, eliminarElAviso, guardarElAviso } = await import('./avisos')

const FORMULARIO = {
  titulo: 'Cierre de planilla',
  cuandoAplica: 'Inicia el 20 de cada mes.',
  documentos: 'Permisos\nVacaciones',
  correo: 'recursoshumanos@jjmm.com.pe',
}

const rechazo400 = (...paths: string[]) => ({
  status: 400,
  data: { errors: paths.map((path) => ({ path })) },
})

beforeEach(() => {
  reiniciarDobles({ 'avisos-para-clientes': [{ id: 1, titulo: 'Cierre tributario', orden: 0 }] })
  dobles.delete.mockResolvedValue({ id: 1, titulo: 'Cierre tributario' })
})

describe('eliminarElAviso', () => {
  it('un editor no puede eliminar: no llega a Payload', async () => {
    conSesion(EDITOR)
    expect(await eliminarElAviso(1)).toEqual({ ok: false, error: ERROR_SIN_PERMISO })
    nadaSeEscribio()
  })

  it('el administrador elimina con los permisos de la sesión y revalida', async () => {
    conSesion(ADMINISTRADOR)
    expect(await eliminarElAviso('1')).toEqual({
      ok: true,
      aviso: { titulo: 'Aviso eliminado', detalle: 'Se borró «Cierre tributario».' },
    })
    expect(dobles.delete).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, overrideAccess: false, user: ADMINISTRADOR }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('un id inválido no llega a Payload', async () => {
    conSesion(ADMINISTRADOR)
    expect((await eliminarElAviso([1])).ok).toBe(false)
    nadaSeEscribio()
  })
})

describe('errores de Payload', () => {
  it('un 400 vuelve tipado junto a su campo, sin lanzar ni revalidar', async () => {
    conSesion(EDITOR)
    dobles.update.mockRejectedValueOnce(rechazo400('correoDeContacto', 'documentos.1.texto'))
    expect(await guardarElAviso(1, FORMULARIO)).toEqual({
      estado: 'invalido',
      errores: {
        correo: ERROR_DE_CORREO,
        documentos: 'Revisa los documentos: cada línea debe tener texto.',
      },
    })
    dobles.update.mockRejectedValueOnce({ status: 400 })
    expect(await cambiarVisibilidadDelAviso(1, true)).toEqual({
      ok: false,
      error: ERROR_DE_DATOS_DEL_AVISO,
    })
    dobles.create.mockRejectedValueOnce(rechazo400('otroCampo'))
    expect(await guardarElAviso(null, FORMULARIO)).toEqual({
      estado: 'error',
      error: ERROR_DE_DATOS_DEL_AVISO,
    })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('cualquier otro error se propaga: nunca se muestra como un dato inválido', async () => {
    conSesion(ADMINISTRADOR)
    const caida = Object.assign(new Error('conexión rechazada'), { status: 500 })
    dobles.update.mockRejectedValueOnce(caida)
    await expect(guardarElAviso(1, FORMULARIO)).rejects.toBe(caida)
    dobles.delete.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(eliminarElAviso(1)).rejects.toThrow('sin conexión')
    dobles.update.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(cambiarVisibilidadDelAviso(1, true)).rejects.toThrow('sin conexión')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
