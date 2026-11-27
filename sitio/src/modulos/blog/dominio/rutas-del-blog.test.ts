import { describe, expect, it } from 'vitest'

import {
  leerSlug,
  rutaDeCategoria,
  rutaDeDocumentoInterno,
  rutaDeEtiqueta,
  rutaDePagina,
  rutaDePublicacion,
  RUTA_DEL_BLOG,
} from './rutas-del-blog'

describe('rutas del blog', () => {
  it('arma la ruta de cada página del blog', () => {
    expect(RUTA_DEL_BLOG).toBe('/blog')
    expect(rutaDePublicacion('que-es-el-igv')).toBe('/blog/que-es-el-igv')
    expect(rutaDeCategoria('tributacion')).toBe('/blog/categoria/tributacion')
    expect(rutaDeEtiqueta('sunat')).toBe('/blog/etiqueta/sunat')
  })

  it('la primera página de un listado no lleva parámetro; las demás, ?pagina=', () => {
    expect(rutaDePagina('/blog', 1)).toBe('/blog')
    expect(rutaDePagina('/blog/categoria/tributacion', 3)).toBe(
      '/blog/categoria/tributacion?pagina=3',
    )
  })
})

describe('leerSlug', () => {
  it('acepta un slug válido', () => {
    expect(leerSlug('cierre-tributario-2026')).toBe('cierre-tributario-2026')
  })

  it('rechaza lo que no puede ser un slug, sin consultar la base', () => {
    for (const valor of ['', 'Con-Mayusculas', 'con espacio', 'tilde-á', '-inicio', 'a--b']) {
      expect(leerSlug(valor)).toBeNull()
    }
  })
})

describe('rutaDeDocumentoInterno', () => {
  it('enlaza publicaciones, categorías y etiquetas por su slug', () => {
    expect(rutaDeDocumentoInterno('publicaciones', 'renta-2026')).toBe('/blog/renta-2026')
    expect(rutaDeDocumentoInterno('categorias', 'laboral')).toBe('/blog/categoria/laboral')
    expect(rutaDeDocumentoInterno('etiquetas', 'plame')).toBe('/blog/etiqueta/plame')
  })

  it('devuelve null para otras colecciones o sin slug', () => {
    expect(rutaDeDocumentoInterno('medios', 'logo')).toBeNull()
    expect(rutaDeDocumentoInterno('publicaciones', null)).toBeNull()
  })
})
