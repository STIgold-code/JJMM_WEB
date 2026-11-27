import {
  CLASE_DE_SECCION,
  EncabezadoDeSeccion,
} from '@/compartido/componentes/bloques/encabezado-de-seccion'
import { Icono } from '@/compartido/componentes/iconos/icono'
import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'

import type { Valor } from '../dominio/valor'
import estilos from './por-que-elegirnos.module.css'

interface PropsPorQueElegirnos {
  ancla: string | null
  idDelTitulo: string
  titulo: string
  bajada: string | null
  valores: readonly Valor[]
}

// Tarjetas escalonadas cada 0,08 s, como la v4.
const RETRASO_POR_VALOR = 0.08

export function PorQueElegirnos(props: PropsPorQueElegirnos) {
  const { ancla, idDelTitulo, titulo, bajada, valores } = props
  return (
    <section
      className={`${CLASE_DE_SECCION} ${estilos.elegirnos} oscuro`}
      id={ancla ?? undefined}
      aria-labelledby={idDelTitulo}
    >
      <div className="contenedor">
        <EncabezadoDeSeccion id={idDelTitulo} titulo={titulo} bajada={bajada} />
        <ul className={estilos.valores}>
          {valores.map((valor, indice) => (
            <li key={valor.nombre} {...propsDeRevelado({ retraso: RETRASO_POR_VALOR * indice })}>
              <span className={estilos.icono}>
                <Icono nombre={valor.icono} />
              </span>
              <span className={estilos.nombre}>{valor.nombre}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
