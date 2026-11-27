import { describe, expect, it } from 'vitest'

import {
  ACCESO_DE_CONTENIDO,
  accesoPublico,
  administradorOElMismoUsuario,
  publicadoOEquipo,
  soloAdministradores,
  soloEquipo,
} from './acceso'

const ADMINISTRADOR = { id: 1, rol: 'administrador' }
const EDITOR = { id: 2, rol: 'editor' }

const con = (user: { id: number; rol: string } | null) => ({ req: { user } })

describe('control de acceso', () => {
  it('accesoPublico permite a cualquiera, con o sin sesión', () => {
    expect(accesoPublico()).toBe(true)
  })

  it('soloEquipo permite a administradores y editores, no a visitantes', () => {
    expect(soloEquipo(con(ADMINISTRADOR))).toBe(true)
    expect(soloEquipo(con(EDITOR))).toBe(true)
    expect(soloEquipo(con(null))).toBe(false)
  })

  it('soloAdministradores excluye a los editores', () => {
    expect(soloAdministradores(con(ADMINISTRADOR))).toBe(true)
    expect(soloAdministradores(con(EDITOR))).toBe(false)
    expect(soloAdministradores(con(null))).toBe(false)
  })

  it('ACCESO_DE_CONTENIDO deja leer a todos y escribir solo al equipo', () => {
    expect(ACCESO_DE_CONTENIDO.read()).toBe(true)
    expect(ACCESO_DE_CONTENIDO.update(con(EDITOR))).toBe(true)
    expect(ACCESO_DE_CONTENIDO.create(con(null))).toBe(false)
    expect(ACCESO_DE_CONTENIDO.delete(con(null))).toBe(false)
  })

  it('publicadoOEquipo muestra borradores al equipo y solo lo publicado al público', () => {
    expect(publicadoOEquipo(con(EDITOR))).toBe(true)
    expect(publicadoOEquipo(con(null))).toEqual({ _status: { equals: 'published' } })
  })

  it('administradorOElMismoUsuario limita a los editores a su propia cuenta', () => {
    expect(administradorOElMismoUsuario(con(ADMINISTRADOR))).toBe(true)
    expect(administradorOElMismoUsuario(con(EDITOR))).toEqual({ id: { equals: 2 } })
    expect(administradorOElMismoUsuario(con(null))).toBe(false)
  })
})
