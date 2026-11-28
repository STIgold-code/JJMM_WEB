import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_ARCHIVO_RECHAZADO } from '../aplicacion/subir-imagen'
import {
  ERROR_DE_ALT_VACIO,
  ERROR_DE_ARCHIVO_GRANDE,
  ERROR_DE_TIPO,
  TAMANO_MAXIMO_DE_IMAGEN,
} from '../dominio/subida-de-imagenes'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'
import {
  leerRespuesta,
  MEDIO_CREADO,
  peticionDeSubida,
  PNG,
  SVG,
} from './prueba/peticion-de-subida'

// Manejador de la subida con la guardia y el adaptador reales (solo Next y la Local API son
// dobles): sin sesión responde 401 sin tocar Payload, rechaza otro origen, un cuerpo sin largo o
// demasiado grande y un tipo no permitido antes de llegar a Payload.
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

const { atenderSubidaDeImagen } = await import('./subida-de-imagenes')

const peticion = peticionDeSubida
const cuerpo = leerRespuesta

beforeEach(() => {
  reiniciarDobles({})
  dobles.create.mockResolvedValue(MEDIO_CREADO)
})

describe('atenderSubidaDeImagen: lo que nunca llega a Payload', () => {
  it('sin sesión responde 401 y no sube nada', async () => {
    conSesion(null)
    const { status, json } = await cuerpo(await atenderSubidaDeImagen(peticion()))
    expect(status).toBe(401)
    expect(json.estado).toBe('error')
    nadaSeEscribio()
  })

  it('desde otro origen o sin Origin responde 403 (CSRF)', async () => {
    conSesion(EDITOR)
    expect((await atenderSubidaDeImagen(peticion({ origen: 'https://malo.com' }))).status).toBe(403)
    expect((await atenderSubidaDeImagen(peticion({ origen: null }))).status).toBe(403)
    nadaSeEscribio()
  })

  it('un cuerpo sin largo o mayor que el tope responde 413 sin leerlo', async () => {
    conSesion(EDITOR)
    expect((await atenderSubidaDeImagen(peticion({ largo: null }))).status).toBe(413)
    const grande = TAMANO_MAXIMO_DE_IMAGEN + 70 * 1024
    expect((await atenderSubidaDeImagen(peticion({ largo: grande }))).status).toBe(413)
    nadaSeEscribio()
  })

  it('un tipo no permitido (aunque diga .png) o un archivo de más de 10 MB responde 422', async () => {
    conSesion(EDITOR)
    const svg = await cuerpo(await atenderSubidaDeImagen(peticion({ bytes: SVG, nombre: 'a.png' })))
    expect(svg).toEqual({
      status: 422,
      json: { estado: 'invalido', errores: { archivo: ERROR_DE_TIPO } },
    })
    const enorme = new Uint8Array(TAMANO_MAXIMO_DE_IMAGEN + 1)
    enorme.set(PNG)
    const grande = await cuerpo(await atenderSubidaDeImagen(peticion({ bytes: enorme })))
    expect(grande.json.errores).toEqual({ archivo: ERROR_DE_ARCHIVO_GRANDE })
    nadaSeEscribio()
  })

  it('sin texto alternativo responde 422', async () => {
    conSesion(EDITOR)
    const { json } = await cuerpo(await atenderSubidaDeImagen(peticion({ alt: '   ' })))
    expect(json.errores).toEqual({ alt: ERROR_DE_ALT_VACIO })
    nadaSeEscribio()
  })
})

describe('atenderSubidaDeImagen: subida', () => {
  it('sube con los permisos de la sesión, el tipo real y el nombre con su extensión', async () => {
    conSesion(ADMINISTRADOR)
    const { status, json } = await cuerpo(await atenderSubidaDeImagen(peticion()))
    expect(status).toBe(201)
    expect(json).toEqual({
      estado: 'subida',
      imagen: {
        id: 9,
        nombre: 'logo.png',
        alt: 'Logotipo',
        ancho: 120,
        alto: 40,
        url: '/api/medios/file/logo.png',
      },
    })
    const [llamada] = dobles.create.mock.calls[0] ?? []
    expect(llamada).toMatchObject({
      collection: 'medios',
      data: { alt: 'Logotipo' },
      file: { mimetype: 'image/png', name: 'logo.png', size: PNG.length },
      overrideAccess: false,
      user: ADMINISTRADOR,
    })
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('un 400 de Payload vuelve tipado junto al archivo, sin lanzar ni revalidar', async () => {
    conSesion(EDITOR)
    dobles.create.mockRejectedValueOnce({ status: 400, data: { errors: [{ path: 'file' }] } })
    const { status, json } = await cuerpo(await atenderSubidaDeImagen(peticion()))
    expect(status).toBe(422)
    expect(json.errores).toEqual({ archivo: ERROR_DE_ARCHIVO_RECHAZADO })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('cualquier otro error se propaga', async () => {
    conSesion(EDITOR)
    dobles.create.mockRejectedValueOnce(new Error('disco lleno'))
    await expect(atenderSubidaDeImagen(peticion())).rejects.toThrow('disco lleno')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
