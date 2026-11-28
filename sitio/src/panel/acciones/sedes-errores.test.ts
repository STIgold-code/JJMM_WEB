import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_DATOS_DE_LA_SEDE } from '../aplicacion/gestionar-sedes'
import { ERROR_DE_CELULAR } from '../dominio/respuesta-al-mensaje'
import { ERROR_DE_MAPA } from '../dominio/validacion-de-sede'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Errores de Payload al escribir, con la guardia y el adaptador reales (solo Next y la Local
// API son dobles): un 400 (datos rechazados por la colección) vuelve como resultado tipado y
// nunca rompe la pantalla; cualquier otro error se propaga tal cual.
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

const { cambiarVisibilidadDeLaSede, crearLaSede, eliminarLaSede, guardarLaSede, ordenarLasSedes } =
  await import('./sedes')

const FORMULARIO = {
  nombre: 'Sede San Isidro',
  direccion: 'Calle Gorriones 151',
  distrito: 'San Isidro',
  ciudad: 'Lima',
  celulares: [{ clave: 1, numero: '951965242', tieneWhatsApp: true }],
  correo: '',
  mapa: '',
  visible: true,
}

const rechazo400 = (...paths: string[]) => ({
  status: 400,
  data: { errors: paths.map((path) => ({ path })) },
})

beforeEach(() => {
  reiniciarDobles({
    sedes: [
      { id: 1, nombre: 'Sede San Martín de Porres', orden: 0 },
      { id: 2, nombre: 'Sede San Isidro', orden: 1 },
    ],
  })
  conSesion(EDITOR)
})

describe('cuando Payload rechaza los datos (400)', () => {
  it('cambiarVisibilidadDeLaSede devuelve un aviso claro, sin lanzar ni revalidar', async () => {
    dobles.update.mockRejectedValueOnce({ status: 400 })
    expect(await cambiarVisibilidadDeLaSede(1, true)).toEqual({
      ok: false,
      error: ERROR_DE_DATOS_DE_LA_SEDE,
    })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('ordenarLasSedes deshace la transacción y devuelve un aviso claro', async () => {
    dobles.update.mockResolvedValueOnce({ id: 2 }).mockRejectedValueOnce({ status: 400 })
    expect(await ordenarLasSedes([2, 1])).toEqual({ ok: false, error: ERROR_DE_DATOS_DE_LA_SEDE })
    expect(dobles.rollbackTransaction).toHaveBeenCalledWith('tx-1')
    expect(dobles.commitTransaction).not.toHaveBeenCalled()
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('guardarLaSede devuelve el error junto a su campo', async () => {
    dobles.update.mockRejectedValueOnce(rechazo400('celulares.0.numero', 'enlaceDeMapa'))
    expect(await guardarLaSede(2, FORMULARIO)).toEqual({
      estado: 'invalido',
      errores: { celular: { 0: ERROR_DE_CELULAR }, mapa: ERROR_DE_MAPA },
    })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('crearLaSede con un campo desconocido devuelve un aviso general', async () => {
    dobles.create.mockRejectedValueOnce(rechazo400('otroCampo'))
    expect(await crearLaSede(FORMULARIO)).toEqual({
      estado: 'error',
      error: ERROR_DE_DATOS_DE_LA_SEDE,
    })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})

describe('cualquier otro error de Payload', () => {
  it('se propaga (por ejemplo, la base caída): nunca se muestra como un dato inválido', async () => {
    const caida = Object.assign(new Error('conexión rechazada'), { status: 500 })
    dobles.update.mockRejectedValueOnce(caida)
    await expect(cambiarVisibilidadDeLaSede(1, true)).rejects.toBe(caida)
    dobles.update.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(guardarLaSede(2, FORMULARIO)).rejects.toThrow('sin conexión')
    dobles.create.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(crearLaSede(FORMULARIO)).rejects.toThrow('sin conexión')
    conSesion(ADMINISTRADOR)
    dobles.delete.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(eliminarLaSede(1)).rejects.toThrow('sin conexión')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
