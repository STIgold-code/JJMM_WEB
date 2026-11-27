import { obtenerDatosDelSitio } from '../datos-del-sitio'
import { BotonWhatsApp } from './boton-whatsapp'

export async function BotonWhatsAppContenedor() {
  const datos = await obtenerDatosDelSitio()
  if (!datos) return null
  const { whatsapp, textoDelBotonFlotante } = datos.canales
  return <BotonWhatsApp href={whatsapp.href} texto={textoDelBotonFlotante} />
}
