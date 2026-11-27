import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'

import type { ResumenDePublicacion } from '../dominio/publicacion'
import estilos from './listado-del-blog.module.css'
import { TarjetaDePublicacion } from './tarjeta-de-publicacion'

interface PropsListaDePublicaciones {
  publicaciones: readonly ResumenDePublicacion[]
  // Texto del panel cuando no hay publicaciones.
  textoVacio: string
}

// Escalona la entrada por columna (tres por fila en escritorio).
const retrasoDe = (indice: number): number => (indice % 3) * 0.15

export function ListaDePublicaciones({ publicaciones, textoVacio }: PropsListaDePublicaciones) {
  if (publicaciones.length === 0) return <p className={estilos.vacio}>{textoVacio}</p>
  return (
    <ul className={estilos.rejilla}>
      {publicaciones.map((publicacion, indice) => (
        <li key={publicacion.slug} {...propsDeRevelado({ retraso: retrasoDe(indice) })}>
          <TarjetaDePublicacion publicacion={publicacion} destacada={indice === 0} />
        </li>
      ))}
    </ul>
  )
}
