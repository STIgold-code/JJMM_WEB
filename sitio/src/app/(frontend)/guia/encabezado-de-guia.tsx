import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'

import estilos from './guia.module.css'

interface PropsEncabezadoDeGuia {
  titulo: string
  introduccion: string | null
}

// Banda de título de la guía, con la entrada lateral de la v4.
export function EncabezadoDeGuia({ titulo, introduccion }: PropsEncabezadoDeGuia) {
  return (
    <header className={`${estilos.encabezado} oscuro`}>
      <div className="contenedor">
        <h1 {...propsDeRevelado({ desde: 'izquierda', clase: estilos.titulo })}>{titulo}</h1>
        {introduccion ? (
          <p {...propsDeRevelado({ desde: 'derecha', retraso: 0.2, clase: estilos.introduccion })}>
            {introduccion}
          </p>
        ) : null}
      </div>
    </header>
  )
}
