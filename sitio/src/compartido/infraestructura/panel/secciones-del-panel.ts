import type { SanitizedPermissions } from 'payload'

import type { EntradaDeSeccion, SeccionDelInicio } from '../../componentes/panel/modelo-del-inicio'
import { primeraOracion } from '../../componentes/panel/textos-del-inicio'
import type { NombreDeTrazo } from '../../componentes/panel/trazos-del-panel'
import { ORDEN_DE_GRUPOS } from './grupos-del-panel'

// Secciones del inicio del panel: las mismas colecciones y globales del menú, agrupadas igual,
// con su ícono, la primera oración de su ayuda y cuántos documentos tienen.
export interface EntidadDelPanel {
  tipo: 'coleccion' | 'global'
  slug: string
  etiqueta: string
  descripcion: string
  grupo: string
}

// Lo que se lee de la configuración de Payload (cruda o ya procesada por Payload).
interface AdminConDescripcion {
  admin?: { description?: unknown; group?: unknown }
}
type ConfigDeColeccion = AdminConDescripcion & { slug: string; labels?: { plural?: unknown } }
type ConfigDeGlobal = AdminConDescripcion & { slug: string; label?: unknown }

const ICONOS: Readonly<Record<string, NombreDeTrazo>> = {
  'areas-de-servicio': 'capas',
  planes: 'lista',
  'caracteristicas-de-plan': 'lista',
  'inclusiones-de-plan': 'lista',
  valores: 'estrella',
  clientes: 'maletin',
  'avisos-para-clientes': 'aviso',
  vencimientos: 'calendario',
  'cronogramas-sunat': 'calendario',
  publicaciones: 'pluma',
  categorias: 'carpeta',
  etiquetas: 'etiqueta',
  'mensajes-de-contacto': 'mensaje',
  sedes: 'ubicacion',
  medios: 'imagen',
  usuarios: 'usuarios',
  'pagina-de-inicio': 'inicio',
  'guia-de-clientes': 'libro',
  'pagina-del-blog': 'pagina',
  navegacion: 'menu',
  'configuracion-del-sitio': 'ajustes',
}

const texto = (valor: unknown): string => (typeof valor === 'string' ? valor : '')

export function entidadesDelPanel(
  colecciones: readonly ConfigDeColeccion[],
  globales: readonly ConfigDeGlobal[],
): EntidadDelPanel[] {
  const comun = ({ slug, admin }: ConfigDeColeccion | ConfigDeGlobal) => ({
    slug,
    descripcion: texto(admin?.description),
    grupo: texto(admin?.group),
  })
  return [
    ...colecciones.map((c) => ({
      ...comun(c),
      tipo: 'coleccion' as const,
      etiqueta: texto(c.labels?.plural) || c.slug,
    })),
    ...globales.map((g) => ({
      ...comun(g),
      tipo: 'global' as const,
      etiqueta: texto(g.label) || g.slug,
    })),
  ]
}

// Se muestra lo que la cuenta puede editar: crear y editar en una colección, editar una global.
// Así el editor no ve las cuentas (solo edita la suya) ni el menú o la configuración del sitio.
export function puedeEditar({ tipo, slug }: EntidadDelPanel, permisos: SanitizedPermissions) {
  if (tipo === 'global') return permisos.globals?.[slug]?.update === true
  const permiso = permisos.collections?.[slug]
  return permiso?.create === true && permiso.update === true
}

interface DatosDeSecciones {
  entidades: readonly EntidadDelPanel[]
  permisos: SanitizedPermissions
  rutaDelPanel: string
  conteos: Readonly<Record<string, number>>
}

function aEntrada(entidad: EntidadDelPanel, datos: DatosDeSecciones): EntradaDeSeccion {
  const tramo = entidad.tipo === 'coleccion' ? 'collections' : 'globals'
  return {
    clave: `${entidad.tipo}:${entidad.slug}`,
    etiqueta: entidad.etiqueta,
    descripcion: primeraOracion(entidad.descripcion),
    href: `${datos.rutaDelPanel}/${tramo}/${entidad.slug}`,
    icono: ICONOS[entidad.slug] ?? 'pagina',
    cantidad: entidad.tipo === 'coleccion' ? (datos.conteos[entidad.slug] ?? null) : null,
  }
}

export function armarSecciones(datos: DatosDeSecciones): SeccionDelInicio[] {
  const visibles = datos.entidades.filter((entidad) => puedeEditar(entidad, datos.permisos))
  return ORDEN_DE_GRUPOS.map((grupo) => ({
    grupo,
    entradas: visibles.filter((e) => e.grupo === grupo).map((e) => aEntrada(e, datos)),
  })).filter(({ entradas }) => entradas.length > 0)
}
