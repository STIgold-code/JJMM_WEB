import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_SIN_PERMISO } from '../aplicacion/gestionar-mensajes'
import { ERROR_DE_DESTINO, ERROR_IMAGEN_INEXISTENTE } from '../dominio/errores-del-carrusel'
import { ERROR_DATOS_DE_LA_PAGINA } from '../dominio/pagina-de-inicio'
import { conSesion, dobles, EDITOR, reiniciarDobles } from './prueba/dobles-de-payload'

// Errores de Payload al escribir la página de inicio, con la guardia y el adaptador reales: un
// 400 vuelve tipado y junto a su campo (las rutas dentro del bloque llegan a su portada y a su
// botón), un 403 es «sin permiso» y cualquier otro error se propaga tal cual.
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

const { guardarElCarrusel, ordenarLasSecciones } = await import('./pagina-de-inicio')

const VERSION = '2026-11-27T10:00:00.000Z'
// El carrusel es la segunda sección: Payload lo nombra `secciones.1.…`.
const PAGINA = {
  updatedAt: VERSION,
  secciones: [
    { id: 'qui1', blockType: 'quienes-somos', titulo: 'Quiénes somos' },
    { id: 'car2', blockType: 'carrusel-de-portadas', segundosPorPortada: 9, portadas: [] },
  ],
}
const PORTADA = {
  clave: 1,
  imagen: { id: 7, url: '/api/medios/file/a.webp', alt: 'A', nombre: 'a.webp' },
  imagenEsDecorativa: true,
  imagenParaCelular: null,
  encuadreEnCelular: null,
  disposicion: 'texto-derecha',
  transicion: 'fundido',
  titulo: '',
  subtitulo: '',
  sello: null,
  lista: '',
  botones: [
    {
      clave: 1,
      etiqueta: 'Planes',
      tipo: 'seccion',
      mensaje: '',
      destino: '#planes',
      estilo: 'principal',
    },
  ],
}
const FORMULARIO = {
  seccion: 'car2',
  actualizadoEn: VERSION,
  segundosPorPortada: '9',
  portadas: [PORTADA],
}

const rechazo400 = (...paths: string[]) => ({
  status: 400,
  data: { errors: paths.map((path) => ({ path })) },
})

beforeEach(() => {
  reiniciarDobles({ medios: [{ id: 7, mimeType: 'image/png' }] }, { 'pagina-de-inicio': PAGINA })
  conSesion(EDITOR)
})

describe('cuando Payload rechaza los datos (400)', () => {
  it('guardarElCarrusel devuelve cada error junto a su portada y su botón, sin revalidar', async () => {
    dobles.updateGlobal.mockRejectedValueOnce(
      rechazo400('secciones.1.portadas.0.imagen', 'secciones.1.portadas.0.acciones.0.destino'),
    )
    expect(await guardarElCarrusel(FORMULARIO)).toEqual({
      estado: 'invalido',
      errores: {
        portada: {
          0: { imagen: ERROR_IMAGEN_INEXISTENTE, boton: { 0: { destino: ERROR_DE_DESTINO } } },
        },
      },
    })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('un error en otra sección no tiene campo en este formulario: queda como aviso general', async () => {
    dobles.updateGlobal.mockRejectedValueOnce(rechazo400('secciones.0.titulo'))
    expect(await guardarElCarrusel(FORMULARIO)).toEqual({
      estado: 'error',
      error: ERROR_DATOS_DE_LA_PAGINA,
      desactualizada: false,
    })
  })

  it('ordenarLasSecciones devuelve un aviso claro', async () => {
    dobles.updateGlobal.mockRejectedValueOnce(rechazo400('secciones.0.titulo'))
    expect(await ordenarLasSecciones(['car2', 'qui1'], VERSION)).toEqual({
      estado: 'error',
      error: ERROR_DATOS_DE_LA_PAGINA,
      desactualizada: false,
    })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})

describe('cuando la cuenta no tiene permiso (403)', () => {
  it('las dos acciones devuelven «sin permiso» sin lanzar', async () => {
    dobles.updateGlobal.mockRejectedValue({ status: 403 })
    const sinPermiso = { estado: 'error', error: ERROR_SIN_PERMISO, desactualizada: false }
    expect(await guardarElCarrusel(FORMULARIO)).toEqual(sinPermiso)
    expect(await ordenarLasSecciones(['car2', 'qui1'], VERSION)).toEqual(sinPermiso)
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})

describe('cualquier otro error de Payload', () => {
  it('se propaga (por ejemplo, la base caída): nunca se muestra como un dato inválido', async () => {
    const caida = Object.assign(new Error('conexión rechazada'), { status: 500 })
    dobles.updateGlobal.mockRejectedValueOnce(caida)
    await expect(guardarElCarrusel(FORMULARIO)).rejects.toBe(caida)
    dobles.updateGlobal.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(ordenarLasSecciones(['car2', 'qui1'], VERSION)).rejects.toThrow('sin conexión')
    dobles.findGlobal.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(guardarElCarrusel(FORMULARIO)).rejects.toThrow('sin conexión')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
