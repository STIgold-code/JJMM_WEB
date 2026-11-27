import { obtenerMenuDelSitio } from '@/modulos/navegacion/componentes/obtener-menu-del-sitio'

import { obtenerDatosDelSitio } from '../datos-del-sitio'
import { CabeceraInteractiva } from './cabecera-interactiva'
import { Marca, Sello } from './marca-y-sello'

// Une la configuración (marca, sello y WhatsApp) con el menú del panel. Sin configuración
// guardada no hay marca que mostrar y la cabecera no se dibuja.
export async function CabeceraContenedor() {
  const [datos, items] = await Promise.all([obtenerDatosDelSitio(), obtenerMenuDelSitio()])
  if (!datos) return null
  const { marca, canales } = datos
  return (
    <CabeceraInteractiva
      marca={<Marca logo={marca.logo} nombreComercial={marca.nombreComercial} />}
      sello={<Sello sello={marca.sello} />}
      items={items}
      whatsapp={canales.whatsapp}
      textoDeWhatsApp={`${canales.textoDelBotonFlotante} por WhatsApp`}
    />
  )
}
