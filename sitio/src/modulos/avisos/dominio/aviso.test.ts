import { describe, expect, it } from 'vitest'

import { type AvisoGuardado, prepararAviso } from './aviso'

const AVISO: AvisoGuardado = {
  titulo: 'Cierre tributario',
  cuandoAplica: 'Inicia del 1.º al 5.º día útil de cada mes.',
  documentos: ['Comprobantes de compras', 'Comprobantes de ventas'],
  correoDeContacto: 'contabilidad@jjmm.com.pe',
}

describe('prepararAviso', () => {
  it('conserva el título y los documentos en su orden', () => {
    const aviso = prepararAviso(AVISO)

    expect(aviso.titulo).toBe('Cierre tributario')
    expect(aviso.documentos).toEqual(['Comprobantes de compras', 'Comprobantes de ventas'])
  })

  it('separa «cuándo aplica» en párrafos por cada línea en blanco', () => {
    const aviso = prepararAviso({
      ...AVISO,
      cuandoAplica: 'Inicia el 1.º día útil.\n\n  Se toma 03 días hábiles.  \n\n\n',
    })

    expect(aviso.parrafos).toEqual(['Inicia el 1.º día útil.', 'Se toma 03 días hábiles.'])
  })

  it('arma el enlace mailto del correo de contacto', () => {
    expect(prepararAviso(AVISO).correo).toEqual({
      texto: 'contabilidad@jjmm.com.pe',
      href: 'mailto:contabilidad@jjmm.com.pe',
    })
  })

  it('no publica correo si el aviso no lo tiene', () => {
    expect(prepararAviso({ ...AVISO, correoDeContacto: null }).correo).toBeNull()
  })
})
