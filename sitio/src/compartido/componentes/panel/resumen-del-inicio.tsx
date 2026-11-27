import Link from 'next/link'

import type { Pendiente } from './modelo-del-inicio'
import { TrazoDelPanel } from './trazos-del-panel'
import estilos from './resumen-del-inicio.module.css'

interface Props {
  pendientes: readonly Pendiente[]
}

function FilaDePendiente({ pendiente }: { pendiente: Pendiente }) {
  const { texto, accion, href, icono, urgente } = pendiente
  return (
    <li>
      <Link
        href={href}
        className={`${estilos.fila} ${urgente ? estilos.urgente : ''}`}
        prefetch={false}
      >
        <span className={estilos.marco}>
          <TrazoDelPanel nombre={icono} />
        </span>
        <span className={estilos.texto}>{texto}</span>
        <span className={estilos.accion}>
          {accion}
          <TrazoDelPanel nombre="siguiente" className={estilos.flecha} />
        </span>
      </Link>
    </li>
  )
}

// Lo que pide acción hoy. Sin pendientes, una sola oración: no hace falta una caja por cada cero.
export function PendientesDelInicio({ pendientes }: Props) {
  return (
    <section aria-labelledby="pendientes-del-inicio">
      <h2 id="pendientes-del-inicio" className={estilos.titulo}>
        Pendientes
      </h2>
      {pendientes.length > 0 ? (
        <ul className={estilos.filas}>
          {pendientes.map((pendiente) => (
            <FilaDePendiente key={pendiente.clave} pendiente={pendiente} />
          ))}
        </ul>
      ) : (
        <p className={estilos.alDia}>
          <TrazoDelPanel nombre="hecho" className={estilos.hecho} />
          Todo al día: no hay mensajes por responder ni borradores sin publicar.
        </p>
      )}
    </section>
  )
}
