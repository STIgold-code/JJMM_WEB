'use client'

import { type ReactNode, useId } from 'react'

import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'

import estilos from './servicios.module.css'
import { type EstadoDePestanas, usePestanas } from './use-pestanas'

export interface PestanaDeArea {
  codigo: string
  nombreCorto: string
  // Puntos del gajo en la rueda (coordenadas de 500 × 550), o null si no tiene.
  gajo: string | null
  panel: ReactNode
}

interface PropsPestanasDeServicios {
  areas: readonly PestanaDeArea[]
  rueda: ReactNode
  etiqueta: string
}

interface PropsDePartes {
  areas: readonly PestanaDeArea[]
  estado: EstadoDePestanas
  prefijo: string
}

const idDePestana = (prefijo: string, indice: number) => `${prefijo}-pestana-${indice}`
const idDePanel = (prefijo: string, indice: number) => `${prefijo}-panel-${indice}`

// Los gajos son un atajo para el mouse; el teclado usa las pestañas, por eso van ocultos.
function Gajos({ areas, estado }: Omit<PropsDePartes, 'prefijo'>) {
  return (
    <svg viewBox="0 0 500 550" aria-hidden="true" focusable="false">
      {areas.map(({ codigo, gajo }, indice) =>
        gajo ? (
          <polygon
            key={codigo}
            points={gajo}
            className={indice === estado.activa ? estilos.activo : undefined}
            onClick={() => estado.elegir(indice)}
          />
        ) : null,
      )}
    </svg>
  )
}

function Pestanas({ areas, estado, prefijo }: PropsDePartes) {
  return areas.map(({ codigo, nombreCorto }, indice) => (
    <button
      key={codigo}
      ref={estado.registrar(indice)}
      type="button"
      role="tab"
      id={idDePestana(prefijo, indice)}
      aria-controls={idDePanel(prefijo, indice)}
      aria-selected={indice === estado.activa}
      tabIndex={indice === estado.activa ? 0 : -1}
      onClick={() => estado.elegir(indice)}
      onKeyDown={(evento) => estado.alPresionar(evento, indice)}
    >
      <b>{codigo}</b>
      <span>{nombreCorto}</span>
    </button>
  ))
}

function Paneles({ areas, estado, prefijo }: PropsDePartes) {
  return areas.map(({ codigo, panel }, indice) => {
    const activo = indice === estado.activa
    return (
      <div
        key={codigo}
        role="tabpanel"
        id={idDePanel(prefijo, indice)}
        aria-labelledby={idDePestana(prefijo, indice)}
        tabIndex={0}
        hidden={!activo}
        className={`${estilos.panel} ${estado.cambiada && activo ? estilos.entra : ''}`}
      >
        {panel}
      </div>
    )
  })
}

// Isla de cliente de «Servicios»: pestañas accesibles sincronizadas con los gajos de la rueda.
export function PestanasDeServicios({ areas, rueda, etiqueta }: PropsPestanasDeServicios) {
  const prefijo = useId()
  const estado = usePestanas(areas.length)
  const partes = { areas, estado, prefijo }
  return (
    <div className={estilos.rejilla}>
      <div {...propsDeRevelado({ desde: 'izquierda' })}>
        <div className={estilos.rueda}>
          {rueda}
          <Gajos areas={areas} estado={estado} />
        </div>
      </div>
      <div {...propsDeRevelado({ desde: 'derecha', retraso: 0.1 })}>
        <div className={estilos.pestanas} role="tablist" aria-label={etiqueta}>
          <Pestanas {...partes} />
        </div>
        <div className={estilos.paneles}>
          <Paneles {...partes} />
        </div>
      </div>
    </div>
  )
}
