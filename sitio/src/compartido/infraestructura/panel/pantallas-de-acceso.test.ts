import { describe, expect, it } from 'vitest'

import { esPantallaDeAcceso } from './pantallas-de-acceso'

const RUTAS = {
  login: '/login',
  createFirstUser: '/create-first-user',
  forgot: '/forgot',
  reset: '/reset',
  logout: '/logout',
  inactivity: '/logout-inactivity',
  unauthorized: '/unauthorized',
  account: '/account',
}

describe('esPantallaDeAcceso', () => {
  it.each([
    '/admin/login',
    '/admin/create-first-user',
    '/admin/forgot',
    '/admin/reset/un-token',
    '/admin/logout',
    '/admin/logout-inactivity',
    '/admin/unauthorized',
    '/admin/usuarios/verify/un-token',
  ])('reconoce %s como pantalla de acceso', (ruta) => {
    expect(esPantallaDeAcceso(ruta, '/admin', RUTAS)).toBe(true)
  })

  it.each([
    '/admin',
    '/admin/account',
    '/admin/collections/sedes',
    '/admin/globals/pagina-de-inicio',
    '/admin/login-extra',
  ])('no confunde %s con una pantalla de acceso', (ruta) => {
    expect(esPantallaDeAcceso(ruta, '/admin', RUTAS)).toBe(false)
  })

  it('respeta una ruta del panel distinta de /admin', () => {
    expect(esPantallaDeAcceso('/panel/login', '/panel', RUTAS)).toBe(true)
    expect(esPantallaDeAcceso('/admin/login', '/panel', RUTAS)).toBe(false)
  })
})
