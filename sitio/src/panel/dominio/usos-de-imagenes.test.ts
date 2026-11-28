import { describe, expect, it } from 'vitest'

import {
  esLogotipo,
  idsDelFiltro,
  idsEnTextoEnriquecido,
  idsQueCoincidenPorUso,
  textoDeUsos,
  type UsoDeImagen,
  usosPorImagen,
} from './usos-de-imagenes'

const USOS: UsoDeImagen[] = [
  { medio: 1, lugar: 'marca', texto: 'Logotipo del sitio' },
  { medio: 2, lugar: 'inicio', texto: 'Portada 1 del carrusel' },
  { medio: 2, lugar: 'inicio', texto: 'Foto del mapa de «Contáctanos»' },
  { medio: 3, lugar: 'clientes', texto: 'Cliente «Cadex»' },
  { medio: 4, lugar: 'blog', texto: 'Publicación «Cierre tributario»' },
]

describe('usosPorImagen', () => {
  it('agrupa los usos por imagen, en el orden en que llegan', () => {
    const porImagen = usosPorImagen(USOS)
    expect(porImagen.get(2)?.map((uso) => uso.texto)).toEqual([
      'Portada 1 del carrusel',
      'Foto del mapa de «Contáctanos»',
    ])
    expect(porImagen.get(9)).toBeUndefined()
  })

  it('no repite un uso idéntico', () => {
    const repetido = [USOS[0]!, USOS[0]!]
    expect(usosPorImagen(repetido).get(1)).toHaveLength(1)
  })
})

describe('idsDelFiltro', () => {
  it('«todas» no filtra', () => {
    expect(idsDelFiltro('todas', USOS)).toBeNull()
  })

  it('un lugar incluye solo las imágenes usadas ahí, sin repetir', () => {
    expect(idsDelFiltro('inicio', USOS)).toEqual({ incluir: [2] })
    expect(idsDelFiltro('blog', USOS)).toEqual({ incluir: [4] })
  })

  it('«sin usar» excluye toda imagen con algún uso', () => {
    expect(idsDelFiltro('sin-usar', USOS)).toEqual({ excluir: [1, 2, 3, 4] })
  })
})

describe('idsQueCoincidenPorUso', () => {
  it('encuentra por el texto del uso, sin tildes ni mayúsculas', () => {
    expect(idsQueCoincidenPorUso(USOS, 'contactanos')).toEqual([2])
    expect(idsQueCoincidenPorUso(USOS, 'CADEX')).toEqual([3])
  })

  it('sin búsqueda no devuelve nada', () => {
    expect(idsQueCoincidenPorUso(USOS, '  ')).toEqual([])
  })
})

describe('textoDeUsos', () => {
  it('une los usos o dice que no se usa', () => {
    expect(textoDeUsos(usosPorImagen(USOS).get(2))).toBe(
      'Portada 1 del carrusel · Foto del mapa de «Contáctanos»',
    )
    expect(textoDeUsos(undefined)).toBe('Sin usar en el sitio')
  })
})

describe('esLogotipo', () => {
  it('los logotipos (clientes, marca o PNG) se muestran enteros, no recortados', () => {
    expect(esLogotipo([USOS[3]!], 'image/webp')).toBe(true)
    expect(esLogotipo([], 'image/png')).toBe(true)
    expect(esLogotipo([USOS[1]!], 'image/webp')).toBe(false)
  })
})

describe('idsEnTextoEnriquecido', () => {
  it('encuentra las imágenes insertadas en el contenido (Lexical), a cualquier profundidad', () => {
    const contenido = {
      root: {
        children: [
          { type: 'paragraph', children: [{ type: 'text', text: 'Hola' }] },
          { type: 'upload', relationTo: 'medios', value: 7 },
          {
            type: 'list',
            children: [{ type: 'upload', relationTo: 'medios', value: { id: 8 } }],
          },
          { type: 'upload', relationTo: 'otra', value: 9 },
          { type: 'upload', relationTo: 'medios', value: 7 },
        ],
      },
    }
    expect(idsEnTextoEnriquecido(contenido)).toEqual([7, 8])
  })

  it('un contenido vacío o con otra forma no tiene imágenes', () => {
    expect(idsEnTextoEnriquecido(null)).toEqual([])
    expect(idsEnTextoEnriquecido('texto')).toEqual([])
  })
})
