import type { PropsDeBloque } from '@/compartido/componentes/bloques/registro-de-bloques'
import { obtenerContactoDelSitio } from '@/modulos/contacto/componentes/obtener-contacto-del-sitio'
import type { BloqueCarruselDePortadas } from '@/payload-types'

import { mapearCarrusel } from '../infraestructura/mapear-carrusel'
import { CarruselInteractivo } from './carrusel-interactivo'
import { Portada } from './portada'

// Nombre del hero para lectores de pantalla.
const ETIQUETA = 'Portadas del Estudio Contable JJMM'

// Contenedor del bloque «Carrusel de portadas»: prepara las portadas con los celulares de la
// configuración y las dibuja en el servidor; la isla de cliente solo las hace rotar.
export async function CarruselDePortadas({ bloque }: PropsDeBloque<BloqueCarruselDePortadas>) {
  const carrusel = mapearCarrusel(bloque, await obtenerContactoDelSitio())
  if (!carrusel) return null
  const diapositivas = carrusel.portadas.map((portada, indice) => ({
    disposicion: portada.disposicion,
    transicion: portada.transicion,
    contenido: <Portada portada={portada} primera={indice === 0} />,
  }))
  return (
    <CarruselInteractivo
      diapositivas={diapositivas}
      segundosPorPortada={carrusel.segundosPorPortada}
      etiqueta={ETIQUETA}
    />
  )
}
