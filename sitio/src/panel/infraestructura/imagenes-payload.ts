import type { Where } from 'payload'

import type { Medio } from '@/payload-types'

import type {
  FiltroDeLectura,
  ImagenDelPanel,
  RepositorioDeLecturaDeImagenes,
} from '../aplicacion/consultar-imagenes'
import type { RepositorioDeEscrituraDeImagenes } from '../aplicacion/gestionar-imagenes'
import { esUrlDeMedio } from '../dominio/selector-de-imagen'
import type { SubidaValidada } from '../dominio/subida-de-imagenes'
import { usosPorImagen } from '../dominio/usos-de-imagenes'
import { escribirDocumento } from './errores-de-payload'
import type { SesionDelPanel } from './sesion-del-panel'
import { type ContextoDeLectura, leerUsosDeImagenes } from './usos-de-imagenes-payload'

const COLECCION = 'medios'

function condicion({ ids, busqueda, idsPorUso }: FiltroDeLectura): Where | undefined {
  const partes: Where[] = []
  if (ids && 'incluir' in ids) partes.push({ id: { in: ids.incluir } })
  if (ids && 'excluir' in ids && ids.excluir.length > 0)
    partes.push({ id: { not_in: ids.excluir } })
  if (busqueda) {
    const texto: Where[] = [{ filename: { like: busqueda } }, { alt: { like: busqueda } }]
    if (idsPorUso.length > 0) texto.push({ id: { in: idsPorUso } })
    partes.push({ or: texto })
  }
  return partes.length > 0 ? { and: partes } : undefined
}

const aImagen = (doc: Medio): ImagenDelPanel => ({
  id: doc.id,
  nombre: doc.filename ?? `imagen-${doc.id}`,
  alt: doc.alt,
  url: esUrlDeMedio(doc.url) ? doc.url : null,
  ancho: doc.width ?? null,
  alto: doc.height ?? null,
  mime: doc.mimeType ?? null,
  tamano: doc.filesize ?? null,
})

function lectura({ payload, permisos }: ContextoDeLectura): RepositorioDeLecturaDeImagenes {
  return {
    usos: () => leerUsosDeImagenes({ payload, permisos }),
    contar: async (filtro) =>
      (await payload.count({ collection: COLECCION, where: condicion(filtro), ...permisos }))
        .totalDocs,
    listar: async (filtro, pagina, limite) => {
      const { docs } = await payload.find({
        collection: COLECCION,
        where: condicion(filtro),
        sort: '-createdAt',
        page: pagina,
        limit: limite,
        ...permisos,
      })
      return docs.map(aImagen)
    },
    buscar: async (id) => {
      const doc = await payload.findByID({
        collection: COLECCION,
        id,
        disableErrors: true,
        ...permisos,
      })
      return doc ? aImagen(doc) : null
    },
  }
}

async function conNombre(operacion: () => Promise<Medio>) {
  const escritura = await escribirDocumento(operacion)
  if (escritura.estado !== 'hecho') return escritura
  return { estado: 'hecho' as const, nombre: aImagen(escritura.documento).nombre }
}

// El archivo va como lo pide la Local API; el tipo es el detectado por contenido, no el que
// declaró el navegador. Payload limpia el nombre, lo hace único y lee las medidas con `sharp`.
async function subir({ payload, permisos }: ContextoDeLectura, datos: SubidaValidada) {
  const archivo = {
    data: Buffer.from(datos.bytes),
    mimetype: datos.mime,
    name: datos.nombre,
    size: datos.bytes.length,
  }
  const escritura = await escribirDocumento(() =>
    payload.create({ collection: COLECCION, data: { alt: datos.alt }, file: archivo, ...permisos }),
  )
  if (escritura.estado !== 'hecho') return escritura
  const imagen = aImagen(escritura.documento)
  const { id, nombre, alt, ancho, alto } = imagen
  return {
    estado: 'hecho' as const,
    imagen: { id, nombre, alt, ancho, alto, url: imagen.url ?? '' },
  }
}

function escritura(contexto: ContextoDeLectura): RepositorioDeEscrituraDeImagenes {
  const { payload, permisos } = contexto
  return {
    usosDe: async (id) => usosPorImagen(await leerUsosDeImagenes(contexto)).get(id) ?? [],
    subir: (datos) => subir(contexto, datos),
    guardarTextoAlternativo: (id, alt) =>
      conNombre(() => payload.update({ collection: COLECCION, id, data: { alt }, ...permisos })),
    // Payload borra también el archivo (en disco o en Wasabi).
    eliminar: (id) => conNombre(() => payload.delete({ collection: COLECCION, id, ...permisos })),
  }
}

// Adaptador de Payload de la biblioteca de imágenes. Toda lectura y escritura usa la Local API
// con `overrideAccess: false` y el usuario de la sesión: las reglas de la colección deciden.
export function crearRepositorioDeImagenes(
  sesion: SesionDelPanel,
): RepositorioDeLecturaDeImagenes & RepositorioDeEscrituraDeImagenes {
  const permisos = { overrideAccess: false, user: sesion.usuario, depth: 0 } as const
  const contexto: ContextoDeLectura = { payload: sesion.payload, permisos }
  return { ...lectura(contexto), ...escritura(contexto) }
}
