import { nombreDelPeriodo } from '@/modulos/vencimientos/dominio/cronograma-sunat'
import type { AvisosParaCliente, CronogramasSunat, Vencimiento } from '@/payload-types'

import type { RepositorioDeLecturaDeLaGuia } from '../aplicacion/consultar-guia'
import type { AvisoDelPanel } from '../dominio/avisos-para-clientes'
import type { CronogramaDelPanel } from '../dominio/cronogramas-del-panel'
import { diaDelInstante } from '../dominio/fechas-de-cronograma'
import type { VencimientoDelPanel } from '../dominio/vencimientos-del-panel'
import type { SesionDelPanel } from './sesion-del-panel'

// «Visible» se lee igual que el sitio público, que solo muestra los avisos con `activo: true`.
export const aAvisoDelPanel = (doc: AvisosParaCliente): AvisoDelPanel => ({
  id: doc.id,
  titulo: doc.titulo,
  cuandoAplica: doc.cuandoAplica,
  documentos: (doc.documentos ?? []).map(({ texto }) => texto),
  correo: doc.correoDeContacto?.trim() || null,
  visible: doc.activo === true,
  orden: doc.orden,
})

export const aVencimientoDelPanel = (doc: Vencimiento): VencimientoDelPanel => ({
  id: doc.id,
  obligacion: doc.obligacion,
  periodicidad: doc.periodicidad,
  cuandoVence: doc.cuandoVence,
  nota: doc.nota?.trim() || null,
  orden: doc.orden,
})

// Payload guarda cada fecha como instante; el panel la lee como día de Lima, igual que el sitio.
export const aCronogramaDelPanel = (doc: CronogramasSunat): CronogramaDelPanel => ({
  id: doc.id,
  anio: doc.anio,
  mes: doc.mes,
  periodo: doc.periodo || nombreDelPeriodo(doc.anio, doc.mes),
  fechas: (doc.fechasPorDigito ?? []).map(({ digito, fecha }) => ({
    digito,
    fecha: diaDelInstante(fecha),
  })),
  buenosContribuyentes: doc.fechaBuenosContribuyentes
    ? diaDelInstante(doc.fechaBuenosContribuyentes)
    : null,
})

// Tope holgado: unos pocos avisos y vencimientos, y unos años de cronogramas mensuales.
const LIMITE = 200

// Adaptador de Payload de las lecturas de la guía. Usa la Local API con `overrideAccess: false` y
// el usuario de la sesión.
export function crearLecturaDeLaGuia({
  payload,
  usuario,
}: SesionDelPanel): RepositorioDeLecturaDeLaGuia {
  const lectura = { overrideAccess: false, user: usuario, depth: 0, limit: LIMITE } as const
  return {
    listarAvisos: async () => {
      const { docs } = await payload.find({
        collection: 'avisos-para-clientes',
        sort: 'orden',
        ...lectura,
      })
      return docs.map(aAvisoDelPanel)
    },
    listarVencimientos: async () => {
      const { docs } = await payload.find({ collection: 'vencimientos', sort: 'orden', ...lectura })
      return docs.map(aVencimientoDelPanel)
    },
    listarCronogramas: async () => {
      const { docs } = await payload.find({
        collection: 'cronogramas-sunat',
        sort: ['-anio', '-mes'],
        ...lectura,
      })
      return docs.map(aCronogramaDelPanel)
    },
  }
}
