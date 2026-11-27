import { type ObjetoJsonLd, serializarJsonLd } from '@/compartido/dominio/json-ld'

interface PropsDeDatosEstructurados {
  datos: ObjetoJsonLd
}

// JSON-LD para buscadores. El texto ya va escapado (sin `<`), así que no puede cerrar el script.
export function DatosEstructurados({ datos }: PropsDeDatosEstructurados) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializarJsonLd(datos) }}
    />
  )
}
