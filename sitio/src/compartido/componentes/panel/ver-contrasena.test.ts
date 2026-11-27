import { describe, expect, it } from 'vitest'

import { estadoDeVerContrasena } from './ver-contrasena'

describe('estadoDeVerContrasena', () => {
  it('con la contraseña oculta, ofrece mostrarla y el botón no está presionado', () => {
    expect(estadoDeVerContrasena(false)).toEqual({
      etiqueta: 'Mostrar contraseña',
      presionado: false,
      tipo: 'password',
    })
  })

  it('con la contraseña visible, ofrece ocultarla y el botón está presionado', () => {
    expect(estadoDeVerContrasena(true)).toEqual({
      etiqueta: 'Ocultar contraseña',
      presionado: true,
      tipo: 'text',
    })
  })
})
