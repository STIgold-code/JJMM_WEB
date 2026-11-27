import { Icono } from '@/compartido/componentes/iconos/icono'
import type { Imagen } from '@/compartido/dominio/imagen'
import type { SedeDeContacto } from '@/modulos/sedes/dominio/sede-de-contacto'

import estilos from './contacto.module.css'
import { MapaDeSede } from './mapa-de-sede'

export interface TextosDeSede {
  comoLlegar: string | null
  verMapa: string | null
}

interface PropsPanelDeSede {
  sede: SedeDeContacto
  textos: TextosDeSede
  foto: Imagen | null
}

// WhatsApp (destacado), llamada y «Cómo llegar», como la v5. Sin dato, no hay botón.
function AccionesDeSede({ sede, textos }: Omit<PropsPanelDeSede, 'foto'>) {
  return (
    <div className={estilos.acciones}>
      {sede.whatsapp ? (
        <a className={estilos.whatsapp} href={sede.whatsapp.href}>
          <Icono nombre="whatsapp" />
          {sede.whatsapp.texto}
        </a>
      ) : null}
      {sede.llamada ? (
        <a href={sede.llamada.href}>
          <Icono nombre="telefono" />
          {sede.llamada.texto}
        </a>
      ) : null}
      {textos.comoLlegar ? (
        <a href={sede.comoLlegar} target="_blank" rel="noopener">
          <Icono nombre="ruta" />
          {textos.comoLlegar}
          <span className="oculto"> a la {sede.nombre} (se abre en una pestaña nueva)</span>
        </a>
      ) : null}
    </div>
  )
}

// Contenido de la pestaña de una sede: nombre, dirección, botones y mapa.
export function PanelDeSede({ sede, textos, foto }: PropsPanelDeSede) {
  return (
    <>
      <address>
        <strong>{sede.nombre}</strong>
        {sede.direccion}
      </address>
      <AccionesDeSede sede={sede} textos={textos} />
      <MapaDeSede
        nombre={sede.nombre}
        mapa={sede.mapa}
        textoDelBoton={textos.verMapa}
        foto={foto}
      />
    </>
  )
}
