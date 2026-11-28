import type { Payload, TypedUser } from 'payload'

import type { ConfiguracionDelSitio, Navegacion, PaginaDeInicio } from '@/payload-types'

import type { LugarDeUso } from '../dominio/imagenes'
import { idsEnTextoEnriquecido, type UsoDeImagen } from '../dominio/usos-de-imagenes'

export interface ContextoDeLectura {
  payload: Payload
  permisos: { overrideAccess: false; user: TypedUser; depth: 0 }
}

type Relacion = number | { id: number } | null | undefined
type Seccion = NonNullable<PaginaDeInicio['secciones']>[number]
type Portada = NonNullable<
  Extract<Seccion, { blockType: 'carrusel-de-portadas' }>['portadas']
>[number]

const idDe = (valor: Relacion): number | null =>
  typeof valor === 'number' ? valor : (valor?.id ?? null)

function uso(valor: Relacion, lugar: LugarDeUso, texto: string): UsoDeImagen[] {
  const medio = idDe(valor)
  return medio === null ? [] : [{ medio, lugar, texto }]
}

const usosDePortada = (portada: Portada, indice: number): UsoDeImagen[] => [
  ...uso(portada.imagen, 'inicio', `Portada ${indice + 1} del carrusel`),
  ...uso(portada.imagenParaCelular, 'inicio', `Portada ${indice + 1} del carrusel, en celular`),
  ...uso(portada.sello, 'inicio', `Sello de la portada ${indice + 1}`),
]

// Cada bloque del inicio con un campo de imagen. Un bloque nuevo con imágenes se agrega aquí.
function usosDeLaSeccion(seccion: Seccion): UsoDeImagen[] {
  if (seccion.blockType === 'carrusel-de-portadas')
    return (seccion.portadas ?? []).flatMap(usosDePortada)
  if (seccion.blockType === 'servicios')
    return uso(seccion.imagenDeLaRueda, 'inicio', 'Sección «Nuestros servicios»')
  if (seccion.blockType === 'contacto')
    return uso(seccion.canales?.fotoDelMapa, 'inicio', 'Foto del mapa de «Contáctanos»')
  return []
}

const usosDeLaMarca = (configuracion: ConfiguracionDelSitio): UsoDeImagen[] => [
  ...uso(configuracion.marca?.logo, 'marca', 'Logotipo del sitio'),
  ...uso(configuracion.marca?.sello, 'marca', 'Sello SIGE Mype del sitio'),
  ...uso(configuracion.seo?.imagen, 'marca', 'Imagen para redes sociales'),
]

const usosDelMenu = (navegacion: Navegacion): UsoDeImagen[] =>
  (navegacion.items ?? []).flatMap((item) =>
    uso(item.imagen, 'marca', `Menú del sitio («${item.etiqueta}»)`),
  )

async function usosDeLosGlobales({ payload, permisos }: ContextoDeLectura) {
  const [inicio, configuracion, navegacion] = await Promise.all([
    payload.findGlobal({ slug: 'pagina-de-inicio', ...permisos }),
    payload.findGlobal({ slug: 'configuracion-del-sitio', ...permisos }),
    payload.findGlobal({ slug: 'navegacion', ...permisos }),
  ])
  return [
    ...(inicio.secciones ?? []).flatMap(usosDeLaSeccion),
    ...usosDeLaMarca(configuracion),
    ...usosDelMenu(navegacion),
  ]
}

async function usosDeLosClientes({ payload, permisos }: ContextoDeLectura) {
  const { docs } = await payload.find({
    collection: 'clientes',
    select: { nombre: true, logo: true },
    pagination: false,
    ...permisos,
  })
  return docs.flatMap((cliente) => uso(cliente.logo, 'clientes', `Cliente «${cliente.nombre}»`))
}

// Las publicaciones usan borradores: se leen las guardadas y su último borrador, porque los dos
// pueden apuntar a imágenes distintas. El contenido (Lexical) guarda sus imágenes en el JSON.
async function usosDelBlog({ payload, permisos }: ContextoDeLectura) {
  const consulta = {
    collection: 'publicaciones',
    select: { titulo: true, imagen: true, contenido: true },
    pagination: false,
    ...permisos,
  } as const
  const lecturas = await Promise.all([
    payload.find(consulta),
    payload.find({ ...consulta, draft: true }),
  ])
  return lecturas.flatMap(({ docs }) =>
    docs.flatMap((publicacion) => [
      ...uso(publicacion.imagen, 'blog', `Publicación «${publicacion.titulo}»`),
      ...idsEnTextoEnriquecido(publicacion.contenido).flatMap((medio) =>
        uso(medio, 'blog', `Dentro de la publicación «${publicacion.titulo}»`),
      ),
    ]),
  )
}

// Todo lo que hoy apunta a una imagen de `medios`, con los permisos de quien entra.
export async function leerUsosDeImagenes(contexto: ContextoDeLectura): Promise<UsoDeImagen[]> {
  const partes = await Promise.all([
    usosDeLosGlobales(contexto),
    usosDeLosClientes(contexto),
    usosDelBlog(contexto),
  ])
  return partes.flat()
}
