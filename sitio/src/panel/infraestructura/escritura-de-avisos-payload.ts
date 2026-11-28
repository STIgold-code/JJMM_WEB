import type { Payload, TypedUser } from 'payload'

import type { RepositorioDeEscrituraDeAvisos } from '../aplicacion/gestionar-avisos'
import type { AvisoValidado } from '../dominio/validacion-de-aviso'
import { escribirDocumento } from './errores-de-payload'
import { reordenarEnTransaccion } from './reordenar-payload'
import type { SesionDelPanel } from './sesion-del-panel'

const COLECCION = 'avisos-para-clientes'

interface Contexto {
  payload: Payload
  permisos: { overrideAccess: false; user: TypedUser; depth: 0 }
}

// Solo los campos que edita el panel, con los nombres de la colección. Los documentos reemplazan
// la lista guardada entera, en el orden del formulario.
const datosDelAviso = (datos: AvisoValidado) => ({
  titulo: datos.titulo,
  cuandoAplica: datos.cuandoAplica,
  documentos: datos.documentos.map((texto) => ({ texto })),
  correoDeContacto: datos.correo,
})

async function conNombre(operacion: () => Promise<{ titulo: string }>) {
  const escritura = await escribirDocumento(operacion)
  if (escritura.estado !== 'hecho') return escritura
  return { estado: 'hecho' as const, nombre: escritura.documento.titulo }
}

async function listarPosiciones({ payload, permisos }: Contexto) {
  const { docs } = await payload.find({
    collection: COLECCION,
    sort: 'orden',
    pagination: false,
    ...permisos,
  })
  return docs.map(({ id, orden }) => ({ id, orden }))
}

// Un aviso nuevo se crea oculto: se enciende en la lista cuando está listo.
async function crear({ payload, permisos }: Contexto, datos: AvisoValidado, orden: number) {
  const data = { ...datosDelAviso(datos), orden, activo: false }
  const escritura = await escribirDocumento(() =>
    payload.create({ collection: COLECCION, data, ...permisos }),
  )
  if (escritura.estado !== 'hecho') return escritura
  return { estado: 'hecho' as const, id: escritura.documento.id }
}

async function guardar({ payload, permisos }: Contexto, id: number, datos: AvisoValidado) {
  const data = datosDelAviso(datos)
  const escritura = await escribirDocumento(() =>
    payload.update({ collection: COLECCION, id, data, ...permisos }),
  )
  if (escritura.estado !== 'hecho') return escritura
  return { estado: 'hecho' as const, visible: escritura.documento.activo === true }
}

// Adaptador de Payload de las escrituras de avisos. Toda escritura usa la Local API con
// `overrideAccess: false` y el usuario de la sesión, y pasa por los hooks y validaciones de la
// colección: la caché del sitio público se invalida sola.
export function crearEscrituraDeAvisos(sesion: SesionDelPanel): RepositorioDeEscrituraDeAvisos {
  const { payload, usuario } = sesion
  const permisos = { overrideAccess: false, user: usuario, depth: 0 } as const
  const contexto: Contexto = { payload, permisos }
  return {
    listarPosiciones: () => listarPosiciones(contexto),
    cambiarVisibilidad: (id, visible) =>
      conNombre(() =>
        payload.update({ collection: COLECCION, id, data: { activo: visible }, ...permisos }),
      ),
    reordenar: (cambios) => reordenarEnTransaccion(payload, permisos, COLECCION, cambios),
    crear: (datos, orden) => crear(contexto, datos, orden),
    guardar: (id, datos) => guardar(contexto, id, datos),
    eliminar: (id) => conNombre(() => payload.delete({ collection: COLECCION, id, ...permisos })),
  }
}
