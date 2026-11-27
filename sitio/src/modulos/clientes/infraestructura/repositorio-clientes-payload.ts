import { etiquetaDeColeccion } from '@/compartido/dominio/etiquetas-de-cache'
import { aImagen } from '@/compartido/infraestructura/imagen-de-medio'
import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import { leerEnCache } from '@/compartido/infraestructura/lectura-en-cache'
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

// Profundidad 1 para poblar los logotipos: depende también de `medios`.
export const repositorioClientesPayload: RepositorioClientes = {
  listarVisibles: leerEnCache(
    'clientes.listarVisibles',
    [etiquetaDeColeccion('clientes'), etiquetaDeColeccion('medios')],
    async () => {
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
  ),
}
