import {
  CLASE_DE_SECCION,
  EncabezadoDeSeccion,
  idDeTitulo,
} from '@/compartido/componentes/bloques/encabezado-de-seccion'
import type { PropsDeBloque } from '@/compartido/componentes/bloques/registro-de-bloques'
import { obtenerContactoDelSitio } from '@/modulos/contacto/componentes/obtener-contacto-del-sitio'
import { enlaceDeConsulta } from '@/modulos/contacto/dominio/enlace-de-consulta'
import type { BloquePlanes } from '@/payload-types'

import { obtenerMatrizDePlanes } from './obtener-matriz-de-planes'
import estilos from './planes.module.css'
import { TablaDePlanes } from './tabla-de-planes'

// Contenedor del bloque «Planes»: matriz de las tres colecciones y botón de solicitud por
// WhatsApp con el mensaje de cada plan. Sin planes no se dibuja. Nunca se publican montos (S9).
export async function PlanesContenedor({ bloque }: PropsDeBloque<BloquePlanes>) {
  const [matriz, contacto] = await Promise.all([obtenerMatrizDePlanes(), obtenerContactoDelSitio()])
  if (!matriz) return null
  const id = idDeTitulo(bloque.blockType, bloque.ancla)
  const planes = matriz.planes.map((plan) => ({
    nombre: plan.nombre,
    enlace: contacto ? enlaceDeConsulta(contacto, plan.mensajeDeConsulta).href : null,
  }))
  return (
    <section className={CLASE_DE_SECCION} id={bloque.ancla || undefined} aria-labelledby={id}>
      <div className="contenedor">
        <EncabezadoDeSeccion id={id} titulo={bloque.titulo} bajada={bloque.bajada} />
        <TablaDePlanes
          encabezado={bloque.encabezadoDeCaracteristicas}
          textoDelBoton={bloque.textoDelBoton}
          planes={planes}
          filas={matriz.filas}
        />
        {bloque.notaAlPie ? <p className={estilos.pie}>{bloque.notaAlPie}</p> : null}
      </div>
    </section>
  )
}
