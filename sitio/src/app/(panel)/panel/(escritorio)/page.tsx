import type { Metadata } from 'next'

import { obtenerInicio } from '@/panel/aplicacion/obtener-inicio'
import { InicioDelPanel } from '@/panel/componentes/inicio/inicio-del-panel'
import {
  fechaIsoEnLima,
  fechaLargaEnLima,
  horaEnLima,
  saludoSegunHora,
} from '@/panel/dominio/fechas-del-panel'
import { crearRepositorioDelInicio } from '@/panel/infraestructura/repositorio-del-inicio-payload'
import { exigirSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Inicio' }

// Inicio del panel: todos los números se leen con la Local API y los permisos de quien entra.
export default async function PaginaDeInicio() {
  const sesion = await exigirSesion()
  const datos = await obtenerInicio(crearRepositorioDelInicio(sesion))
  const ahora = new Date()
  return (
    <InicioDelPanel
      saludo={saludoSegunHora(horaEnLima(ahora))}
      fecha={fechaLargaEnLima(ahora)}
      fechaIso={fechaIsoEnLima(ahora)}
      ahora={ahora}
      datos={datos}
    />
  )
}
