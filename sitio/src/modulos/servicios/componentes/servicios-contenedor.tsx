import Image from 'next/image'

import {
  CLASE_DE_SECCION,
  EncabezadoDeSeccion,
  idDeTitulo,
} from '@/compartido/componentes/bloques/encabezado-de-seccion'
import type { PropsDeBloque } from '@/compartido/componentes/bloques/registro-de-bloques'
import type { ContactoDelSitio } from '@/compartido/dominio/configuracion-del-sitio'
import type { Imagen } from '@/compartido/dominio/imagen'
import { aImagen } from '@/compartido/infraestructura/imagen-de-medio'
import { obtenerContactoDelSitio } from '@/modulos/contacto/componentes/obtener-contacto-del-sitio'
import { enlaceDeConsulta } from '@/modulos/contacto/dominio/enlace-de-consulta'
import type { BloqueServicios } from '@/payload-types'

import type { AreaGuardada } from '../aplicacion/listar-areas'
import { obtenerAreas } from './obtener-areas'
import { PanelDeArea } from './panel-de-area'
import { type PestanaDeArea, PestanasDeServicios } from './pestanas-de-servicios'
import estilos from './servicios.module.css'

// Nombre de la lista de pestañas para lectores de pantalla.
const ETIQUETA_DE_PESTANAS = 'Áreas de servicio SIGE Mype'

function pestanasDeAreas(
  areas: readonly AreaGuardada[],
  contacto: ContactoDelSitio | null,
  textoDelBoton: string,
  conRueda: boolean,
): PestanaDeArea[] {
  return areas.map((area) => {
    const consulta = contacto
      ? { href: enlaceDeConsulta(contacto, area.mensajeDeConsulta).href, texto: textoDelBoton }
      : null
    return {
      codigo: area.codigo,
      nombreCorto: area.nombreCorto,
      gajo: conRueda ? area.poligonoEnLaRueda : null,
      panel: <PanelDeArea area={area} consulta={consulta} />,
    }
  })
}

function Rueda({ imagen }: { imagen: Imagen }) {
  return (
    <Image
      src={imagen.url}
      alt={imagen.alt}
      width={imagen.ancho}
      height={imagen.alto}
      sizes="(min-width: 70rem) 25rem, 22rem"
    />
  )
}

// Contenedor del bloque «Servicios»: áreas de su colección, rueda del bloque y botón de
// consulta por WhatsApp con el mensaje de cada área. Sin áreas no se dibuja.
export async function ServiciosContenedor({ bloque }: PropsDeBloque<BloqueServicios>) {
  const [areas, contacto] = await Promise.all([obtenerAreas(), obtenerContactoDelSitio()])
  if (areas.length === 0) return null
  const imagen = aImagen(bloque.imagenDeLaRueda)
  const id = idDeTitulo(bloque.blockType, bloque.ancla)
  const pestanas = pestanasDeAreas(areas, contacto, bloque.textoDelBoton, imagen !== null)
  const rueda = imagen ? <Rueda imagen={imagen} /> : null

  return (
    <section
      className={`${CLASE_DE_SECCION} ${estilos.servicios}`}
      id={bloque.ancla || undefined}
      aria-labelledby={id}
    >
      <div className="contenedor">
        <EncabezadoDeSeccion id={id} titulo={bloque.titulo} bajada={bloque.bajada} />
        <PestanasDeServicios areas={pestanas} rueda={rueda} etiqueta={ETIQUETA_DE_PESTANAS} />
      </div>
    </section>
  )
}
