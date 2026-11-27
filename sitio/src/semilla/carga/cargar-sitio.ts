import type { ConfiguracionSemilla, ItemDeMenuSemilla, SedeSemilla } from '../datos/tipos'
import { asegurar, type IdDeDocumento, type PuertoDeCarga } from '../puerto-de-carga'
import type { IdsDeMedios } from './cargar-medios'

export class SedeNoCargadaError extends Error {
  constructor(nombre: string) {
    super(`La semilla usa la sede «${nombre}», que no está en la lista de sedes.`)
    this.name = 'SedeNoCargadaError'
  }
}

export type IdsDeSedes = ReadonlyMap<string, IdDeDocumento>

export function idDeSede(ids: IdsDeSedes, nombre: string): IdDeDocumento {
  const id = ids.get(nombre)
  if (id === undefined) throw new SedeNoCargadaError(nombre)
  return id
}

// Sedes por nombre, con su orden de aparición.
export async function cargarSedes(
  puerto: PuertoDeCarga,
  sedes: readonly SedeSemilla[],
): Promise<IdsDeSedes> {
  const ids = new Map<string, IdDeDocumento>()
  for (const [indice, sede] of sedes.entries()) {
    const datos = { ...sede, orden: indice + 1 }
    ids.set(sede.nombre, await asegurar(puerto, 'sedes', { nombre: sede.nombre }, datos))
  }
  return ids
}

export async function cargarConfiguracion(
  puerto: PuertoDeCarga,
  configuracion: ConfiguracionSemilla,
  medios: IdsDeMedios,
): Promise<void> {
  const { marca, seo } = configuracion
  await puerto.actualizarGlobal('configuracion-del-sitio', {
    ...configuracion,
    marca: { ...marca, logo: medios.de(marca.logo), sello: medios.de(marca.sello) },
    seo: { ...seo, imagen: medios.de(seo.imagen) },
  })
}

export async function cargarNavegacion(
  puerto: PuertoDeCarga,
  items: readonly ItemDeMenuSemilla[],
  medios: IdsDeMedios,
): Promise<void> {
  await puerto.actualizarGlobal('navegacion', {
    items: items.map((item) => ({ ...item, imagen: medios.opcional(item.imagen) })),
  })
}
