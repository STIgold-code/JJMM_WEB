import { describe, expect, it } from 'vitest'

import type { Medio } from '@/payload-types'

import { aImagen } from './imagen-de-medio'

const MEDIO: Medio = {
  id: 1,
  alt: 'Logotipo del Estudio Contable JJMM',
  url: '/api/medios/file/logo-jjmm.png',
  width: 223,
  height: 125,
  updatedAt: '2026-11-27T00:00:00.000Z',
  createdAt: '2026-11-27T00:00:00.000Z',
}

describe('aImagen', () => {
  it('toma la dirección, el texto alternativo y las dimensiones del medio', () => {
    expect(aImagen(MEDIO)).toEqual({
      url: '/api/medios/file/logo-jjmm.png',
      alt: 'Logotipo del Estudio Contable JJMM',
      ancho: 223,
      alto: 125,
    })
  })

  it('devuelve null si el medio no se pobló o no existe', () => {
    expect(aImagen(7)).toBeNull()
    expect(aImagen(null)).toBeNull()
    expect(aImagen(undefined)).toBeNull()
  })

  it('devuelve null si al medio le falta la dirección o las dimensiones', () => {
    expect(aImagen({ ...MEDIO, url: null })).toBeNull()
    expect(aImagen({ ...MEDIO, width: null })).toBeNull()
    expect(aImagen({ ...MEDIO, height: undefined })).toBeNull()
  })
})
