import { describe, expect, it } from 'vitest'

import {
  agregarCelular,
  cambiarCelular,
  erroresEnVivoDeSede,
  FORMULARIO_DE_SEDE_NUEVA,
  formularioDeSedeGuardada,
  hayCambiosEnLaSede,
  moverCelular,
  quitarCelular,
  unirErroresDeSede,
} from './formulario-de-sede'
import { ERROR_DE_CELULAR } from './respuesta-al-mensaje'
import type { SedeDelPanel } from './sedes'
import { ERROR_DE_MAPA } from './validacion-de-sede'

const SEDE: SedeDelPanel = {
  id: 1,
  nombre: 'Sede San Isidro',
  direccion: 'Calle Gorriones 151',
  distrito: 'San Isidro',
  ciudad: 'Lima',
  celulares: [
    { numero: '951 965 242', tieneWhatsApp: true },
    { numero: '952 249 102', tieneWhatsApp: false },
  ],
  correo: null,
  mapa: null,
  visible: true,
  orden: 0,
}

const guardado = formularioDeSedeGuardada(SEDE)
const numeros = (f: typeof guardado) => f.celulares.map((c) => c.numero)

describe('formularioDeSedeGuardada', () => {
  it('copia los datos de la sede, con una clave por celular y vacíos como texto vacío', () => {
    expect(guardado).toEqual({
      nombre: 'Sede San Isidro',
      direccion: 'Calle Gorriones 151',
      distrito: 'San Isidro',
      ciudad: 'Lima',
      celulares: [
        { clave: 1, numero: '951 965 242', tieneWhatsApp: true },
        { clave: 2, numero: '952 249 102', tieneWhatsApp: false },
      ],
      correo: '',
      mapa: '',
      visible: true,
    })
  })

  it('una sede nueva empieza oculta, en Lima y con un celular por escribir', () => {
    expect(FORMULARIO_DE_SEDE_NUEVA).toMatchObject({ ciudad: 'Lima', visible: false })
    expect(FORMULARIO_DE_SEDE_NUEVA.celulares).toEqual([
      { clave: 1, numero: '', tieneWhatsApp: false },
    ])
  })
})

describe('celulares del formulario', () => {
  it('agrega una fila vacía al final con una clave nueva', () => {
    const conOtro = agregarCelular(guardado)
    expect(conOtro.celulares.at(-1)).toEqual({ clave: 3, numero: '', tieneWhatsApp: false })
  })

  it('quita una fila, pero nunca la última', () => {
    expect(numeros(quitarCelular(guardado, 1))).toEqual(['952 249 102'])
    const uno = quitarCelular(guardado, 1)
    expect(quitarCelular(uno, 2)).toBe(uno)
  })

  it('mueve y cambia una fila sin tocar las demás', () => {
    expect(numeros(moverCelular(guardado, 1, 0))).toEqual(['952 249 102', '951 965 242'])
    const cambiado = cambiarCelular(guardado, 2, { tieneWhatsApp: true })
    expect(cambiado.celulares[1]).toEqual({ clave: 2, numero: '952 249 102', tieneWhatsApp: true })
    expect(cambiado.celulares[0]).toBe(guardado.celulares[0])
  })
})

describe('hayCambiosEnLaSede', () => {
  it('no cuenta espacios de más ni la forma de escribir el mismo celular', () => {
    const igual = cambiarCelular({ ...guardado, nombre: ' Sede San Isidro ' }, 1, {
      numero: '951965242',
    })
    expect(hayCambiosEnLaSede(guardado, igual)).toBe(false)
  })

  it('cuenta un cambio de texto, de orden o de WhatsApp', () => {
    expect(hayCambiosEnLaSede(guardado, { ...guardado, ciudad: 'Callao' })).toBe(true)
    expect(hayCambiosEnLaSede(guardado, moverCelular(guardado, 1, 0))).toBe(true)
    expect(hayCambiosEnLaSede(guardado, cambiarCelular(guardado, 2, { tieneWhatsApp: true }))).toBe(
      true,
    )
  })
})

describe('erroresEnVivoDeSede', () => {
  it('marca mientras se escribe los celulares que no son celulares y el mapa que no sirve', () => {
    const conErrores = {
      ...cambiarCelular(guardado, 2, { numero: '01 555 1234' }),
      mapa: 'https://maps.google.com/?q=x',
    }
    expect(erroresEnVivoDeSede(conErrores)).toEqual({
      celular: { 1: ERROR_DE_CELULAR },
      mapa: ERROR_DE_MAPA,
    })
  })

  it('una fila vacía todavía no es un error', () => {
    expect(erroresEnVivoDeSede(agregarCelular(guardado))).toEqual({})
  })
})

describe('unirErroresDeSede', () => {
  it('lo que dijo el servidor gana a lo detectado en vivo', () => {
    expect(
      unirErroresDeSede(
        { mapa: 'vivo', celular: { 0: 'vivo' } },
        { mapa: 'servidor', celular: { 1: 'servidor' } },
      ),
    ).toEqual({ mapa: 'servidor', celular: { 0: 'vivo', 1: 'servidor' } })
  })
})
