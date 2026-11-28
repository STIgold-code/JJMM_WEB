import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_TU_PROPIA_CUENTA } from '../aplicacion/guardar-usuario'
import {
  ERROR_DEGRADAR_AL_ULTIMO,
  ERROR_ELIMINAR_AL_ULTIMO,
  ERROR_ELIMINAR_TU_CUENTA,
} from '../dominio/reglas-de-administradores'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Reglas de la cuenta propia y del último administrador, en el servidor, con la guardia y el
// adaptador reales (solo Next y la Local API son dobles).
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

const { eliminarElUsuario, guardarElUsuario } = await import('./usuarios')

const COMO_EDITOR = { nombre: 'Ana', correo: 'a@jjmm.pe', rol: 'editor', clave: '' }
const OTRO_ADMINISTRADOR = { id: 3, rol: 'administrador', email: 'b@jjmm.pe' }

// Ninguna escritura, aunque sí se haya leído la lista de cuentas para decidir.
function noSeEscribio() {
  nadaSeEscribio()
  expect(dobles.find).toHaveBeenCalledWith(
    expect.objectContaining({ collection: 'usuarios', overrideAccess: false }),
  )
}

function conCuentas(usuarios: object[]) {
  reiniciarDobles({ usuarios })
  conSesion(ADMINISTRADOR)
}

describe('la cuenta propia', () => {
  beforeEach(() => conCuentas([ADMINISTRADOR, EDITOR, OTRO_ADMINISTRADOR]))

  it('el administrador no puede eliminar su propia cuenta, aunque haya otro', async () => {
    expect(await eliminarElUsuario(1)).toEqual({ ok: false, error: ERROR_ELIMINAR_TU_CUENTA })
    noSeEscribio()
  })

  it('el administrador no edita su propia cuenta desde «Usuarios» (ni su rol ni su contraseña)', async () => {
    const formulario = { ...COMO_EDITOR, clave: 'clave nueva larga' }
    expect(await guardarElUsuario(1, formulario)).toEqual({
      estado: 'error',
      error: ERROR_TU_PROPIA_CUENTA,
    })
    nadaSeEscribio()
  })
})

describe('el último administrador', () => {
  // La lista guardada tiene un solo administrador (la cuenta 3), por ejemplo porque otro
  // administrador lo degradó mientras esta pantalla estaba abierta.
  beforeEach(() => conCuentas([EDITOR, OTRO_ADMINISTRADOR]))

  it('no se elimina', async () => {
    expect(await eliminarElUsuario(3)).toEqual({ ok: false, error: ERROR_ELIMINAR_AL_ULTIMO })
    noSeEscribio()
  })

  it('no pasa a editor: el error va junto al rol', async () => {
    expect(await guardarElUsuario(3, COMO_EDITOR)).toEqual({
      estado: 'invalido',
      errores: { rol: ERROR_DEGRADAR_AL_ULTIMO },
    })
    noSeEscribio()
  })

  it('sí se le cambia el nombre o la contraseña si sigue como administrador', async () => {
    dobles.update.mockResolvedValue({ id: 3 })
    const formulario = { ...COMO_EDITOR, rol: 'administrador', clave: 'clave nueva larga' }
    expect((await guardarElUsuario(3, formulario)).estado).toBe('guardado')
    expect(dobles.update).toHaveBeenCalledTimes(1)
  })
})
