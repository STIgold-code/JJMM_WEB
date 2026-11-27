import { Icono } from '@/compartido/componentes/iconos/icono'

import type { CeldaDePlan, FilaDePlanes } from '../dominio/matriz-de-planes'
import estilos from './planes.module.css'

export interface PlanDeLaTabla {
  nombre: string
  // Enlace de WhatsApp para solicitar el plan; null sin configuración del sitio.
  enlace: string | null
}

// Clase de la columna de un plan: oculta en el celular si no es el elegido y resaltada si
// el cursor está sobre ella.
export type ClaseDeColumna = (indice: number) => string | undefined

function Celda({ celda }: { celda: CeldaDePlan }) {
  if (celda.tipo === 'texto') return <>{celda.texto}</>
  const incluido = celda.tipo === 'incluido'
  return (
    <span className={incluido ? estilos.si : estilos.no}>
      <Icono nombre={incluido ? 'incluido' : 'no-incluido'} />
      <span className="oculto">{incluido ? 'Incluido' : 'No incluido'}</span>
    </span>
  )
}

interface PropsEncabezado {
  encabezado: string
  planes: readonly PlanDeLaTabla[]
  claseDe: ClaseDeColumna
}

export function EncabezadoDeLaTabla({ encabezado, planes, claseDe }: PropsEncabezado) {
  return (
    <thead>
      <tr>
        <th scope="col">{encabezado}</th>
        {planes.map((plan, indice) => (
          <th key={plan.nombre} scope="col" className={claseDe(indice)}>
            {plan.nombre}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export function CuerpoDeLaTabla({
  filas,
  claseDe,
}: {
  filas: readonly FilaDePlanes[]
  claseDe: ClaseDeColumna
}) {
  return (
    <tbody>
      {filas.map((fila) => (
        <tr key={fila.caracteristica}>
          <th scope="row">{fila.caracteristica}</th>
          {fila.celdas.map((celda, indice) => (
            <td key={indice} className={claseDe(indice)}>
              <Celda celda={celda} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

interface PropsPie {
  planes: readonly PlanDeLaTabla[]
  textoDelBoton: string
  claseDe: ClaseDeColumna
}

export function PieDeLaTabla({ planes, textoDelBoton, claseDe }: PropsPie) {
  if (planes.every((plan) => plan.enlace === null)) return null
  return (
    <tfoot>
      <tr>
        <td />
        {planes.map((plan, indice) => (
          <td key={plan.nombre} className={claseDe(indice)}>
            {plan.enlace ? (
              <a className="boton boton-contacto" href={plan.enlace}>
                {textoDelBoton}
                <span className="oculto"> el plan {plan.nombre}</span>
              </a>
            ) : null}
          </td>
        ))}
      </tr>
    </tfoot>
  )
}
