import { idDeTitulo } from '@/compartido/componentes/bloques/encabezado-de-seccion'
import type { PropsDeBloque } from '@/compartido/componentes/bloques/registro-de-bloques'
import type { BloquePorQueElegirnos } from '@/payload-types'

import { obtenerValores } from './obtener-valores'
import { PorQueElegirnos } from './por-que-elegirnos'

// Contenedor del bloque «¿Por qué elegirnos?»: textos del bloque y valores de su colección.
// Sin valores cargados la sección no se dibuja.
export async function PorQueElegirnosContenedor({ bloque }: PropsDeBloque<BloquePorQueElegirnos>) {
  const valores = await obtenerValores()
  if (valores.length === 0) return null
  return (
    <PorQueElegirnos
      ancla={bloque.ancla || null}
      idDelTitulo={idDeTitulo(bloque.blockType, bloque.ancla)}
      titulo={bloque.titulo}
      bajada={bloque.bajada || null}
      valores={valores}
    />
  )
}
