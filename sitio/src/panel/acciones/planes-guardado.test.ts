import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_CELDA } from '../aplicacion/guardar-plan'
import { ERROR_NOMBRE_REPETIDO } from '../dominio/formulario-de-plan'
import { conSesion, dobles, EDITOR, reiniciarDobles } from './prueba/dobles-de-payload'

// Guardado de un plan con la guardia y el adaptador reales (solo Next y la Local API son
// dobles): el plan y sus celdas van en una transacción; un 400 vuelve como resultado tipado y la
// deshace; cualquier otro error también la deshace y se propaga tal cual.
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

const { guardarElPlan } = await import('./planes')

// Guardadas: 10 incluida, 11 con texto. Falta la 12 (se ve como «No incluido»).
const COLECCIONES = {
  'caracteristicas-de-plan': [{ id: 10 }, { id: 11 }, { id: 12 }],
  'inclusiones-de-plan': [
    { id: 100, plan: 1, caracteristica: 10, tipo: 'incluido', texto: null },
    { id: 101, plan: 1, caracteristica: 11, tipo: 'texto', texto: 'Consultar' },
  ],
}
const FORMULARIO = {
  nombre: ' SIGEMype II ',
  mensajeDeConsulta: 'Hola',
  visible: false,
  celdas: [
    { caracteristica: 10, tipo: 'incluido', texto: '' },
    { caracteristica: 11, tipo: 'texto', texto: '8 trabajadores' },
    { caracteristica: 12, tipo: 'incluido', texto: '' },
  ],
}

const rechazo = (path: string) =>
  Object.assign(new Error(`El siguiente campo no es válido: ${path}`), {
    status: 400,
    data: { errors: [{ path, message: 'No es válido' }] },
  })

const enLaTransaccion = expect.objectContaining({
  overrideAccess: false,
  user: EDITOR,
  req: expect.objectContaining({ transactionID: 'tx-1' }),
})

const seDeshizo = () => {
  expect(dobles.rollbackTransaction).toHaveBeenCalledWith('tx-1')
  expect(dobles.commitTransaction).not.toHaveBeenCalled()
  expect(dobles.revalidatePath).not.toHaveBeenCalled()
}

beforeEach(() => {
  reiniciarDobles(COLECCIONES)
  conSesion(EDITOR)
  dobles.update.mockResolvedValue({ id: 1, nombre: 'SIGEMype II' })
  dobles.create.mockResolvedValue({ id: 102 })
})

describe('guardarElPlan', () => {
  it('guarda el plan y solo las celdas que cambiaron, todo en una transacción', async () => {
    expect((await guardarElPlan('1', FORMULARIO)).estado).toBe('guardado')
    expect(
      dobles.update.mock.calls.map(([opciones]) => [
        opciones.collection,
        opciones.id,
        opciones.data,
      ]),
    ).toEqual([
      ['planes', 1, { nombre: 'SIGEMype II', mensajeDeConsulta: 'Hola', activo: false }],
      ['inclusiones-de-plan', 101, { tipo: 'texto', texto: '8 trabajadores' }],
    ])
    expect(dobles.create).toHaveBeenCalledTimes(1)
    expect(dobles.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'inclusiones-de-plan',
        data: { plan: 1, caracteristica: 12, tipo: 'incluido', texto: null },
      }),
    )
    for (const [opciones] of [...dobles.update.mock.calls, ...dobles.create.mock.calls])
      expect(opciones).toEqual(enLaTransaccion)
    expect(dobles.commitTransaction).toHaveBeenCalledWith('tx-1')
    expect(dobles.rollbackTransaction).not.toHaveBeenCalled()
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('con un monto en una celda no escribe nada y devuelve el error de esa celda', async () => {
    const celdas = FORMULARIO.celdas.map((c) =>
      c.caracteristica === 11 ? { ...c, texto: 'S/ 99' } : c,
    )
    const estado = await guardarElPlan(1, { ...FORMULARIO, celdas })
    expect(estado.estado === 'invalido' && estado.errores.celdas?.[11]).toMatch(/Consultar/)
    expect(dobles.beginTransaction).not.toHaveBeenCalled()
    expect(dobles.update).not.toHaveBeenCalled()
  })

  it('un nombre repetido (400 de Payload) vuelve como error del campo y deshace todo', async () => {
    dobles.update.mockRejectedValueOnce(rechazo('nombre'))
    expect(await guardarElPlan(1, FORMULARIO)).toEqual({
      estado: 'invalido',
      errores: { nombre: ERROR_NOMBRE_REPETIDO },
    })
    expect(dobles.create).not.toHaveBeenCalled()
    seDeshizo()
  })

  it('si Payload rechaza una celda a mitad de camino, nombra esa celda y deshace todo', async () => {
    dobles.create.mockRejectedValueOnce(rechazo('texto'))
    expect(await guardarElPlan(1, FORMULARIO)).toEqual({
      estado: 'invalido',
      errores: { celdas: { 12: ERROR_DE_CELDA } },
    })
    expect(dobles.update).toHaveBeenCalledTimes(2)
    seDeshizo()
  })

  it('cualquier otro error deshace la transacción y se propaga', async () => {
    const caida = Object.assign(new Error('conexión rechazada'), { status: 500 })
    dobles.create.mockRejectedValueOnce(caida)
    await expect(guardarElPlan(1, FORMULARIO)).rejects.toBe(caida)
    seDeshizo()
  })
})
