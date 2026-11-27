import { etiquetaDeColeccion } from '@/compartido/dominio/etiquetas-de-cache'
import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import { leerEnCache } from '@/compartido/infraestructura/lectura-en-cache'
import type { Sede } from '@/payload-types'

import type { RepositorioSedes, RepositorioSedesDeContacto } from '../aplicacion/repositorio-sedes'
import type { SedeGuardada } from '../dominio/sede'
import { mapearSedeDeContacto } from './mapear-sede-de-contacto'

// Límite holgado: el estudio tiene pocas sedes y el pie las muestra todas.
const MAXIMO_DE_SEDES = 20

async function buscarActivas(): Promise<Sede[]> {
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
  return docs
}

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
  listarActivas: leerEnCache('sedes.listarActivas', [etiquetaDeColeccion('sedes')], async () =>
    (await buscarActivas()).map(mapearSede),
  ),
}

export const repositorioSedesDeContactoPayload: RepositorioSedesDeContacto = {
  listarParaContacto: leerEnCache(
    'sedes.listarParaContacto',
    [etiquetaDeColeccion('sedes')],
    async () => (await buscarActivas()).map(mapearSedeDeContacto),
  ),
}
