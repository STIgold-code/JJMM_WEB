import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'

import type { RepositorioAreas } from '../aplicacion/listar-areas'

// Las nueve áreas P1–P9; el límite deja margen.
const MAXIMO_DE_AREAS = 18

export const repositorioAreasPayload: RepositorioAreas = {
  async listar() {
    const payload = await obtenerPayload()
    const { docs } = await payload.find({
      collection: 'areas-de-servicio',
      sort: 'orden',
      depth: 0,
      limit: MAXIMO_DE_AREAS,
      pagination: false,
      overrideAccess: false,
    })
    return docs.map((area) => ({
      codigo: area.codigo,
      nombre: area.nombre,
      nombreCorto: area.nombreCorto,
      descripcion: area.descripcion,
      puntos: (area.puntos ?? []).map((punto) => punto.texto),
      mensajeDeConsulta: area.mensajeDeConsulta || null,
      poligonoEnLaRueda: area.poligonoEnLaRueda || null,
    }))
  },
}
