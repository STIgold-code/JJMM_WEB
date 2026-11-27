import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText,
} from '@payloadcms/richtext-lexical/react'

import { rutaDeDocumentoInterno } from '@/modulos/blog/dominio/rutas-del-blog'

// Vive en la ruta y no en `modulos/blog/componentes/` porque depende de @payloadcms/*, que
// la capa de componentes no puede importar. Dibuja en el servidor, sin JavaScript de cliente.

// Enlaces internos del editor: documentos del blog por su slug. Lo demás no tiene página.
function rutaDeEnlaceInterno({ linkNode }: { linkNode: SerializedLinkNode }): string {
  const documento = linkNode.fields.doc
  if (!documento || typeof documento.value !== 'object') return '#'
  const { slug } = documento.value
  const ruta = rutaDeDocumentoInterno(documento.relationTo, typeof slug === 'string' ? slug : null)
  return ruta ?? '#'
}

const CONVERSORES: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref: rutaDeEnlaceInterno }),
})

interface PropsContenidoEnriquecido {
  contenido: SerializedEditorState
}

export function ContenidoEnriquecido({ contenido }: PropsContenidoEnriquecido) {
  return <RichText data={contenido} converters={CONVERSORES} disableContainer />
}
