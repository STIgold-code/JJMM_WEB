import { describe, expect, it } from 'vitest'

import { leerCredenciales } from './ingreso'

describe('leerCredenciales', () => {
  it('quita los espacios del correo pero no toca la contraseña', () => {
    expect(leerCredenciales('  estudio@jjmm.pe ', ' clave ')).toEqual({
      correo: 'estudio@jjmm.pe',
      clave: ' clave ',
    })
  })

  it.each([
    ['', 'clave'],
    ['estudio@jjmm.pe', ''],
    [null, 'clave'],
    ['estudio@jjmm.pe', null],
    ['   ', 'clave'],
  ])('rechaza datos incompletos (%j, %j)', (correo, clave) => {
    expect(leerCredenciales(correo, clave)).toBeNull()
  })
})
