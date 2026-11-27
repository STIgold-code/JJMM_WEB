'use client'

import { Icono } from '@/compartido/componentes/iconos/icono'
import type { EnlaceDeContacto } from '@/compartido/dominio/enlaces-de-contacto'

import type { EstadoActual } from '../dominio/item-actual'
import type { ItemDeMenu } from '../dominio/item-de-menu'
import { atraparFoco } from './atrapar-foco'
import { EnlaceDeMenu } from './enlace-de-menu'
import estilos from './panel-menu.module.css'
import { usePanelModal } from './use-panel-modal'

interface PropsPanelMenu {
  id: string
  abierto: boolean
  alCerrar: () => void
  items: readonly ItemDeMenu[]
  actualDe: (item: ItemDeMenu) => EstadoActual
  whatsapp: EnlaceDeContacto | null
  textoDeWhatsApp: string
}

// Menú del celular en un panel lateral modal. Cerrado queda `inert`: fuera del orden de
// tabulación y del árbol de accesibilidad. Abierto, el foco va al botón de cerrar y no sale.
export function PanelMenu(props: PropsPanelMenu) {
  const { id, abierto, alCerrar, items, actualDe, whatsapp, textoDeWhatsApp } = props
  const cerrar = usePanelModal(abierto, alCerrar)

  return (
    <div id={id} className={`${estilos.panel} ${abierto ? estilos.abierto : ''}`} inert={!abierto}>
      <div className={estilos.fondo} onClick={alCerrar} aria-hidden="true" />
      <div
        className={`${estilos.cuerpo} oscuro`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        onKeyDown={atraparFoco}
      >
        <button ref={cerrar} className={estilos.cerrar} type="button" onClick={alCerrar}>
          <Icono nombre="cerrar" />
          <span className="oculto">Cerrar menú</span>
        </button>
        <nav aria-label="Principal en el celular">
          {items.map((item) => (
            <EnlaceDeMenu
              key={`${item.etiqueta}-${item.href}`}
              item={item}
              actual={actualDe(item)}
              variante="panel"
              alElegir={alCerrar}
            />
          ))}
        </nav>
        {whatsapp ? (
          <a className="boton boton-contacto" href={whatsapp.href}>
            <Icono nombre="whatsapp" />
            {textoDeWhatsApp}
          </a>
        ) : null}
      </div>
    </div>
  )
}
