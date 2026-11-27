import { describe, expect, it } from 'vitest'

import { crearAlmacenamientoWasabi, leerConfiguracionWasabi } from './almacenamiento-wasabi'

const ENTORNO_COMPLETO = {
  WASABI_BUCKET: 'jjmm-medios',
  WASABI_REGION: 'us-east-1',
  WASABI_ENDPOINT: 'https://s3.us-east-1.wasabisys.com',
  WASABI_ACCESS_KEY_ID: 'clave-de-prueba',
  WASABI_SECRET_ACCESS_KEY: 'secreto-de-prueba',
}

describe('leerConfiguracionWasabi', () => {
  it('devuelve la configuración cuando todas las variables existen', () => {
    expect(leerConfiguracionWasabi(ENTORNO_COMPLETO)).toEqual({
      bucket: 'jjmm-medios',
      region: 'us-east-1',
      endpoint: 'https://s3.us-east-1.wasabisys.com',
      accessKeyId: 'clave-de-prueba',
      secretAccessKey: 'secreto-de-prueba',
    })
  })

  it('devuelve null si falta alguna variable o está vacía', () => {
    expect(leerConfiguracionWasabi({ ...ENTORNO_COMPLETO, WASABI_BUCKET: undefined })).toBeNull()
    expect(leerConfiguracionWasabi({ ...ENTORNO_COMPLETO, WASABI_ENDPOINT: '  ' })).toBeNull()
    expect(leerConfiguracionWasabi({})).toBeNull()
  })
})

describe('crearAlmacenamientoWasabi', () => {
  it('no registra el adaptador sin configuración, para trabajar en local sin Wasabi', () => {
    expect(crearAlmacenamientoWasabi({}, ['medios'])).toEqual([])
  })

  it('registra un adaptador cuando la configuración está completa', () => {
    expect(crearAlmacenamientoWasabi(ENTORNO_COMPLETO, ['medios'])).toHaveLength(1)
  })
})
