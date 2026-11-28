import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Guardar la edición de una sede con la guardia y el adaptador reales (solo Next y Payload son
// dobles): se escriben solo los campos del formulario, ya validados y normalizados.
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

const { guardarLaSede } = await import('./sedes')

const FORMULARIO = {
  nombre: 'Sede San Isidro',
  direccion: 'Calle Gorriones 151',
  distrito: 'San Isidro',
  ciudad: 'Lima',
  celulares: [
    { clave: 1, numero: '951965242', tieneWhatsApp: true },
    { clave: 2, numero: '952 249 102', tieneWhatsApp: false },
  ],
  correo: '',
  mapa: '',
  visible: true,
}

beforeEach(() => {
  reiniciarDobles({ sedes: [{ id: 2, nombre: 'Sede San Isidro', orden: 0 }] })
  dobles.update.mockResolvedValue({ id: 2, nombre: 'Sede San Isidro' })
  conSesion(EDITOR)
})

describe('guardarLaSede', () => {
  it('escribe solo los campos del formulario, ya normalizados, y revalida', async () => {
    // Un campo de más (por ejemplo, un rol) se ignora: nunca llega a Payload.
    const estado = await guardarLaSede('2', { ...FORMULARIO, rol: 'administrador', orden: 99 })
    expect(estado.estado).toBe('guardado')
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'sedes',
        id: 2,
        data: {
          nombre: 'Sede San Isidro',
          direccion: 'Calle Gorriones 151',
          distrito: 'San Isidro',
          ciudad: 'Lima',
          celulares: [
            { numero: '951 965 242', tieneWhatsApp: true },
            { numero: '952 249 102', tieneWhatsApp: false },
          ],
          correo: null,
          enlaceDeMapa: null,
          activo: true,
        },
        overrideAccess: false,
        user: EDITOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('un teléfono fijo no llega a Payload', async () => {
    const celulares = [{ clave: 1, numero: '01 555 1234', tieneWhatsApp: false }]
    const estado = await guardarLaSede(2, { ...FORMULARIO, celulares })
    expect(estado.estado).toBe('invalido')
    nadaSeEscribio()
  })

  it('un mapa que no es de Google Maps no llega a Payload', async () => {
    const estado = await guardarLaSede(2, {
      ...FORMULARIO,
      mapa: 'https://ejemplo.pe/maps/embed?x',
    })
    expect(estado.estado).toBe('invalido')
    nadaSeEscribio()
  })
})
