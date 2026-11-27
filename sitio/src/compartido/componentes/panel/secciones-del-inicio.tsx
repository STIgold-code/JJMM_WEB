import Link from 'next/link'

import type { EntradaDeSeccion, SeccionDelInicio } from './modelo-del-inicio'
import { TrazoDelPanel } from './trazos-del-panel'
import estilos from './secciones-del-inicio.module.css'

interface Props {
  secciones: readonly SeccionDelInicio[]
}

function FilaDeSeccion({ etiqueta, descripcion, href, icono, cantidad }: EntradaDeSeccion) {
  return (
    <li>
      <Link href={href} className={estilos.fila} prefetch={false}>
        <span className={estilos.marco}>
          <TrazoDelPanel nombre={icono} />
        </span>
        <span className={estilos.textos}>
          <span className={estilos.nombre}>{etiqueta}</span>
          {descripcion ? <span className={estilos.descripcion}>{descripcion}</span> : null}
        </span>
        {cantidad === null ? null : (
          <span className={estilos.cantidad}>
            {cantidad}
            <span className="sr-only"> en total</span>
          </span>
        )}
        <TrazoDelPanel nombre="siguiente" className={estilos.flecha} />
      </Link>
    </li>
  )
}

// Todo lo que la cuenta puede editar, agrupado como en el menú lateral.
export function SeccionesDelInicio({ secciones }: Props) {
  return (
    <section aria-labelledby="secciones-del-inicio">
      <h2 id="secciones-del-inicio" className={estilos.titulo}>
        Todo el contenido
      </h2>
      <div className={estilos.secciones}>
        {secciones.map(({ grupo, entradas }) => (
          <section key={grupo} className={estilos.seccion} aria-label={grupo}>
            <h3 className={estilos.grupo}>{grupo}</h3>
            <ul className={estilos.filas}>
              {entradas.map((entrada) => (
                <FilaDeSeccion key={entrada.clave} {...entrada} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}
