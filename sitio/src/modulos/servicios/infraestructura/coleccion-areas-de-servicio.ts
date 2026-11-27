import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import { campoOrden } from '@/compartido/infraestructura/campos/campos-comunes'
import { comoTexto } from '@/compartido/infraestructura/campos/validaciones'
import { GRUPOS_DEL_PANEL } from '@/compartido/infraestructura/panel/grupos-del-panel'

import { esCodigoDeAreaValido, esListaDePuntosValida } from '../dominio/area-de-servicio'

const validarCodigo = (valor: unknown): true | string =>
  esCodigoDeAreaValido(comoTexto(valor)) || 'Usa un código de P1 a P9.'

const validarPuntos = (valor: unknown): true | string =>
  comoTexto(valor) === '' ||
  esListaDePuntosValida(comoTexto(valor)) ||
  'Escribe al menos tres puntos «x,y» separados por espacios, por ejemplo «72.8,155.8 174.1,78.7 216.5,191.5».'

// Las nueve áreas de servicio del sistema SIGE Mype (P1 a P9), con su gajo en la rueda.
export const coleccionAreasDeServicio: CollectionConfig = {
  slug: 'areas-de-servicio',
  labels: { singular: 'Área de servicio', plural: 'Áreas de servicio' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['codigo', 'nombre', 'orden'],
    listSearchableFields: ['nombre', 'codigo'],
    group: GRUPOS_DEL_PANEL.inicio,
    description:
      'Las nueve áreas del sistema SIGE Mype que aparecen en la rueda de «Nuestros servicios» del inicio, con lo que incluye cada una.',
  },
  defaultSort: 'orden',
  access: ACCESO_DE_CONTENIDO,
  fields: [
    {
      name: 'codigo',
      label: 'Código',
      type: 'text',
      required: true,
      unique: true,
      validate: validarCodigo,
      admin: { placeholder: 'P1', description: 'De P1 a P9, como en la rueda SIGE Mype.' },
    },
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    {
      name: 'nombreCorto',
      label: 'Nombre corto',
      type: 'text',
      required: true,
      admin: { description: 'Se usa en las pestañas, por ejemplo «Calidad».' },
    },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
    {
      name: 'puntos',
      label: 'Qué incluye',
      labels: { singular: 'Punto', plural: 'Puntos' },
      type: 'array',
      fields: [{ name: 'texto', label: 'Texto', type: 'text', required: true }],
    },
    {
      name: 'mensajeDeConsulta',
      label: 'Mensaje de WhatsApp para consultar',
      type: 'text',
      admin: { description: 'Por ejemplo «Hola, quiero información del servicio Legal.»' },
    },
    {
      name: 'poligonoEnLaRueda',
      label: 'Gajo en la rueda SIGE Mype',
      type: 'text',
      validate: validarPuntos,
      admin: {
        description:
          'Marca el gajo de esta área en la rueda para que se pueda pulsar. Son puntos «x,y» separados por espacios, medidos sobre la imagen de la rueda de 500 × 550 píxeles. Solo cámbialo si cambia la imagen de la rueda; si lo dejas vacío, el área sigue en las pestañas pero no en la rueda.',
      },
    },
    campoOrden(),
  ],
}
