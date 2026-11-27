'use client'

import { useListQuery } from '@payloadcms/ui'

import { EstadoVacio } from '@/compartido/componentes/panel/estado-vacio'

import { hayBusquedaOFiltros, textoDeListaVacia } from './texto-de-lista-vacia'

// Estado vacío de la lista de mensajes (`admin.components.beforeListTable`). Payload dibuja el
// suyo, que ofrece «Crear Mensaje de contacto»; `_contenido.scss` lo oculta en esta colección y
// queda este. Vive en infraestructura porque lee la consulta de la lista con `useListQuery`.
export function ListaVaciaDeMensajes() {
  const { data, query } = useListQuery()
  if (!data || data.docs.length > 0) return null
  const { titulo, detalle } = textoDeListaVacia(hayBusquedaOFiltros(query))
  return <EstadoVacio icono="mensaje" titulo={titulo} detalle={detalle} />
}
