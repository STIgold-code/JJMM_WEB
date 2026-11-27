import Image from 'next/image'

import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'
import type { Imagen } from '@/compartido/dominio/imagen'
import { DireccionDeSede } from '@/modulos/sedes/componentes/direccion-de-sede'
import type { SedePublica } from '@/modulos/sedes/dominio/sede'

import estilos from './pie.module.css'

interface PropsPie {
  sedes: readonly SedePublica[]
  logo: Imagen | null
  lema: string | null
  // Texto legal ya armado, por ejemplo «© 2026 Estudio Contable JJMM S.A.C. · Grupo JJMM».
  legal: string
}

function Sedes({ sedes }: { sedes: readonly SedePublica[] }) {
  return (
    <div className={estilos.sedes}>
      {sedes.map((sede) => (
        <DireccionDeSede key={sede.nombre} sede={sede} claseDelTitulo={estilos.titulo} />
      ))}
    </div>
  )
}

// Pie oscuro: sedes a los lados y el logo sobre una placa blanca al centro (v4).
export function Pie({ sedes, logo, lema, legal }: PropsPie) {
  const mitad = Math.ceil(sedes.length / 2)
  return (
    <footer className={`${estilos.pie} oscuro`}>
      <div {...propsDeRevelado({ clase: 'contenedor' })}>
        <div className={estilos.rejilla}>
          <Sedes sedes={sedes.slice(0, mitad)} />
          <div className={estilos.logo}>
            {logo ? (
              <Image src={logo.url} alt={logo.alt} width={logo.ancho} height={logo.alto} />
            ) : null}
            {lema ? <p>{lema}</p> : null}
          </div>
          <Sedes sedes={sedes.slice(mitad)} />
        </div>
        <p className={estilos.legal}>{legal}</p>
      </div>
    </footer>
  )
}
