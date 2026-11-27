import type { EnlaceDeRed } from '@/compartido/dominio/configuracion-del-sitio'
import type { EnlaceDeContacto } from '@/compartido/dominio/enlaces-de-contacto'
import { Icono } from '@/compartido/componentes/iconos/icono'
import { PRESENTACION_DE_REDES } from '@/compartido/componentes/iconos/redes-sociales'

import estilos from './barra-superior.module.css'

interface PropsBarraSuperior {
  redes: readonly EnlaceDeRed[]
  whatsapp: EnlaceDeContacto
  llamadas: EnlaceDeContacto
  correo: EnlaceDeContacto
}

function Redes({ redes }: { redes: readonly EnlaceDeRed[] }) {
  if (redes.length === 0) return <span />
  return (
    <ul className={estilos.redes} aria-label="Redes sociales">
      {redes.map(({ red, url }) => (
        <li key={red}>
          <a href={url} rel="noopener">
            <Icono nombre={PRESENTACION_DE_REDES[red].icono} />
            <span className="oculto">{PRESENTACION_DE_REDES[red].nombre}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

// Franja oscura con redes y contacto rápido. En el celular solo queda WhatsApp.
export function BarraSuperior({ redes, whatsapp, llamadas, correo }: PropsBarraSuperior) {
  return (
    <div className={`${estilos.barra} oscuro`}>
      <div className={`contenedor ${estilos.fila}`}>
        <Redes redes={redes} />
        <div className={estilos.contacto}>
          <a className={estilos.soloAmplio} href={correo.href}>
            <Icono nombre="correo" />
            {correo.texto}
          </a>
          <a href={whatsapp.href}>
            <Icono nombre="whatsapp" />
            <span className="oculto">WhatsApp: </span>
            {whatsapp.texto}
          </a>
          <a className={estilos.soloAmplio} href={llamadas.href}>
            <Icono nombre="telefono" />
            <span className="oculto">Llamar al </span>
            {llamadas.texto}
          </a>
        </div>
      </div>
    </div>
  )
}
