import { aImagen } from '@/compartido/infraestructura/imagen-de-medio'
import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import type { Cliente } from '@/payload-types'

import type { ClienteVisible, RepositorioClientes } from '../aplicacion/listar-clientes'

// Límite holgado: once logotipos en la v4.
const MAXIMO_DE_CLIENTES = 60

// Un cliente sin logotipo publicable no se muestra: el carrusel es de logotipos.
export function mapearCliente(cliente: Cliente): ClienteVisible | null {
  const logo = aImagen(cliente.logo)
  if (!logo) return null
  return { nombre: cliente.nombre, logo, enlace: cliente.enlace || null }
}

export const repositorioClientesPayload: RepositorioClientes = {
  async listarVisibles() {
    const payload = await obtenerPayload()
    const { docs } = await payload.find({
      collection: 'clientes',
      where: { activo: { equals: true } },
      sort: 'orden',
      depth: 1,
      limit: MAXIMO_DE_CLIENTES,
      pagination: false,
      overrideAccess: false,
    })
    return docs.map(mapearCliente).filter((cliente) => cliente !== null)
  },
}
