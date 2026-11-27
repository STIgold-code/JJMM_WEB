import { Icono } from '@/compartido/componentes/iconos/icono'
import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'

import type { SedeDelMapa } from '../infraestructura/mapear-sede-del-mapa'
import estilos from './contacto.module.css'

interface PropsMapaDeSede {
  sede: SedeDelMapa
  // Sin texto del botón (o sin enlace) no hay botón.
  textoDelBoton: string | null
  retraso: number
}

// Tarjeta de la sede con el enlace a su mapa. El mapa se abre en el servicio de mapas en
// lugar de incrustarlo: la página no carga terceros que el visitante no pidió.
export function MapaDeSede({ sede, textoDelBoton, retraso }: PropsMapaDeSede) {
  return (
    <div {...propsDeRevelado({ retraso, clase: estilos.mapa })}>
      <div>
        <Icono nombre="pin" />
        <p>
          {sede.nombre}
          <br />
          {sede.direccion}
        </p>
        {sede.enlaceDeMapa && textoDelBoton ? (
          <a
            className="boton boton-contacto"
            href={sede.enlaceDeMapa}
            target="_blank"
            rel="noopener"
          >
            {textoDelBoton}
            <span className="oculto"> de la {sede.nombre} (se abre en una pestaña nueva)</span>
          </a>
        ) : null}
      </div>
    </div>
  )
}
