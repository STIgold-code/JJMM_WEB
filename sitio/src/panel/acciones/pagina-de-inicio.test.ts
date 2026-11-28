import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_IMAGEN_INEXISTENTE, ERROR_SIN_PORTADAS } from '../dominio/errores-del-carrusel'
import { ERROR_DESACTUALIZADA } from '../dominio/pagina-de-inicio'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'
import {
  CARRUSEL,
  DESCONOCIDA,
  FORMULARIO,
  NUEVA_VERSION,
  PAGINA,
  QUIENES,
  SERVICIOS,
  VERSION,
} from './prueba/pagina-de-inicio'

// Acciones de la página de inicio con la guardia y el adaptador reales (solo Next y la Local API
// son dobles). La global se escribe entera: lo que no es el carrusel debe volver idéntico.
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

const datosEscritos = () => dobles.updateGlobal.mock.calls[0]?.[0]

beforeEach(() => {
  reiniciarDobles({ medios: [{ id: 7, mimeType: 'image/webp' }] }, { 'pagina-de-inicio': PAGINA })
  dobles.updateGlobal.mockResolvedValue({ ...PAGINA, updatedAt: NUEVA_VERSION })
  conSesion(EDITOR)
})

const ACCIONES = [
  ['guardarElCarrusel', () => guardarElCarrusel(FORMULARIO)],
  ['ordenarLasSecciones', () => ordenarLasSecciones(['qui2', 'car1', 'ser3', 'fut4'], VERSION)],
] as const

describe('acciones de la página de inicio sin sesión (S4.3)', () => {
  it.each(ACCIONES)('%s lleva al ingreso y no lee ni escribe nada', async (_, accion) => {
    conSesion(null)
    await expect(accion()).rejects.toThrow('REDIRECCION /panel/ingreso')
    expect(dobles.findGlobal).not.toHaveBeenCalled()
    nadaSeEscribio()
  })

  it.each(ACCIONES)('%s tampoco escribe con una cuenta que no es del equipo', async (_, accion) => {
    conSesion({ id: 9, rol: 'otro' })
    await expect(accion()).rejects.toThrow('REDIRECCION /panel/ingreso')
    nadaSeEscribio()
  })
})

describe('guardarElCarrusel', () => {
  it('cambia solo el carrusel: las demás secciones vuelven idénticas y en su lugar', async () => {
    const estado = await guardarElCarrusel({ ...FORMULARIO, rol: 'administrador', seo: {} })
    expect(estado).toMatchObject({ estado: 'guardado', actualizadoEn: NUEVA_VERSION })
    const escrito = datosEscritos()
    const permisos = { overrideAccess: false, user: EDITOR, depth: 0 }
    expect(escrito).toMatchObject({ slug: 'pagina-de-inicio', ...permisos })
    // Solo `secciones`: el SEO y el resto de la global no se tocan.
    expect(Object.keys(escrito.data)).toEqual(['secciones'])
    const [carrusel, ...resto] = escrito.data.secciones
    expect(resto).toEqual([QUIENES, SERVICIOS, DESCONOCIDA])
    expect(carrusel).toEqual({
      id: 'car1',
      blockType: 'carrusel-de-portadas',
      blockName: 'Portadas',
      segundosPorPortada: 12,
      portadas: [
        {
          imagen: 7,
          imagenEsDecorativa: true,
          imagenParaCelular: null,
          encuadreEnCelular: null,
          disposicion: 'texto-izquierda',
          transicion: 'recorte',
          titulo: 'Somos más que un [estudio contable]',
          subtitulo: null,
          sello: null,
          lista: [],
          acciones: [],
        },
      ],
    })
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('el administrador guarda igual que el editor (la global es del equipo)', async () => {
    conSesion(ADMINISTRADOR)
    expect((await guardarElCarrusel(FORMULARIO)).estado).toBe('guardado')
    expect(datosEscritos()).toMatchObject({ user: ADMINISTRADOR })
  })

  it('un formulario desactualizado no se guarda: pide recargar y no pisa el cambio ajeno', async () => {
    reiniciarDobles(
      { medios: [{ id: 7, mimeType: 'image/webp' }] },
      { 'pagina-de-inicio': { ...PAGINA, updatedAt: NUEVA_VERSION } },
    )
    conSesion(EDITOR)
    expect(await guardarElCarrusel(FORMULARIO)).toEqual({
      estado: 'error',
      error: ERROR_DESACTUALIZADA,
      desactualizada: true,
    })
    nadaSeEscribio()
  })

  it('una imagen que no existe (o no es una imagen) no llega a Payload', async () => {
    reiniciarDobles({ medios: [] }, { 'pagina-de-inicio': PAGINA })
    conSesion(EDITOR)
    expect(await guardarElCarrusel(FORMULARIO)).toEqual({
      estado: 'invalido',
      errores: { portada: { 0: { imagen: ERROR_IMAGEN_INEXISTENTE } } },
    })
    nadaSeEscribio()
  })

  it('cero portadas se rechaza en el servidor sin escribir', async () => {
    expect(await guardarElCarrusel({ ...FORMULARIO, portadas: [] })).toEqual({
      estado: 'invalido',
      errores: { portadas: ERROR_SIN_PORTADAS },
    })
    nadaSeEscribio()
  })

  it('una sección que no es un carrusel no se puede reemplazar con el carrusel', async () => {
    const estado = await guardarElCarrusel({ ...FORMULARIO, seccion: 'qui2' })
    expect(estado).toMatchObject({ estado: 'error', desactualizada: true })
    nadaSeEscribio()
  })
})

describe('ordenarLasSecciones', () => {
  it('escribe las mismas secciones, intactas, en el orden nuevo', async () => {
    const estado = await ordenarLasSecciones(['fut4', 'car1', 'qui2', 'ser3'], VERSION)
    expect(estado).toMatchObject({ estado: 'guardado', actualizadoEn: NUEVA_VERSION })
    expect(datosEscritos().data.secciones).toEqual([DESCONOCIDA, CARRUSEL, QUIENES, SERVICIOS])
  })

  it('una lista que no es la guardada, o una versión vieja, no se escribe', async () => {
    expect(await ordenarLasSecciones(['car1', 'qui2'], VERSION)).toMatchObject({
      estado: 'error',
      desactualizada: true,
    })
    expect(
      await ordenarLasSecciones(['qui2', 'car1', 'ser3', 'fut4'], NUEVA_VERSION),
    ).toMatchObject({ estado: 'error', desactualizada: true })
    expect(await ordenarLasSecciones('car1', VERSION)).toMatchObject({ estado: 'error' })
    nadaSeEscribio()
  })
})
