import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import type { Vencimiento as VencimientoPayload } from '@/payload-types'

import type { RepositorioVencimientos } from '../aplicacion/repositorio-vencimientos'
import type { Vencimiento } from '../dominio/vencimiento'

// Límite holgado: la guía publica unas pocas obligaciones.
const MAXIMO_DE_VENCIMIENTOS = 60

export function mapearVencimiento(vencimiento: VencimientoPayload): Vencimiento {
  return {
    obligacion: vencimiento.obligacion,
    periodicidad: vencimiento.periodicidad,
    cuandoVence: vencimiento.cuandoVence,
    nota: vencimiento.nota || null,
  }
}

// Todos los vencimientos en el orden del panel, con los permisos del público.
export const repositorioVencimientosPayload: RepositorioVencimientos = {
  async listar() {
    const payload = await obtenerPayload()
    const { docs } = await payload.find({
      collection: 'vencimientos',
      sort: 'orden',
      depth: 0,
      limit: MAXIMO_DE_VENCIMIENTOS,
      pagination: false,
      overrideAccess: false,
    })
    return docs.map(mapearVencimiento)
  },
}
