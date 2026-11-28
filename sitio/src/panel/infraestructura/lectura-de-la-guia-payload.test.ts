import { describe, expect, it } from 'vitest'

import { instanteDelDia } from '../dominio/fechas-de-cronograma'
import { aAvisoDelPanel, aCronogramaDelPanel } from './lectura-de-la-guia-payload'

const GUARDADO = {
  id: 7,
  anio: 2026,
  mes: 1,
  periodo: null,
  fechasPorDigito: [
    // Lo que escribe el panel (mediodía de Lima) y lo que pudo escribir el /admin.
    { digito: 0, fecha: instanteDelDia('2026-02-13') },
    { digito: 1, fecha: '2026-02-16T05:00:00.000Z' },
    { digito: 2, fecha: '2026-02-17T12:00:00.000Z' },
  ],
  fechaBuenosContribuyentes: '2026-02-26T17:00:00.000Z',
  updatedAt: '',
  createdAt: '',
}

describe('aCronogramaDelPanel', () => {
  it('lee cada fecha como el día de Lima, sin correrla, y nombra el periodo', () => {
    expect(aCronogramaDelPanel(GUARDADO)).toEqual({
      id: 7,
      anio: 2026,
      mes: 1,
      periodo: 'Enero 2026',
      fechas: [
        { digito: 0, fecha: '2026-02-13' },
        { digito: 1, fecha: '2026-02-16' },
        { digito: 2, fecha: '2026-02-17' },
      ],
      buenosContribuyentes: '2026-02-26',
    })
  })
})

describe('aAvisoDelPanel', () => {
  it('un aviso sin «activo» marcado se lee oculto, como lo trata el sitio', () => {
    const aviso = aAvisoDelPanel({
      id: 1,
      titulo: 'Cierre de planilla',
      cuandoAplica: 'Inicia el 20 de cada mes.',
      documentos: [{ texto: 'Permisos', id: 'a' }],
      correoDeContacto: ' ',
      orden: 2,
      activo: null,
      updatedAt: '',
      createdAt: '',
    })
    expect(aviso).toMatchObject({ documentos: ['Permisos'], correo: null, visible: false })
  })
})
