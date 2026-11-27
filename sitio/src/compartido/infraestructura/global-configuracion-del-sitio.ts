import type { Field, GlobalConfig } from 'payload'

import { accesoPublico, soloAdministradores } from './acceso'
import { campoCelular } from './campos/campos-comunes'
import { validarUrlHttps } from './campos/validaciones'
import { GRUPOS_DEL_PANEL } from './panel/grupos-del-panel'

const MEDIOS = 'medios'

const camposDeMarca: Field[] = [
  { name: 'nombreComercial', label: 'Nombre comercial', type: 'text', required: true },
  { name: 'razonSocial', label: 'Razón social', type: 'text', required: true },
  { name: 'grupo', label: 'Nombre del grupo', type: 'text' },
  { name: 'lema', label: 'Lema', type: 'text' },
  { name: 'logo', label: 'Logotipo', type: 'upload', relationTo: MEDIOS, required: true },
  { name: 'sello', label: 'Sello SIGE Mype', type: 'upload', relationTo: MEDIOS },
]

const camposDeContacto: Field[] = [
  { name: 'correo', label: 'Correo general', type: 'email', required: true },
  campoCelular('celularWhatsApp', 'Celular de WhatsApp'),
  {
    name: 'mensajeWhatsApp',
    label: 'Mensaje de WhatsApp por defecto',
    type: 'text',
    required: true,
    admin: { description: 'Texto con el que se abre el chat si el botón no indica otro.' },
  },
  campoCelular('celularDeLlamadas', 'Celular para llamadas'),
  {
    name: 'textoDelBotonFlotante',
    label: 'Texto del botón flotante de WhatsApp',
    type: 'text',
    required: true,
    defaultValue: 'Escríbenos',
  },
]

const campoRedesSociales: Field = {
  name: 'redesSociales',
  label: 'Redes sociales',
  labels: { singular: 'Red social', plural: 'Redes sociales' },
  type: 'array',
  fields: [
    {
      name: 'red',
      label: 'Red',
      type: 'select',
      required: true,
      options: [
        { value: 'facebook', label: 'Facebook' },
        { value: 'x', label: 'X (Twitter)' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'linkedin', label: 'LinkedIn' },
      ],
    },
    { name: 'url', label: 'Dirección', type: 'text', required: true, validate: validarUrlHttps },
  ],
}

const camposDeSeo: Field[] = [
  { name: 'titulo', label: 'Título por defecto', type: 'text', required: true },
  {
    name: 'descripcion',
    label: 'Descripción por defecto',
    type: 'textarea',
    required: true,
    maxLength: 160,
    admin: { description: 'Aparece en los resultados de Google. Máximo 160 caracteres.' },
  },
  { name: 'imagen', label: 'Imagen para redes sociales', type: 'upload', relationTo: MEDIOS },
]

// Datos de todo el sitio: marca, canales de contacto, redes y SEO por defecto.
// Solo el administrador la edita.
export const globalConfiguracionDelSitio: GlobalConfig = {
  slug: 'configuracion-del-sitio',
  label: 'Configuración del sitio',
  admin: {
    group: GRUPOS_DEL_PANEL.sitio,
    description:
      'Datos que usa todo el sitio: nombre y logotipo del estudio, celulares de WhatsApp y llamadas, correo, redes sociales y lo que muestra Google por defecto. Solo el administrador puede cambiarlos.',
  },
  access: { read: accesoPublico, update: soloAdministradores },
  fields: [
    { name: 'marca', label: 'Marca', type: 'group', fields: camposDeMarca },
    { name: 'contacto', label: 'Contacto', type: 'group', fields: camposDeContacto },
    campoRedesSociales,
    { name: 'seo', label: 'SEO por defecto', type: 'group', fields: camposDeSeo },
  ],
}
