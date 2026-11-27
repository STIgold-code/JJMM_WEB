'use client'

import { type KeyboardEvent, useId, useRef, useState } from 'react'

import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'
import type { Imagen } from '@/compartido/dominio/imagen'
import type { SedeDeContacto } from '@/modulos/sedes/dominio/sede-de-contacto'

import estilos from './contacto.module.css'
import { PanelDeSede, type TextosDeSede } from './panel-de-sede'
import { sedePorTecla } from './sede-por-tecla'

interface PropsPestanasDeSedes {
  sedes: readonly SedeDeContacto[]
  textos: TextosDeSede
  foto: Imagen | null
  // Nombre de la lista de pestañas para lectores de pantalla.
  etiqueta: string
}

const idDePestana = (prefijo: string, indice: number) => `${prefijo}-sede-${indice}`
const idDePanel = (prefijo: string, indice: number) => `${prefijo}-panel-${indice}`

// Pestaña activa; al moverse con flechas, la nueva pestaña se activa y recibe el foco.
function usePestanaDeSede(total: number) {
  const [activa, setActiva] = useState(0)
  const botones = useRef<(HTMLButtonElement | null)[]>([])
  const alPresionar = (evento: KeyboardEvent, indice: number) => {
    const destino = sedePorTecla(indice, evento.key, total)
    if (destino === null) return
    evento.preventDefault()
    setActiva(destino)
    botones.current[destino]?.focus()
  }
  const registrar = (indice: number) => (boton: HTMLButtonElement | null) => {
    botones.current[indice] = boton
  }
  return { activa, elegir: setActiva, alPresionar, registrar }
}

// Isla de cliente de «Contáctanos» (v5): una pestaña por sede activa y su panel.
export function PestanasDeSedes({ sedes, textos, foto, etiqueta }: PropsPestanasDeSedes) {
  const prefijo = useId()
  const { activa, elegir, alPresionar, registrar } = usePestanaDeSede(sedes.length)
  if (sedes.length === 0) return null
  return (
    <div {...propsDeRevelado({ clase: estilos.sedes })}>
      <div className={estilos.pestanas} role="tablist" aria-label={etiqueta}>
        {sedes.map((sede, indice) => (
          <button
            key={sede.nombre}
            ref={registrar(indice)}
            type="button"
            role="tab"
            id={idDePestana(prefijo, indice)}
            aria-controls={idDePanel(prefijo, indice)}
            aria-selected={indice === activa}
            tabIndex={indice === activa ? 0 : -1}
            onClick={() => elegir(indice)}
            onKeyDown={(evento) => alPresionar(evento, indice)}
          >
            {sede.pestana}
          </button>
        ))}
      </div>
      {sedes.map((sede, indice) => (
        <div
          key={sede.nombre}
          role="tabpanel"
          id={idDePanel(prefijo, indice)}
          aria-labelledby={idDePestana(prefijo, indice)}
          hidden={indice !== activa}
          className={estilos.sede}
        >
          <PanelDeSede sede={sede} textos={textos} foto={foto} />
        </div>
      ))}
    </div>
  )
}
