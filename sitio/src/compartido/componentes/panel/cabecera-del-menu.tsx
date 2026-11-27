import Image from 'next/image'
import Link from 'next/link'

import { TrazoDelPanel } from './trazos-del-panel'
import estilos from './cabecera-del-menu.module.css'

interface Props {
  hrefDelInicio: string
  enElInicio: boolean
}

// Marca del estudio arriba del menú lateral y enlace «Inicio». El enlace usa las clases de los
// enlaces del menú de Payload (`nav__link`) para verse igual que ellos.
export function CabeceraDelMenu({ hrefDelInicio, enElInicio }: Props) {
  return (
    <div className={estilos.cabecera}>
      <Link href={hrefDelInicio} className={estilos.marca}>
        <Image
          className={estilos.ovalo}
          src="/panel/marca-jjmm.png"
          alt=""
          width={217}
          height={84}
          unoptimized
        />
        <span className={estilos.nombre}>
          Estudio Contable JJMM
          <span className={estilos.subtitulo}>Panel del sitio web</span>
        </span>
      </Link>
      <Link
        href={hrefDelInicio}
        className={`nav__link ${estilos.inicio}`}
        aria-current={enElInicio ? 'page' : undefined}
        prefetch={false}
      >
        {enElInicio ? <span className="nav__link-indicator" /> : null}
        <TrazoDelPanel nombre="inicio" className={estilos.icono} />
        <span className="nav__link-label">Inicio</span>
      </Link>
    </div>
  )
}
