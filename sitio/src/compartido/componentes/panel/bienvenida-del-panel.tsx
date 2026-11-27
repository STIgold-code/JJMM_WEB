import Link from 'next/link'

import { type EnlaceRapido, saludo, textoDeMensajesNuevos } from './enlace-rapido'
import estilos from './bienvenida-del-panel.module.css'

interface Props {
  nombre: string | null | undefined
  enlaces: readonly EnlaceRapido[]
  mensajesNuevos: number
}

// Encabezado del inicio del panel: saludo, accesos directos y enlace al sitio público.
export function BienvenidaDelPanel({ nombre, enlaces, mensajesNuevos }: Props) {
  const pendientes = textoDeMensajesNuevos(mensajesNuevos)
  return (
    <section className={estilos.bienvenida} aria-labelledby="bienvenida-del-panel">
      <h2 id="bienvenida-del-panel" className={estilos.saludo}>
        {saludo(nombre)} ¿Qué quieres actualizar hoy?
      </h2>
      <ul className={estilos.enlaces}>
        {enlaces.map(({ clave, etiqueta, href }) => (
          <li key={clave}>
            <Link className={estilos.enlace} href={href}>
              {etiqueta}
              {clave === 'mensajes' && pendientes ? (
                <span className={estilos.contador}>{pendientes}</span>
              ) : null}
            </Link>
          </li>
        ))}
        <li>
          <a className={estilos.enlace} href="/" target="_blank" rel="noopener">
            Ver el sitio
            <span className={estilos.nota}>(se abre en otra pestaña)</span>
          </a>
        </li>
      </ul>
    </section>
  )
}
