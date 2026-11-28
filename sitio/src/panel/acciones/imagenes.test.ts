import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_IMAGEN_INEXISTENTE } from '../aplicacion/gestionar-imagenes'
import { ERROR_SIN_PERMISO } from '../aplicacion/gestionar-mensajes'
import { ERROR_DE_ALT_VACIO } from '../dominio/subida-de-imagenes'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Acciones de la biblioteca de imágenes con la guardia y el adaptador reales (solo Next y la
// Local API son dobles): sin sesión no se escribe ni se lee nada, un editor no elimina, una
// imagen en uso no se elimina, un 400 vuelve tipado y cualquier otro error se propaga.
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

const { eliminarLaImagen, guardarElTextoAlternativo, listarImagenesParaElegir } =
  await import('./imagenes')

const MEDIO = { id: 3, filename: 'rueda.webp', alt: 'Rueda', url: '/api/medios/file/rueda.webp' }
const EN_USO = 5

beforeEach(() => {
  reiniciarDobles(
    {
      medios: [MEDIO],
      clientes: [{ id: 1, nombre: 'Cadex', logo: EN_USO }],
      publicaciones: [],
    },
    { 'pagina-de-inicio': { secciones: [{ blockType: 'servicios', imagenDeLaRueda: 6 }] } },
  )
  dobles.delete.mockResolvedValue(MEDIO)
  dobles.update.mockResolvedValue({ ...MEDIO, alt: 'Rueda SIGE Mype' })
})

describe('sin sesión', () => {
  it('ninguna acción lee ni escribe: la guardia redirige antes de tocar Payload', async () => {
    conSesion(null)
    await expect(eliminarLaImagen(3)).rejects.toThrow('REDIRECCION /panel/ingreso')
    await expect(guardarElTextoAlternativo(3, { alt: 'x' })).rejects.toThrow('REDIRECCION')
    await expect(listarImagenesParaElegir('', 1)).rejects.toThrow('REDIRECCION')
    nadaSeEscribio()
    for (const lectura of [dobles.find, dobles.count, dobles.findGlobal, dobles.findByID])
      expect(lectura).not.toHaveBeenCalled()
  })
})

describe('eliminarLaImagen', () => {
  it('un editor no puede eliminar: no llega a Payload', async () => {
    conSesion(EDITOR)
    expect(await eliminarLaImagen(3)).toEqual({ ok: false, error: ERROR_SIN_PERMISO })
    nadaSeEscribio()
  })

  it('una imagen en uso no se elimina y el error dice dónde se usa', async () => {
    conSesion(ADMINISTRADOR)
    expect(await eliminarLaImagen(EN_USO)).toEqual({
      ok: false,
      error:
        'No se puede eliminar: la imagen se usa en un lugar (Cliente «Cadex»). Reemplázala allí primero.',
    })
    expect(await eliminarLaImagen(6)).toMatchObject({ ok: false })
    nadaSeEscribio()
  })

  it('una imagen sin uso se elimina con los permisos de la sesión y revalida', async () => {
    conSesion(ADMINISTRADOR)
    expect(await eliminarLaImagen('3')).toEqual({
      ok: true,
      aviso: { titulo: 'Imagen eliminada', detalle: 'Se borró «rueda.webp».' },
    })
    expect(dobles.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'medios',
        id: 3,
        overrideAccess: false,
        user: ADMINISTRADOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('un id inválido no llega a Payload', async () => {
    conSesion(ADMINISTRADOR)
    expect(await eliminarLaImagen('3 OR 1=1')).toEqual({
      ok: false,
      error: ERROR_DE_IMAGEN_INEXISTENTE,
    })
    nadaSeEscribio()
  })
})

describe('guardarElTextoAlternativo', () => {
  it('guarda solo el texto alternativo, sin espacios sobrantes', async () => {
    conSesion(EDITOR)
    const estado = await guardarElTextoAlternativo(3, { alt: '  Rueda SIGE Mype ', filename: 'x' })
    expect(estado).toMatchObject({ estado: 'guardado' })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'medios',
        id: 3,
        data: { alt: 'Rueda SIGE Mype' },
        overrideAccess: false,
        user: EDITOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('un texto vacío o un formulario sin forma no llegan a Payload', async () => {
    conSesion(EDITOR)
    expect(await guardarElTextoAlternativo(3, { alt: '  ' })).toEqual({
      estado: 'invalido',
      errores: { alt: ERROR_DE_ALT_VACIO },
    })
    expect(await guardarElTextoAlternativo(3, 'alt')).toMatchObject({ estado: 'invalido' })
    expect(await guardarElTextoAlternativo(null, { alt: 'x' })).toMatchObject({ estado: 'error' })
    nadaSeEscribio()
  })
})

describe('listarImagenesParaElegir', () => {
  it('lee con los permisos de la sesión y devuelve solo imágenes que se pueden mostrar', async () => {
    conSesion(EDITOR)
    const pagina = await listarImagenesParaElegir('rueda', 'x')
    expect(pagina.imagenes.map((imagen) => imagen.id)).toEqual([3])
    expect(pagina.paginacion.pagina).toBe(1)
    expect(dobles.find).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'medios', overrideAccess: false, user: EDITOR }),
    )
    nadaSeEscribio()
  })
})
