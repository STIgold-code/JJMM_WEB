import { describe, expect, it, vi } from 'vitest'

import { MENSAJES_POR_PAGINA } from '../dominio/lista-de-mensajes'
import type { ConsultaDeMensajes } from '../dominio/mensajes'
import {
  type FiltroDeLectura,
  type MensajeDeContacto,
  obtenerMensajes,
  type RepositorioDeLecturaDeMensajes,
} from './consultar-mensajes'

const mensaje = (id: number): MensajeDeContacto => ({
  id,
  nombre: `Persona ${id}`,
  servicio: null,
  mensaje: 'Hola',
  estado: 'nuevo',
  celular: null,
  correo: null,
  recibido: '2026-11-27T10:00:00Z',
})

const CONSULTA: ConsultaDeMensajes = { filtro: 'nuevo', busqueda: '', pagina: 1, mensaje: null }

function repositorio(conteos: { nuevo: number; atendido: number; total?: number }) {
  return {
    contar: vi.fn(async ({ estado, busqueda }: FiltroDeLectura) => {
      if (estado === null && busqueda === '') return conteos.total ?? 0
      return estado === null ? 0 : conteos[estado]
    }),
    listar: vi.fn(async () => [mensaje(1)]),
    buscar: vi.fn(async (id: number) => (id === 9 ? mensaje(9) : null)),
  } satisfies RepositorioDeLecturaDeMensajes
}

describe('obtenerMensajes', () => {
  it('cuenta cada filtro con la búsqueda aplicada y lista el filtro elegido', async () => {
    const repo = repositorio({ nuevo: 2, atendido: 3 })
    const datos = await obtenerMensajes(repo, { ...CONSULTA, filtro: 'atendido' })
    expect(datos.filtros.map((f) => f.cantidad)).toEqual([2, 3, 5])
    expect(datos.hayMensajes).toBe(true)
    expect(repo.listar).toHaveBeenCalledWith(
      { estado: 'atendido', busqueda: '' },
      1,
      MENSAJES_POR_PAGINA,
    )
    expect(datos.paginacion).toMatchObject({ total: 3, desde: 1, hasta: 3 })
  })

  it('«Todos» lista sin filtrar por estado', async () => {
    const repo = repositorio({ nuevo: 1, atendido: 1 })
    await obtenerMensajes(repo, { ...CONSULTA, filtro: 'todos', busqueda: 'igv' })
    expect(repo.listar).toHaveBeenCalledWith(
      { estado: null, busqueda: 'igv' },
      1,
      MENSAJES_POR_PAGINA,
    )
  })

  it('sin ningún mensaje no consulta la lista y avisa que no hay mensajes', async () => {
    const repo = repositorio({ nuevo: 0, atendido: 0 })
    const datos = await obtenerMensajes(repo, CONSULTA)
    expect(datos.hayMensajes).toBe(false)
    expect(datos.mensajes).toEqual([])
    expect(repo.listar).not.toHaveBeenCalled()
  })

  it('con una búsqueda sin resultados sigue sabiendo que hay mensajes (otro estado vacío)', async () => {
    const repo = repositorio({ nuevo: 0, atendido: 0, total: 4 })
    const datos = await obtenerMensajes(repo, { ...CONSULTA, busqueda: 'nada' })
    expect(datos.hayMensajes).toBe(true)
    expect(datos.mensajes).toEqual([])
  })

  it('una página fuera de rango pide la última', async () => {
    const repo = repositorio({ nuevo: MENSAJES_POR_PAGINA + 1, atendido: 0 })
    await obtenerMensajes(repo, { ...CONSULTA, pagina: 7 })
    expect(repo.listar).toHaveBeenCalledWith(expect.anything(), 2, MENSAJES_POR_PAGINA)
  })

  it('trae el mensaje abierto aunque no esté en la página; uno inexistente no abre nada', async () => {
    const repo = repositorio({ nuevo: 1, atendido: 0 })
    expect((await obtenerMensajes(repo, { ...CONSULTA, mensaje: 9 })).seleccionado?.id).toBe(9)
    expect((await obtenerMensajes(repo, { ...CONSULTA, mensaje: 4 })).seleccionado).toBeNull()
    expect((await obtenerMensajes(repo, CONSULTA)).seleccionado).toBeNull()
    expect(repo.buscar).toHaveBeenCalledTimes(2)
  })
})
