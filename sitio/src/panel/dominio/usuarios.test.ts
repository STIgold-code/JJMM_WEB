import { describe, expect, it } from 'vitest'

import {
  filtrarUsuarios,
  filtrosDeUsuarios,
  formularioDeCuenta,
  hayCambiosEnLaCuenta,
  nombreVisible,
  ordenarUsuarios,
  textoSinUsuarios,
  type UsuarioDelPanel,
} from './usuarios'

const ANA: UsuarioDelPanel = {
  id: 1,
  nombre: 'Ana Núñez',
  correo: 'ana@jjmm.pe',
  rol: 'administrador',
}
const BETO: UsuarioDelPanel = { id: 2, nombre: null, correo: 'beto@jjmm.pe', rol: 'editor' }
const MARIA: UsuarioDelPanel = {
  id: 3,
  nombre: 'María Ríos',
  correo: 'mr@ejemplo.pe',
  rol: 'editor',
}
const TODOS = [MARIA, BETO, ANA]

describe('nombreVisible', () => {
  it('usa el nombre y, sin nombre, el correo', () => {
    expect(nombreVisible(ANA)).toBe('Ana Núñez')
    expect(nombreVisible(BETO)).toBe('beto@jjmm.pe')
    expect(nombreVisible({ nombre: '  ', correo: 'x@jjmm.pe' })).toBe('x@jjmm.pe')
  })
})

describe('ordenarUsuarios', () => {
  it('ordena por lo que se lee en la fila, sin cambiar la lista original', () => {
    expect(ordenarUsuarios(TODOS).map((u) => u.id)).toEqual([1, 2, 3])
    expect(TODOS.map((u) => u.id)).toEqual([3, 2, 1])
  })
})

describe('filtrosDeUsuarios', () => {
  it('cuenta todas las cuentas, los administradores y los editores', () => {
    expect(filtrosDeUsuarios(TODOS)).toEqual([
      { filtro: 'todos', texto: 'Todas', cantidad: 3 },
      { filtro: 'administrador', texto: 'Administradores', cantidad: 1 },
      { filtro: 'editor', texto: 'Editores', cantidad: 2 },
    ])
  })
})

describe('filtrarUsuarios', () => {
  it('filtra por rol', () => {
    expect(filtrarUsuarios(TODOS, 'editor', '')).toEqual([MARIA, BETO])
    expect(filtrarUsuarios(TODOS, 'administrador', '')).toEqual([ANA])
    expect(filtrarUsuarios(TODOS, 'todos', '')).toEqual(TODOS)
  })

  it('busca en el nombre y el correo, sin tildes ni mayúsculas', () => {
    expect(filtrarUsuarios(TODOS, 'todos', ' maria ')).toEqual([MARIA])
    expect(filtrarUsuarios(TODOS, 'todos', 'NUNEZ')).toEqual([ANA])
    expect(filtrarUsuarios(TODOS, 'todos', 'beto@')).toEqual([BETO])
  })

  it('combina el rol y la búsqueda', () => {
    expect(filtrarUsuarios(TODOS, 'administrador', 'maría')).toEqual([])
  })
})

describe('formularioDeCuenta y hayCambiosEnLaCuenta', () => {
  it('una cuenta nueva empieza vacía y como editor', () => {
    expect(formularioDeCuenta(null)).toEqual({ nombre: '', correo: '', rol: 'editor', clave: '' })
  })

  it('una cuenta existente empieza con sus datos y sin contraseña', () => {
    expect(formularioDeCuenta(BETO)).toEqual({
      nombre: '',
      correo: 'beto@jjmm.pe',
      rol: 'editor',
      clave: '',
    })
  })

  it('solo cuenta como cambio lo que se guardaría distinto', () => {
    const original = formularioDeCuenta(ANA)
    expect(hayCambiosEnLaCuenta(original, { ...original, nombre: ' Ana Núñez ' })).toBe(false)
    expect(hayCambiosEnLaCuenta(original, { ...original, correo: 'ANA@jjmm.pe' })).toBe(false)
    expect(hayCambiosEnLaCuenta(original, { ...original, rol: 'editor' })).toBe(true)
    expect(hayCambiosEnLaCuenta(original, { ...original, clave: 'x' })).toBe(true)
  })
})

describe('textoSinUsuarios', () => {
  it('explica qué aparecerá según el filtro', () => {
    expect(textoSinUsuarios('administrador', '')).toBe('No hay administradores.')
    expect(textoSinUsuarios('editor', '')).toContain('No hay editores.')
  })

  it('con una búsqueda, dice qué no coincidió', () => {
    expect(textoSinUsuarios('todos', ' zeta ')).toBe(
      'Ninguna cuenta coincide con «zeta». Prueba con otra palabra.',
    )
  })
})
