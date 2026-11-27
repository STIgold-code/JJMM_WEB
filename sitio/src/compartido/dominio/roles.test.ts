import { describe, expect, it } from 'vitest'

import { esAdministrador, esDelEquipo, rolDelNuevoUsuario } from './roles'

describe('esAdministrador', () => {
  it('solo es cierto para el rol administrador', () => {
    expect(esAdministrador({ rol: 'administrador' })).toBe(true)
    expect(esAdministrador({ rol: 'editor' })).toBe(false)
    expect(esAdministrador({ rol: null })).toBe(false)
    expect(esAdministrador(null)).toBe(false)
  })
})

describe('esDelEquipo', () => {
  it('es cierto para administradores y editores', () => {
    expect(esDelEquipo({ rol: 'administrador' })).toBe(true)
    expect(esDelEquipo({ rol: 'editor' })).toBe(true)
  })

  it('es falso sin sesión o con un rol desconocido', () => {
    expect(esDelEquipo(null)).toBe(false)
    expect(esDelEquipo(undefined)).toBe(false)
    expect(esDelEquipo({ rol: 'visitante' })).toBe(false)
  })
})

describe('rolDelNuevoUsuario', () => {
  it('el primer usuario siempre es administrador, para que nadie quede sin acceso', () => {
    expect(rolDelNuevoUsuario(0, 'editor')).toBe('administrador')
    expect(rolDelNuevoUsuario(0, undefined)).toBe('administrador')
  })

  it('los siguientes usuarios conservan el rol pedido o son editores', () => {
    expect(rolDelNuevoUsuario(2, 'administrador')).toBe('administrador')
    expect(rolDelNuevoUsuario(2, 'editor')).toBe('editor')
    expect(rolDelNuevoUsuario(2, undefined)).toBe('editor')
  })
})
