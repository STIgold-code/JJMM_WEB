import type { Block, Field } from 'payload'

import { campoAcciones } from '@/compartido/infraestructura/campos/campos-de-enlace'
import { comoTexto } from '@/compartido/infraestructura/campos/validaciones'

import { validarTextoResaltado } from '../dominio/texto-resaltado'

const validarTitulo = (valor: unknown): true | string =>
  validarTextoResaltado(comoTexto(valor)) ?? true

const camposDeImagen: Field[] = [
  { name: 'imagen', label: 'Imagen', type: 'upload', relationTo: 'medios', required: true },
  {
    name: 'imagenEsDecorativa',
    label: 'La imagen es decorativa (el texto de la portada ya la describe)',
    type: 'checkbox',
    defaultValue: true,
  },
  {
    name: 'imagenParaCelular',
    label: 'Imagen para celular (opcional)',
    type: 'upload',
    relationTo: 'medios',
  },
  {
    name: 'encuadreEnCelular',
    label: 'Encuadre horizontal en celular (%)',
    type: 'number',
    min: 0,
    max: 100,
    admin: {
      description: 'Qué parte de la imagen se ve en pantallas angostas: 0 izquierda, 100 derecha.',
    },
  },
]

const camposDePresentacion: Field[] = [
  {
    name: 'disposicion',
    label: 'Disposición',
    type: 'select',
    required: true,
    defaultValue: 'texto-izquierda',
    options: [
      { value: 'texto-izquierda', label: 'Texto a la izquierda' },
      { value: 'texto-derecha', label: 'Texto a la derecha' },
      { value: 'imagen-completa', label: 'Imagen completa (el texto está en la imagen)' },
    ],
  },
  {
    name: 'transicion',
    label: 'Transición de entrada',
    type: 'select',
    required: true,
    defaultValue: 'fundido',
    options: [
      { value: 'fundido', label: 'Fundido' },
      { value: 'izquierda', label: 'Desde la izquierda' },
      { value: 'bajar', label: 'Desde arriba' },
      { value: 'recorte', label: 'Recorte' },
    ],
  },
]

const camposDeTexto: Field[] = [
  {
    name: 'titulo',
    label: 'Título',
    type: 'text',
    validate: validarTitulo,
    admin: {
      description:
        'Marca la parte resaltada entre corchetes: «Contamos con [Sistema de Calidad] Genuino».',
    },
  },
  { name: 'subtitulo', label: 'Subtítulo', type: 'textarea' },
  { name: 'sello', label: 'Sello (opcional)', type: 'upload', relationTo: 'medios' },
  {
    name: 'lista',
    label: 'Lista',
    labels: { singular: 'Punto', plural: 'Puntos' },
    type: 'array',
    fields: [{ name: 'texto', label: 'Texto', type: 'text', required: true }],
  },
  campoAcciones(2),
]

// Hero del inicio: portadas que rotan solas (S5, S6). La primera lleva el título principal.
export const bloqueCarruselDePortadas: Block = {
  slug: 'carrusel-de-portadas',
  interfaceName: 'BloqueCarruselDePortadas',
  // PostgreSQL limita los nombres a 63 caracteres y el nombre derivado del slug lo supera en
  // las tablas anidadas (portadas, botones). Payload usa este nombre tal cual, sin prefijo.
  dbName: 'inicio_blocks_carrusel',
  labels: { singular: 'Carrusel de portadas', plural: 'Carruseles de portadas' },
  fields: [
    {
      name: 'segundosPorPortada',
      label: 'Segundos por portada',
      type: 'number',
      required: true,
      defaultValue: 9,
      min: 3,
      max: 30,
    },
    {
      name: 'portadas',
      label: 'Portadas',
      labels: { singular: 'Portada', plural: 'Portadas' },
      type: 'array',
      minRows: 1,
      fields: [...camposDeImagen, ...camposDePresentacion, ...camposDeTexto],
    },
  ],
}
