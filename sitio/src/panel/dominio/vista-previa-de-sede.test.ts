import { describe, expect, it } from 'vitest'

import type { FormularioDeSede } from './formulario-de-sede'
import { vistaPreviaDeSede } from './vista-previa-de-sede'

const FORMULARIO: FormularioDeSede = {
  nombre: 'Sede San Martín de Porres',
  direccion: 'Jr. Iquitos 593',
  distrito: 'San Martín de Porres',
  ciudad: 'Lima',
  celulares: [
    { clave: 1, numero: '951965242', tieneWhatsApp: true },
    { clave: 2, numero: '952 249 102', tieneWhatsApp: false },
  ],
  correo: '',
  mapa: '',
  visible: true,
}

const SEDES = [
  { id: 1, distrito: 'San Martín de Porres', visible: true },
  { id: 2, distrito: 'San Isidro', visible: true },
  { id: 3, distrito: 'Callao', visible: false },
]

describe('vistaPreviaDeSede', () => {
  it('arma la pestaña como el sitio: el distrito nombra la pestaña, WhatsApp y llamada', () => {
    const vista = vistaPreviaDeSede({ formulario: FORMULARIO, idDeLaSede: 1, sedes: SEDES })
    expect(vista).toEqual({
      pestanas: [
        { texto: 'San Martín de Porres', activa: true },
        { texto: 'San Isidro', activa: false },
      ],
      nombre: 'Sede San Martín de Porres',
      direccion: 'Jr. Iquitos 593, San Martín de Porres, Lima',
      whatsapp: '951 965 242',
      llamada: '952 249 102',
      oculta: false,
    })
  })

  it('usa lo que se está escribiendo, no lo guardado', () => {
    const vista = vistaPreviaDeSede({
      formulario: { ...FORMULARIO, distrito: 'Los Olivos' },
      idDeLaSede: 1,
      sedes: SEDES,
    })
    expect(vista.pestanas[0]).toEqual({ texto: 'Los Olivos', activa: true })
  })

  it('una sede nueva va al final; una oculta no tiene pestaña', () => {
    const nueva = vistaPreviaDeSede({ formulario: FORMULARIO, idDeLaSede: null, sedes: SEDES })
    expect(nueva.pestanas.map((p) => p.activa)).toEqual([false, false, true])
    const oculta = vistaPreviaDeSede({
      formulario: { ...FORMULARIO, visible: false },
      idDeLaSede: 1,
      sedes: SEDES,
    })
    expect(oculta.oculta).toBe(true)
    expect(oculta.pestanas).toEqual([{ texto: 'San Isidro', activa: false }])
  })

  it('ignora los celulares que todavía no son válidos y avisa si nadie atiende por WhatsApp', () => {
    const vista = vistaPreviaDeSede({
      formulario: {
        ...FORMULARIO,
        celulares: [
          { clave: 1, numero: '95196', tieneWhatsApp: true },
          { clave: 2, numero: '952249102', tieneWhatsApp: false },
        ],
      },
      idDeLaSede: 1,
      sedes: SEDES,
    })
    expect(vista.whatsapp).toBeNull()
    expect(vista.llamada).toBe('952 249 102')
  })
})
