import { describe, expect, it } from 'vitest'

import {
  ERROR_DEGRADAR_AL_ULTIMO,
  ERROR_ELIMINAR_AL_ULTIMO,
  ERROR_ELIMINAR_TU_CUENTA,
  motivoParaNoCambiarElRol,
  motivoParaNoEliminar,
} from './reglas-de-administradores'

const UN_ADMINISTRADOR = [
  { id: 1, rol: 'administrador' as const },
  { id: 2, rol: 'editor' as const },
]
const DOS_ADMINISTRADORES = [...UN_ADMINISTRADOR, { id: 3, rol: 'administrador' as const }]

describe('motivoParaNoEliminar', () => {
  it('nadie elimina su propia cuenta, aunque haya otros administradores', () => {
    expect(motivoParaNoEliminar(DOS_ADMINISTRADORES, { objetivo: 1, actor: 1 })).toBe(
      ERROR_ELIMINAR_TU_CUENTA,
    )
  })

  it('el último administrador no se elimina, lo pida quien lo pida', () => {
    expect(motivoParaNoEliminar(UN_ADMINISTRADOR, { objetivo: 1, actor: 3 })).toBe(
      ERROR_ELIMINAR_AL_ULTIMO,
    )
  })

  it('se elimina un editor o un administrador que no es el último', () => {
    expect(motivoParaNoEliminar(UN_ADMINISTRADOR, { objetivo: 2, actor: 1 })).toBeNull()
    expect(motivoParaNoEliminar(DOS_ADMINISTRADORES, { objetivo: 3, actor: 1 })).toBeNull()
  })

  it('una cuenta que no está en la lista no tiene motivo aquí (la decide el repositorio)', () => {
    expect(motivoParaNoEliminar(UN_ADMINISTRADOR, { objetivo: 9, actor: 1 })).toBeNull()
  })
})

describe('motivoParaNoCambiarElRol', () => {
  it('el último administrador no pasa a editor, ni por su cuenta ni por otra', () => {
    for (const actor of [1, 3])
      expect(
        motivoParaNoCambiarElRol(UN_ADMINISTRADOR, { objetivo: 1, actor, rolNuevo: 'editor' }),
      ).toBe(ERROR_DEGRADAR_AL_ULTIMO)
  })

  it('con otro administrador, sí puede pasar a editor', () => {
    expect(
      motivoParaNoCambiarElRol(DOS_ADMINISTRADORES, { objetivo: 1, actor: 3, rolNuevo: 'editor' }),
    ).toBeNull()
  })

  it('mantener el rol o subir a un editor nunca tiene motivo para impedirse', () => {
    const cambios = [
      { objetivo: 1, rolNuevo: 'administrador' as const },
      { objetivo: 2, rolNuevo: 'administrador' as const },
      { objetivo: 2, rolNuevo: 'editor' as const },
    ]
    for (const cambio of cambios)
      expect(motivoParaNoCambiarElRol(UN_ADMINISTRADOR, { ...cambio, actor: 1 })).toBeNull()
  })
})
