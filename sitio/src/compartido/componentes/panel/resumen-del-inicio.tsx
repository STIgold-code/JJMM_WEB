import Link from 'next/link'

import type { Cifra } from './modelo-del-inicio'
import { TrazoDelPanel } from './trazos-del-panel'
import estilos from './resumen-del-inicio.module.css'

interface Props {
  cifras: readonly Cifra[]
}

// Resumen con cifras reales; cada una lleva a la lista que la explica.
export function ResumenDelInicio({ cifras }: Props) {
  return (
    <section aria-labelledby="resumen-del-inicio">
      <h2 id="resumen-del-inicio" className={estilos.titulo}>
        Hoy en el sitio
      </h2>
      <ul className={estilos.cifras}>
        {cifras.map(({ clave, valor, etiqueta, detalle, href, icono, destacada }) => (
          <li key={clave}>
            <Link
              href={href}
              className={`${estilos.cifra} ${destacada ? estilos.destacada : ''}`}
              prefetch={false}
            >
              <TrazoDelPanel nombre={icono} className={estilos.icono} />
              <span className={estilos.valor}>{valor}</span>
              <span className={estilos.etiqueta}>{etiqueta}</span>
              <span className={estilos.detalle}>{detalle}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
