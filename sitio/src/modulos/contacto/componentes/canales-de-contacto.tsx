import { Icono, type NombreDeIcono } from '@/compartido/componentes/iconos/icono'
import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'
import type { EnlaceDeContacto } from '@/compartido/dominio/enlaces-de-contacto'

import estilos from './contacto.module.css'

export interface CanalVisible {
  titulo: string | null
  enlace: EnlaceDeContacto
  icono: NombreDeIcono
  destacado: boolean
}

// Tarjetas escalonadas cada 0,08 s, como la v4.
const RETRASO_POR_CANAL = 0.08

// WhatsApp, llamada y correo de la configuración del sitio, con los títulos del bloque.
export function CanalesDeContacto({ canales }: { canales: readonly CanalVisible[] }) {
  return canales.map((canal, indice) => (
    <a
      key={canal.enlace.href}
      href={canal.enlace.href}
      {...propsDeRevelado({
        retraso: RETRASO_POR_CANAL * indice,
        clase: `${estilos.canal} ${canal.destacado ? estilos.whatsapp : ''}`,
      })}
    >
      <span className={estilos.icono}>
        <Icono nombre={canal.icono} />
      </span>
      <span>
        {canal.titulo ? <strong>{canal.titulo}</strong> : null}
        <span>{canal.enlace.texto}</span>
      </span>
    </a>
  ))
}
