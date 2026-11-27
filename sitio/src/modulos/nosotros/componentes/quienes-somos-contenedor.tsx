import { idDeTitulo } from '@/compartido/componentes/bloques/encabezado-de-seccion'
import type { PropsDeBloque } from '@/compartido/componentes/bloques/registro-de-bloques'
import type { BloqueQuienesSomos } from '@/payload-types'

import { parrafosDeTextoEnriquecido } from '../infraestructura/parrafos-de-texto-enriquecido'
import { QuienesSomos } from './quienes-somos'

// Contenedor del bloque «Quiénes somos»: todo su contenido viene en el bloque.
export function QuienesSomosContenedor({ bloque }: PropsDeBloque<BloqueQuienesSomos>) {
  const cifras = (bloque.cifras ?? []).map((cifra) => ({
    prefijo: cifra.prefijo || null,
    valor: cifra.valor,
    sufijo: cifra.sufijo || null,
    descripcion: cifra.descripcion,
  }))
  return (
    <QuienesSomos
      ancla={bloque.ancla || null}
      idDelTitulo={idDeTitulo(bloque.blockType, bloque.ancla)}
      titulo={bloque.titulo}
      cifras={cifras}
      parrafos={parrafosDeTextoEnriquecido(bloque.presentacion)}
    />
  )
}
