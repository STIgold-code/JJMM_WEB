import { describe, expect, it, vi } from 'vitest'

import type { UsoDeImagen } from '../dominio/usos-de-imagenes'
import {
  type FiltroDeLectura,
  type ImagenDelPanel,
  obtenerImagenes,
  type RepositorioDeLecturaDeImagenes,
} from './consultar-imagenes'

const imagen = (id: number, nombre: string): ImagenDelPanel => ({
  id,
  nombre,
  alt: `Alt de ${nombre}`,
  url: `/api/medios/file/${nombre}`,
  ancho: 100,
  alto: 100,
  mime: 'image/webp',
  tamano: 1000,
})

const BIBLIOTECA = [imagen(1, 'logo.png'), imagen(2, 'portada.webp'), imagen(3, 'suelta.webp')]
const USOS: UsoDeImagen[] = [
  { medio: 1, lugar: 'marca', texto: 'Logotipo del sitio' },
  { medio: 2, lugar: 'inicio', texto: 'Portada 1 del carrusel' },
]

// Repositorio en memoria que aplica el filtro como lo haría la consulta a Payload.
function repositorio(): RepositorioDeLecturaDeImagenes {
  const pasa = ({ ids, busqueda, idsPorUso }: FiltroDeLectura, item: ImagenDelPanel) => {
    if (ids && 'incluir' in ids && !ids.incluir.includes(item.id)) return false
    if (ids && 'excluir' in ids && ids.excluir.includes(item.id)) return false
    if (!busqueda) return true
    return item.nombre.includes(busqueda) || idsPorUso.includes(item.id)
  }
  return {
    usos: async () => USOS,
    contar: vi.fn(async (filtro) => BIBLIOTECA.filter((item) => pasa(filtro, item)).length),
    listar: async (filtro) => BIBLIOTECA.filter((item) => pasa(filtro, item)),
    buscar: async (id) => BIBLIOTECA.find((item) => item.id === id) ?? null,
  }
}

const CONSULTA = { filtro: 'todas', busqueda: '', pagina: 1, imagen: null } as const

describe('obtenerImagenes', () => {
  it('cuenta cada filtro y agrega los usos de cada imagen', async () => {
    const datos = await obtenerImagenes(repositorio(), CONSULTA)
    expect(datos.filtros.map(({ valor, cantidad }) => [valor, cantidad])).toEqual([
      ['todas', 3],
      ['inicio', 1],
      ['clientes', 0],
      ['marca', 1],
      ['blog', 0],
      ['sin-usar', 1],
    ])
    expect(datos.imagenes.find((i) => i.id === 1)?.usos).toEqual([USOS[0]])
    expect(datos.hayImagenes).toBe(true)
  })

  it('un filtro sin imágenes no consulta la lista', async () => {
    const repo = repositorio()
    const datos = await obtenerImagenes(repo, { ...CONSULTA, filtro: 'clientes' })
    expect(datos.imagenes).toEqual([])
    expect(datos.paginacion.total).toBe(0)
  })

  it('«sin usar» trae solo las imágenes sin ningún uso', async () => {
    const datos = await obtenerImagenes(repositorio(), { ...CONSULTA, filtro: 'sin-usar' })
    expect(datos.imagenes.map((i) => i.id)).toEqual([3])
  })

  it('la búsqueda encuentra también por el uso y no oculta que la biblioteca tiene imágenes', async () => {
    const datos = await obtenerImagenes(repositorio(), { ...CONSULTA, busqueda: 'carrusel' })
    expect(datos.imagenes.map((i) => i.id)).toEqual([2])
    const nada = await obtenerImagenes(repositorio(), { ...CONSULTA, busqueda: 'zzz' })
    expect(nada.imagenes).toEqual([])
    expect(nada.hayImagenes).toBe(true)
  })

  it('trae la imagen abierta con sus usos, aunque no esté en la página', async () => {
    const datos = await obtenerImagenes(repositorio(), {
      ...CONSULTA,
      filtro: 'sin-usar',
      imagen: 2,
    })
    expect(datos.seleccionada?.usos).toEqual([USOS[1]])
  })
})
