import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'

import type { AvisoPublico } from '../dominio/aviso'
import estilos from './avisos.module.css'
import { TarjetaDeAviso } from './tarjeta-de-aviso'

interface PropsSeccionAvisos {
  titulo: string
  avisos: readonly AvisoPublico[]
}

// Segundos entre la entrada de una tarjeta y la siguiente.
const ESCALON = 0.15

// Avisos para clientes en tarjetas. Sin avisos visibles, la sección no se dibuja.
export function SeccionAvisos({ titulo, avisos }: PropsSeccionAvisos) {
  if (avisos.length === 0) return null
  return (
    <section id="avisos" className={estilos.seccion} aria-labelledby="titulo-avisos">
      <div className="contenedor">
        <h2 id="titulo-avisos" {...propsDeRevelado({ clase: estilos.encabezado })}>
          {titulo}
        </h2>
        <div className={estilos.rejilla}>
          {avisos.map((aviso, posicion) => (
            <TarjetaDeAviso
              key={aviso.titulo}
              titulo={aviso.titulo}
              parrafos={aviso.parrafos}
              documentos={aviso.documentos}
              correo={aviso.correo}
              retraso={posicion * ESCALON}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
