import { describe, expect, it } from 'vitest'

import { cargarSemilla, type OpcionesDeCarga } from './cargar'
import { SEMILLA } from './datos'
import { PuertoEnMemoria } from './prueba/puerto-en-memoria'

const OPCIONES: OpcionesDeCarga = {
  resolverRuta: (archivo) => `/repositorio/${archivo}`,
  administrador: null,
}

const CANTIDADES_ESPERADAS = {
  medios: 21,
  sedes: 2,
  'areas-de-servicio': 9,
  planes: 4,
  'caracteristicas-de-plan': 22,
  'inclusiones-de-plan': 88,
  valores: 6,
  clientes: 11,
  'avisos-para-clientes': 3,
  vencimientos: 14,
  'cronogramas-sunat': 0,
  usuarios: 0,
}

const cantidades = (puerto: PuertoEnMemoria) =>
  Object.fromEntries(Object.keys(CANTIDADES_ESPERADAS).map((c) => [c, puerto.cantidad(c)]))

async function cargarEnMemoria(veces = 1): Promise<PuertoEnMemoria> {
  const puerto = new PuertoEnMemoria()
  for (let vez = 0; vez < veces; vez++) await cargarSemilla(puerto, SEMILLA, OPCIONES)
  return puerto
}

const idPor = (puerto: PuertoEnMemoria, coleccion: string, campo: string, valor: unknown) =>
  puerto.documentos(coleccion).find((d) => d.datos[campo] === valor)?.id

describe('cargarSemilla', () => {
  it('carga cada colección en una base vacía y deja vacío el cronograma de SUNAT', async () => {
    expect(cantidades(await cargarEnMemoria())).toEqual(CANTIDADES_ESPERADAS)
  })

  it('es idempotente: cargar dos veces no duplica documentos', async () => {
    const puerto = await cargarEnMemoria(2)

    expect(cantidades(puerto)).toEqual(CANTIDADES_ESPERADAS)
    expect(puerto.operaciones.filter((o) => o.tipo === 'crear')).toHaveLength(180)
  })

  it('sube cada medio desde su ruta dentro del proyecto, una sola vez', async () => {
    const puerto = await cargarEnMemoria(2)
    const rutas = puerto.documentos('medios').map((d) => d.rutaDeArchivo)

    expect(rutas).toContain('/repositorio/semilla/imagenes/inicio/hero-plan.webp')
    expect(new Set(rutas).size).toBe(21)
  })

  it('actualiza las cinco globales', async () => {
    const puerto = await cargarEnMemoria()

    expect([...puerto.globales.keys()].sort()).toEqual([
      'configuracion-del-sitio',
      'guia-de-clientes',
      'navegacion',
      'pagina-de-inicio',
      'pagina-del-blog',
    ])
  })

  it('guarda cada celda de la matriz con el id de su plan y su característica', async () => {
    const puerto = await cargarEnMemoria()
    const celda = (plan: string, caracteristica: string) =>
      puerto
        .documentos('inclusiones-de-plan')
        .find(
          ({ datos }) =>
            datos.plan === idPor(puerto, 'planes', 'nombre', plan) &&
            datos.caracteristica ===
              idPor(puerto, 'caracteristicas-de-plan', 'nombre', caracteristica),
        )?.datos

    expect(celda('Emprende', 'Libro Bancos mensual')).toMatchObject({ tipo: 'no-incluido' })
    expect(celda('SIGEMype Business', 'Manejo de Kardex')).toMatchObject({ tipo: 'incluido' })
    expect(celda('SIGEMype II', 'Gestión integral de planilla hasta')).toMatchObject({
      tipo: 'texto',
      texto: '6 trabajadores',
    })
  })

  it('numera el orden de cada lista según su posición', async () => {
    const puerto = await cargarEnMemoria()
    const ordenes = puerto.documentos('areas-de-servicio').map((d) => d.datos.orden)

    expect(ordenes).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
