import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import type { Sede } from '@/payload-types'

import type { RepositorioSedes } from '../aplicacion/repositorio-sedes'
import type { SedeGuardada } from '../dominio/sede'

// Límite holgado: el estudio tiene pocas sedes y el pie las muestra todas.
const MAXIMO_DE_SEDES = 20

export function mapearSede(sede: Sede): SedeGuardada {
  return {
    nombre: sede.nombre,
    direccion: sede.direccion,
    distrito: sede.distrito,
    ciudad: sede.ciudad,
    celulares: (sede.celulares ?? []).map((celular) => celular.numero),
    correo: sede.correo || null,
  }
}

// Solo sedes activas, en el orden del panel y con los permisos del público.
export const repositorioSedesPayload: RepositorioSedes = {
  async listarActivas() {
    const payload = await obtenerPayload()
    const { docs } = await payload.find({
      collection: 'sedes',
      where: { activo: { equals: true } },
      sort: 'orden',
      depth: 0,
      limit: MAXIMO_DE_SEDES,
      pagination: false,
      overrideAccess: false,
    })
    return docs.map(mapearSede)
  },
}
