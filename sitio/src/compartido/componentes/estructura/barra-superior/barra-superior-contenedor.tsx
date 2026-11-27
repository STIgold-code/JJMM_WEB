import { obtenerDatosDelSitio } from '../datos-del-sitio'
import { BarraSuperior } from './barra-superior'

// Sin configuración guardada no hay datos de contacto que mostrar: no se dibuja.
export async function BarraSuperiorContenedor() {
  const datos = await obtenerDatosDelSitio()
  if (!datos) return null
  const { canales, redes } = datos
  return (
    <BarraSuperior
      redes={redes}
      whatsapp={canales.whatsapp}
      llamadas={canales.llamadas}
      correo={canales.correo}
    />
  )
}
