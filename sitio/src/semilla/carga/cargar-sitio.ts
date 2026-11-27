import type { ConfiguracionSemilla, ItemDeMenuSemilla, SedeSemilla } from '../datos/tipos'
import { asegurar, type PuertoDeCarga } from '../puerto-de-carga'
import type { IdsDeMedios } from './cargar-medios'

// Sedes por nombre, con su orden de aparición. Ninguna global las referencia: «Contáctanos»
// muestra todas las activas.
export async function cargarSedes(
  puerto: PuertoDeCarga,
  sedes: readonly SedeSemilla[],
): Promise<void> {
  for (const [indice, sede] of sedes.entries()) {
    const datos = { ...sede, orden: indice + 1 }
    await asegurar(puerto, 'sedes', { nombre: sede.nombre }, datos)
  }
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
