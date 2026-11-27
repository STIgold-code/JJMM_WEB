import { obtenerSedesDelSitio } from '@/modulos/sedes/componentes/obtener-sedes-del-sitio'

import { obtenerDatosDelSitio } from '../datos-del-sitio'
import { Pie } from './pie'

function textoLegal(razonSocial: string, grupo: string | null, anio: number): string {
  return [`© ${anio} ${razonSocial}`, grupo].filter(Boolean).join(' · ')
}

export async function PieContenedor() {
  const [datos, sedes] = await Promise.all([obtenerDatosDelSitio(), obtenerSedesDelSitio()])
  if (!datos) return null
  const { marca } = datos
  return (
    <Pie
      sedes={sedes}
      logo={marca.logo}
      lema={marca.lema}
      legal={textoLegal(marca.razonSocial, marca.grupo, new Date().getFullYear())}
    />
  )
}
