import type { ClaveDeMedio, DatosDeSemilla } from './tipos'

// La clave de un medio es el nombre de su archivo (por ejemplo «hero-plan.webp»).
export function claveDeMedio(archivo: string): ClaveDeMedio {
  return archivo.split('/').at(-1) ?? archivo
}

const definidas = (claves: readonly (ClaveDeMedio | undefined)[]): ClaveDeMedio[] =>
  claves.filter((clave): clave is ClaveDeMedio => clave !== undefined)

// Todos los medios que la semilla usa en algún campo de imagen.
export function clavesDeMedioReferenciadas(datos: DatosDeSemilla): ClaveDeMedio[] {
  const { marca, seo } = datos.configuracion
  const { carrusel, servicios } = datos.paginaDeInicio
  return definidas([
    marca.logo,
    marca.sello,
    seo.imagen,
    ...datos.navegacion.map((item) => item.imagen),
    ...carrusel.portadas.flatMap((p) => [p.imagen, p.imagenParaCelular, p.sello]),
    servicios.imagenDeLaRueda,
    ...datos.clientes.map((cliente) => cliente.logo),
  ])
}
