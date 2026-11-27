import Link from 'next/link'

import type { EnlaceRapido } from './enlace-rapido'
import { TrazoDelPanel } from './trazos-del-panel'
import estilos from './accesos-rapidos.module.css'

interface Props {
  accesos: readonly EnlaceRapido[]
}

// Lo que más se hace, a un clic.
export function AccesosRapidos({ accesos }: Props) {
  return (
    <section aria-labelledby="accesos-rapidos">
      <h2 id="accesos-rapidos" className={estilos.titulo}>
        Accesos rápidos
      </h2>
      <ul className={estilos.accesos}>
        {accesos.map(({ clave, etiqueta, href, icono }) => (
          <li key={clave}>
            <Link href={href} className={estilos.acceso} prefetch={false}>
              <span className={estilos.marco}>
                <TrazoDelPanel nombre={icono} />
              </span>
              {etiqueta}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
