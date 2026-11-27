import { etiquetaDeColeccion } from '@/compartido/dominio/etiquetas-de-cache'
import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import { leerEnCache } from '@/compartido/infraestructura/lectura-en-cache'
import type { AvisosParaCliente } from '@/payload-types'

import type { RepositorioAvisos } from '../aplicacion/repositorio-avisos'
import type { AvisoGuardado } from '../dominio/aviso'

// Límite holgado: la guía publica unos pocos avisos.
const MAXIMO_DE_AVISOS = 30

export function mapearAviso(aviso: AvisosParaCliente): AvisoGuardado {
  return {
    titulo: aviso.titulo,
    cuandoAplica: aviso.cuandoAplica,
    documentos: (aviso.documentos ?? []).map((documento) => documento.texto),
    correoDeContacto: aviso.correoDeContacto || null,
  }
}

// Solo avisos visibles, en el orden del panel y con los permisos del público.
export const repositorioAvisosPayload: RepositorioAvisos = {
  listarActivos: leerEnCache(
    'avisos-para-clientes.listarActivos',
    [etiquetaDeColeccion('avisos-para-clientes')],
    async () => {
      const payload = await obtenerPayload()
      const { docs } = await payload.find({
        collection: 'avisos-para-clientes',
        where: { activo: { equals: true } },
        sort: 'orden',
        depth: 0,
        limit: MAXIMO_DE_AVISOS,
        pagination: false,
        overrideAccess: false,
      })
      return docs.map(mapearAviso)
    },
  ),
}
