import { DatosEstructurados } from '@/compartido/componentes/datos-estructurados'
import { obtenerDatosDelSitio } from '@/compartido/componentes/estructura/datos-del-sitio'
import { datosEstructuradosDelEstudio } from '@/compartido/dominio/datos-estructurados-del-estudio'
import { urlDelSitio } from '@/compartido/infraestructura/url-del-sitio-configurada'
import { obtenerSedesDelSitio } from '@/modulos/sedes/componentes/obtener-sedes-del-sitio'

import { datosDelEstudio } from './datos-del-estudio'

// Contenedor: el estudio como AccountingService (schema.org) con la configuración y las sedes
// del panel. Sin configuración guardada no publica nada.
export async function DatosEstructuradosDelEstudio() {
  const [sitio, sedes] = await Promise.all([obtenerDatosDelSitio(), obtenerSedesDelSitio()])
  if (!sitio) return null
  const datos = datosEstructuradosDelEstudio(urlDelSitio(), datosDelEstudio(sitio, sedes))
  return <DatosEstructurados datos={datos} />
}
