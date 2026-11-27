import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'

import type { RepositorioValores } from '../aplicacion/listar-valores'

// Límite holgado: la sección muestra una rejilla corta (seis en la v4).
const MAXIMO_DE_VALORES = 24

export const repositorioValoresPayload: RepositorioValores = {
  async listar() {
    const payload = await obtenerPayload()
    const { docs } = await payload.find({
      collection: 'valores',
      sort: 'orden',
      depth: 0,
      limit: MAXIMO_DE_VALORES,
      pagination: false,
      overrideAccess: false,
    })
    return docs.map(({ nombre, icono }) => ({ nombre, icono }))
  },
}
