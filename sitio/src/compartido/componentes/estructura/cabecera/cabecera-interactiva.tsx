'use client'

import { type ReactNode, type RefObject, useCallback, useRef, useState } from 'react'

import { Icono } from '@/compartido/componentes/iconos/icono'
import type { EnlaceDeContacto } from '@/compartido/dominio/enlaces-de-contacto'
import { MenuDeEscritorio } from '@/modulos/navegacion/componentes/menu-de-escritorio'
import { PanelMenu } from '@/modulos/navegacion/componentes/panel-menu'
import { useEstadoActual } from '@/modulos/navegacion/componentes/use-estado-actual'
import type { ItemDeMenu } from '@/modulos/navegacion/dominio/item-de-menu'

import { useDesplazado } from '../use-desplazado'
import estilos from './cabecera.module.css'

const ID_DEL_PANEL = 'panel-menu'
// Píxeles de desplazamiento a partir de los cuales la cabecera se compacta (v4).
const UMBRAL_COMPACTA = 60

interface PropsCabeceraInteractiva {
  marca: ReactNode
  sello: ReactNode
  items: readonly ItemDeMenu[]
  whatsapp: EnlaceDeContacto | null
  textoDeWhatsApp: string
}

interface PropsBotonMenu {
  referencia: RefObject<HTMLButtonElement | null>
  abierto: boolean
  alAbrir: () => void
}

function BotonMenu({ referencia, abierto, alAbrir }: PropsBotonMenu) {
  return (
    <button
      ref={referencia}
      className={estilos.botonMenu}
      type="button"
      aria-expanded={abierto}
      aria-controls={ID_DEL_PANEL}
      onClick={alAbrir}
    >
      <Icono nombre="menu" />
      <span className="oculto">Abrir menú</span>
    </button>
  )
}

// Isla de cliente de la cabecera: compactarse al bajar, marcar la sección visible y abrir
// el panel del celular. La marca y el sello llegan ya dibujados desde el servidor.
export function CabeceraInteractiva(props: PropsCabeceraInteractiva) {
  const { marca, sello, items, whatsapp, textoDeWhatsApp } = props
  const [abierto, setAbierto] = useState(false)
  const botonMenu = useRef<HTMLButtonElement>(null)
  const compacta = useDesplazado(UMBRAL_COMPACTA)
  const actualDe = useEstadoActual(items)
  const cerrar = useCallback(() => {
    setAbierto(false)
    botonMenu.current?.focus({ preventScroll: true })
  }, [])

  return (
    <>
      <header className={`${estilos.cabecera} ${compacta ? estilos.compacta : ''}`}>
        <div className={`contenedor ${estilos.fila}`}>
          {marca}
          <MenuDeEscritorio items={items} actualDe={actualDe} />
          {sello}
          <BotonMenu referencia={botonMenu} abierto={abierto} alAbrir={() => setAbierto(true)} />
        </div>
      </header>
      <PanelMenu
        id={ID_DEL_PANEL}
        abierto={abierto}
        alCerrar={cerrar}
        items={items}
        actualDe={actualDe}
        whatsapp={whatsapp}
        textoDeWhatsApp={textoDeWhatsApp}
      />
    </>
  )
}
