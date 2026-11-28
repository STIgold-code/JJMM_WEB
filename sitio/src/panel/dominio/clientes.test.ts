import { describe, expect, it } from 'vitest'

import {
  avisoDeNombresPorConfirmar,
  type ClienteDelPanel,
  conteosDeClientes,
  filtrarClientes,
  formularioDeCliente,
  hayCambiosEnElCliente,
  nombrePorConfirmar,
  RUTA_DE_CLIENTES,
  secundarioDeCliente,
} from './clientes'
import { ERROR_DE_ENLACE, ERROR_DE_LOGO, validarFormularioDeCliente } from './validacion-de-cliente'
import { ERROR_DE_FORMULARIO } from './formularios'

const LOGO = {
  id: 7,
  url: '/api/medios/file/logo.png',
  alt: 'Cadex',
  nombre: 'logo.png',
  ancho: 200,
  alto: 80,
}
const PENDIENTE = 'Cliente del estudio (nombre por confirmar)'

const cliente = (id: number, nombre: string, visible = true): ClienteDelPanel => ({
  id,
  nombre,
  logo: LOGO,
  enlace: null,
  visible,
  orden: id,
})

const CLIENTES = [
  cliente(1, 'Cadex'),
  cliente(2, PENDIENTE),
  cliente(3, 'Insutec', false),
  cliente(4, 'Interfreeze'),
  cliente(5, 'Líneas Perú Travel'),
  cliente(6, PENDIENTE),
]

describe('clientes', () => {
  it('tienen su pantalla', () => {
    expect(RUTA_DE_CLIENTES).toBe('/panel/clientes')
  })

  it('un nombre «por confirmar» se reconoce en el texto, sin posiciones fijas', () => {
    expect(nombrePorConfirmar(PENDIENTE)).toBe(true)
    expect(nombrePorConfirmar('Cadex')).toBe(false)
  })

  it('el aviso nombra las posiciones de los que faltan confirmar, en el orden actual', () => {
    expect(avisoDeNombresPorConfirmar(CLIENTES)).toBe(
      '2 logotipos no tienen nombre confirmado (posiciones 2 y 6).',
    )
    expect(avisoDeNombresPorConfirmar(CLIENTES.slice(0, 3))).toBe(
      'Un logotipo no tiene nombre confirmado (posición 2).',
    )
    expect(avisoDeNombresPorConfirmar([cliente(1, 'Cadex')])).toBeNull()
  })

  it('el dato secundario es su sitio web', () => {
    expect(secundarioDeCliente({ enlace: 'https://cadex.pe' })).toBe('https://cadex.pe')
    expect(secundarioDeCliente({ enlace: null })).toBe('Sin sitio web')
  })

  it('filtra por visibilidad y por nombre, sin tildes ni mayúsculas, y cuenta cada filtro', () => {
    expect(filtrarClientes(CLIENTES, 'oculta', '').map((c) => c.id)).toEqual([3])
    expect(filtrarClientes(CLIENTES, 'todos', 'lineas').map((c) => c.id)).toEqual([5])
    expect(filtrarClientes(CLIENTES, 'visible', 'IN').map((c) => c.id)).toEqual([4, 5])
    expect(filtrarClientes(CLIENTES, 'visible', 'insutec')).toEqual([])
    expect(conteosDeClientes(CLIENTES)).toEqual({ todos: 6, visible: 5, oculta: 1 })
  })

  it('el formulario parte de lo guardado; uno nuevo empieza oculto y sin logotipo', () => {
    expect(formularioDeCliente(null)).toEqual({
      nombre: '',
      enlace: '',
      logo: null,
      visible: false,
    })
    const original = formularioDeCliente(CLIENTES[0] ?? null)
    expect(original).toEqual({ nombre: 'Cadex', enlace: '', logo: LOGO, visible: true })
    expect(hayCambiosEnElCliente(original, { ...original, nombre: ' Cadex ' })).toBe(false)
    expect(hayCambiosEnElCliente(original, { ...original, logo: { ...LOGO, id: 8 } })).toBe(true)
    expect(hayCambiosEnElCliente(original, { ...original, visible: false })).toBe(true)
  })
})

describe('validarFormularioDeCliente', () => {
  const FORMULARIO = { nombre: ' Cadex ', enlace: ' https://cadex.pe ', logo: 7, visible: true }

  it('recorta los textos y lee el logotipo como id', () => {
    expect(validarFormularioDeCliente(FORMULARIO)).toEqual({
      valido: true,
      datos: { nombre: 'Cadex', enlace: 'https://cadex.pe', logo: 7, visible: true },
    })
    const sinEnlace = validarFormularioDeCliente({ ...FORMULARIO, enlace: '' })
    expect(sinEnlace.valido && sinEnlace.datos.enlace).toBeNull()
  })

  it('exige nombre y logotipo; el enlace, si está, con la regla https de la colección', () => {
    expect(
      validarFormularioDeCliente({
        nombre: '',
        enlace: 'http://cadex.pe',
        logo: null,
        visible: true,
      }),
    ).toEqual({
      valido: false,
      errores: {
        nombre: 'Escribe el nombre del cliente.',
        logo: ERROR_DE_LOGO,
        enlace: ERROR_DE_ENLACE,
      },
    })
    expect(validarFormularioDeCliente({ ...FORMULARIO, logo: '7 OR 1=1' }).valido).toBe(false)
  })

  it('una forma que no es la del formulario no se adivina', () => {
    for (const hostil of [null, { ...FORMULARIO, visible: 'si' }, { ...FORMULARIO, nombre: 3 }])
      expect(validarFormularioDeCliente(hostil)).toEqual({
        valido: false,
        errores: { general: ERROR_DE_FORMULARIO },
      })
  })
})
