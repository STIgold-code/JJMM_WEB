import { describe, expect, it, vi } from 'vitest'

import { ERROR_DE_CELULAR, ERROR_DE_CORREO } from '../dominio/respuesta-al-mensaje'
import { ERROR_DE_MAPA } from '../dominio/validacion-de-sede'
import { ERROR_DE_DATOS_DE_LA_SEDE, type RepositorioDeEscrituraDeSedes } from './gestionar-sedes'
import { crearSede, guardarSede } from './guardar-sede'

const FORMULARIO = {
  nombre: 'Sede Lima Norte',
  direccion: 'Av. Ejemplo 123',
  distrito: 'Los Olivos',
  ciudad: 'Lima',
  celulares: [{ clave: 1, numero: '951965242', tieneWhatsApp: true }],
  correo: '',
  mapa: '',
  visible: false,
}

function repositorio(cambios: Partial<RepositorioDeEscrituraDeSedes> = {}) {
  return {
    listarPosiciones: vi.fn(async () => [
      { id: 1, orden: 0 },
      { id: 2, orden: 3 },
    ]),
    cambiarVisibilidad: vi.fn(),
    reordenar: vi.fn(),
    crear: vi.fn(async () => ({ estado: 'hecho' as const, id: 7 })),
    guardar: vi.fn(async () => ({ estado: 'hecho' as const })),
    eliminar: vi.fn(),
    ...cambios,
  }
}

describe('guardarSede', () => {
  it('guarda los datos validados y avisa', async () => {
    const repo = repositorio()
    const estado = await guardarSede(repo, { id: '4', formulario: FORMULARIO })
    expect(estado.estado).toBe('guardado')
    expect(repo.guardar).toHaveBeenCalledWith(
      4,
      expect.objectContaining({ celulares: [{ numero: '951 965 242', tieneWhatsApp: true }] }),
    )
  })

  it('con errores no llega al repositorio', async () => {
    const repo = repositorio()
    const estado = await guardarSede(repo, { id: 4, formulario: { ...FORMULARIO, nombre: '' } })
    expect(estado.estado).toBe('invalido')
    expect(repo.guardar).not.toHaveBeenCalled()
  })

  it('lo que la colección rechaza vuelve junto a su campo', async () => {
    const campos = ['celulares.0.numero', 'correo', 'enlaceDeMapa']
    const repo = repositorio({ guardar: async () => ({ estado: 'invalido', campos }) })
    expect(await guardarSede(repo, { id: 4, formulario: FORMULARIO })).toEqual({
      estado: 'invalido',
      errores: { celular: { 0: ERROR_DE_CELULAR }, correo: ERROR_DE_CORREO, mapa: ERROR_DE_MAPA },
    })
  })

  it('un rechazo sin campo conocido es un aviso general', async () => {
    const repo = repositorio({ guardar: async () => ({ estado: 'invalido', campos: ['otro'] }) })
    expect(await guardarSede(repo, { id: 4, formulario: FORMULARIO })).toEqual({
      estado: 'error',
      error: ERROR_DE_DATOS_DE_LA_SEDE,
    })
  })
})

describe('crearSede', () => {
  it('crea la sede al final de la lista', async () => {
    const repo = repositorio()
    const estado = await crearSede(repo, { formulario: FORMULARIO })
    expect(estado).toEqual(expect.objectContaining({ estado: 'creado', id: 7 }))
    expect(repo.crear).toHaveBeenCalledWith(expect.objectContaining({ visible: false }), 4)
  })
})
