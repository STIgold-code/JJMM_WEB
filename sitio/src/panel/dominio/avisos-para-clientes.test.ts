import { describe, expect, it } from 'vitest'

import {
  type AvisoDelPanel,
  avisoDeAvisoGuardado,
  avisoDeVisibilidadDeAviso,
  formularioDeAviso,
  hayCambiosEnElAviso,
  secundarioDeAviso,
} from './avisos-para-clientes'

const AVISO: AvisoDelPanel = {
  id: 1,
  titulo: 'Cierre tributario',
  cuandoAplica:
    'Inicia del 1.º al 5.º día útil de cada mes.\n\nA la recepción de la documentación se tomará 03 días hábiles.',
  documentos: ['Comprobantes de compras', 'Comprobantes de ventas'],
  correo: 'contabilidad@jjmm.com.pe',
  visible: true,
  orden: 0,
}

describe('secundarioDeAviso', () => {
  it('muestra el primer párrafo de «Cuándo aplica» y cuántos documentos pide', () => {
    expect(secundarioDeAviso(AVISO)).toBe(
      'Inicia del 1.º al 5.º día útil de cada mes. · 2 documentos',
    )
  })

  it('usa el singular y avisa cuando falta el correo', () => {
    expect(secundarioDeAviso({ ...AVISO, documentos: ['Permisos'], correo: null })).toBe(
      'Inicia del 1.º al 5.º día útil de cada mes. · 1 documento · sin correo',
    )
  })
})

describe('formularioDeAviso', () => {
  it('pone los documentos uno por línea, como los edita la maqueta', () => {
    expect(formularioDeAviso(AVISO)).toEqual({
      titulo: 'Cierre tributario',
      cuandoAplica: AVISO.cuandoAplica,
      documentos: 'Comprobantes de compras\nComprobantes de ventas',
      correo: 'contabilidad@jjmm.com.pe',
    })
  })

  it('un aviso nuevo empieza vacío', () => {
    expect(formularioDeAviso(null)).toEqual({
      titulo: '',
      cuandoAplica: '',
      documentos: '',
      correo: '',
    })
  })

  it('detecta cambios', () => {
    const original = formularioDeAviso(AVISO)
    expect(hayCambiosEnElAviso(original, { ...original })).toBe(false)
    expect(hayCambiosEnElAviso(original, { ...original, correo: '' })).toBe(true)
  })
})

describe('avisos breves', () => {
  it('explican si el aviso se ve o no en la guía', () => {
    expect(avisoDeVisibilidadDeAviso('Cierre tributario', false).titulo).toBe(
      '«Cierre tributario» quedó oculto en la guía',
    )
    expect(avisoDeAvisoGuardado(false).detalle).toBe(
      'El aviso está oculto: enciende «Visible» en la lista para mostrarlo en la guía.',
    )
  })
})
