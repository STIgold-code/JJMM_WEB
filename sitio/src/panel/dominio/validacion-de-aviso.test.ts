import { describe, expect, it } from 'vitest'

import { ERROR_DE_FORMULARIO } from './formularios'
import { ERROR_DE_CORREO } from './respuesta-al-mensaje'
import { validarFormularioDeAviso } from './validacion-de-aviso'

const FORMULARIO = {
  titulo: '  Cierre de planilla ',
  cuandoAplica: 'Inicia el 20 de cada mes.\r\n\r\nSegundo párrafo.  ',
  documentos: ' Permisos \r\n\n  Vacaciones\n',
  correo: ' recursoshumanos@jjmm.com.pe ',
}

describe('validarFormularioDeAviso', () => {
  it('limpia los textos y convierte las líneas en la lista de documentos', () => {
    expect(validarFormularioDeAviso(FORMULARIO)).toEqual({
      valido: true,
      datos: {
        titulo: 'Cierre de planilla',
        cuandoAplica: 'Inicia el 20 de cada mes.\n\nSegundo párrafo.',
        documentos: ['Permisos', 'Vacaciones'],
        correo: 'recursoshumanos@jjmm.com.pe',
      },
    })
  })

  it('el correo y los documentos son opcionales', () => {
    const resultado = validarFormularioDeAviso({ ...FORMULARIO, documentos: ' ', correo: '' })
    expect(resultado).toMatchObject({ valido: true, datos: { documentos: [], correo: null } })
  })

  it('exige título y cuándo aplica, y un correo válido', () => {
    expect(
      validarFormularioDeAviso({ titulo: ' ', cuandoAplica: '', documentos: '', correo: 'a@b' }),
    ).toEqual({
      valido: false,
      errores: {
        titulo: 'Escribe el título del aviso.',
        cuandoAplica: 'Escribe cuándo aplica el aviso.',
        correo: ERROR_DE_CORREO,
      },
    })
  })

  it('pone topes a los textos y a la lista', () => {
    const muchos = Array.from({ length: 51 }, (_, i) => `Documento ${i}`).join('\n')
    const resultado = validarFormularioDeAviso({
      ...FORMULARIO,
      titulo: 'x'.repeat(201),
      cuandoAplica: 'x'.repeat(2001),
      documentos: muchos,
    })
    expect(resultado).toEqual({
      valido: false,
      errores: {
        titulo: 'Es demasiado largo: usa hasta 200 caracteres.',
        cuandoAplica: 'Es demasiado largo: usa hasta 2000 caracteres.',
        documentos: 'Un aviso puede tener hasta 50 documentos.',
      },
    })
    expect(validarFormularioDeAviso({ ...FORMULARIO, documentos: 'x'.repeat(201) })).toEqual({
      valido: false,
      errores: { documentos: 'Cada documento puede tener hasta 200 caracteres.' },
    })
  })

  it('un formulario con otra forma no se juzga: error general', () => {
    for (const entrada of [null, 'texto', [], { ...FORMULARIO, documentos: ['Permisos'] }])
      expect(validarFormularioDeAviso(entrada)).toEqual({
        valido: false,
        errores: { general: ERROR_DE_FORMULARIO },
      })
  })
})
