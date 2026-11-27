import Link from 'next/link'

import type { ColorDeEtiqueta, Etiqueta } from '../dominio/publicacion'
import { rutaDeEtiqueta } from '../dominio/rutas-del-blog'
import estilos from './etiquetas-de-publicacion.module.css'

// Una clase por color de la lista cerrada: el Record obliga a cubrirlos todos.
const CLASE_POR_COLOR: Record<ColorDeEtiqueta, string | undefined> = {
  azul: estilos.azul,
  verde: estilos.verde,
  rojo: estilos.rojo,
  amarillo: estilos.amarillo,
  morado: estilos.morado,
  gris: estilos.gris,
}

interface PropsEtiquetasDePublicacion {
  etiquetas: readonly Etiqueta[]
}

export function EtiquetasDePublicacion({ etiquetas }: PropsEtiquetasDePublicacion) {
  if (etiquetas.length === 0) return null
  return (
    <ul className={estilos.etiquetas} aria-label="Etiquetas">
      {etiquetas.map(({ nombre, slug, color }) => (
        <li key={slug}>
          <Link
            className={`${estilos.etiqueta} ${CLASE_POR_COLOR[color]}`}
            href={rutaDeEtiqueta(slug)}
          >
            {nombre}
          </Link>
        </li>
      ))}
    </ul>
  )
}
