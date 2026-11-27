import { describe, expect, it } from 'vitest'

import { aEstado, leerDatos, leerInicio, leerTrampa, valoresDe } from './estado-del-formulario'

const formulario = (campos: Record<string, string>) => {
  const datos = new FormData()
  Object.entries(campos).forEach(([nombre, valor]) => datos.set(nombre, valor))
  return datos
}

const VALORES = { nombre: 'Ana', servicio: '', mensaje: 'Hola' }

describe('estado del formulario', () => {
  it('lee solo los campos del mensaje y deja vacío lo que no llegó', () => {
    const datos = formulario({ nombre: 'Ana', mensaje: 'Hola', celular: '987654321' })

    expect(leerDatos(datos)).toEqual({ nombre: 'Ana', servicio: '', mensaje: 'Hola' })
  })

  it('lee el campo trampa y la hora de inicio, que debe ser un número positivo', () => {
    expect(leerTrampa(formulario({ sitioWeb: 'x' }))).toBe('x')
    expect(leerInicio(formulario({ inicio: '1700000000000' }))).toBe(1_700_000_000_000)
    expect(leerInicio(formulario({ inicio: 'abc' }))).toBeNull()
    expect(leerInicio(formulario({}))).toBeNull()
  })

  it('conserva los valores escritos solo cuando el envío no se guardó', () => {
    expect(aEstado({ estado: 'enviado' }, VALORES)).toEqual({ estado: 'enviado' })
    expect(valoresDe(aEstado({ estado: 'limite' }, VALORES))).toEqual(VALORES)
    expect(aEstado({ estado: 'invalido', errores: { nombre: 'x' } }, VALORES)).toEqual({
      estado: 'invalido',
      errores: { nombre: 'x' },
      valores: VALORES,
    })
    expect(valoresDe({ estado: 'enviado' })).toBeNull()
  })
})
