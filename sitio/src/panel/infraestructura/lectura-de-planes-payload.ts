import type { Plane } from '@/payload-types'

import type {
  RepositorioDeLecturaDePlanes,
  TextosDeLaSeccion,
} from '../aplicacion/consultar-planes'
import type { PlanDelPanel } from '../dominio/planes'
import type { SesionDelPanel } from './sesion-del-panel'

const idDe = (valor: number | { id: number }): number =>
  typeof valor === 'number' ? valor : valor.id

// `activo` vacío solo existiría antes de la migración que lo agregó con `true`: se lee igual
// que el sitio público, como visible.
export const aPlanDelPanel = (doc: Plane): PlanDelPanel => ({
  id: doc.id,
  nombre: doc.nombre,
  mensajeDeConsulta: doc.mensajeDeConsulta?.trim() || null,
  visible: doc.activo !== false,
  orden: doc.orden,
})

// Adaptador de Payload de las lecturas de planes. Usa la Local API con `overrideAccess: false` y
// el usuario de la sesión, sin paginar (son pocos: 4 planes × 22 características en la v4).
export function crearLecturaDePlanes(sesion: SesionDelPanel): RepositorioDeLecturaDePlanes {
  const { payload, usuario } = sesion
  const lectura = { overrideAccess: false, user: usuario, depth: 0, pagination: false } as const
  return {
    listarPlanes: async () => {
      const { docs } = await payload.find({ collection: 'planes', sort: 'orden', ...lectura })
      return docs.map(aPlanDelPanel)
    },
    listarCaracteristicas: async () => {
      const { docs } = await payload.find({
        collection: 'caracteristicas-de-plan',
        sort: 'orden',
        ...lectura,
      })
      return docs.map(({ id, nombre }) => ({ id, nombre }))
    },
    listarInclusiones: async () => {
      const { docs } = await payload.find({ collection: 'inclusiones-de-plan', ...lectura })
      // Los tipos dicen que `plan` y `caracteristica` siempre existen, pero la base los deja en
      // nulo si se borró su plan o su característica (`ON DELETE SET NULL`): esas celdas
      // huérfanas se descartan en lugar de romper la pantalla.
      return docs.flatMap(({ id, plan, caracteristica, tipo, texto }) => {
        const huerfana: unknown[] = [plan, caracteristica]
        if (huerfana.includes(null) || huerfana.includes(undefined)) return []
        return [
          {
            id,
            plan: idDe(plan),
            caracteristica: idDe(caracteristica),
            tipo,
            texto: texto ?? null,
          },
        ]
      })
    },
    leerTextosDeLaSeccion: () => leerTextosDeLaSeccion(sesion),
  }
}

// Textos de la sección «Nuestros planes» de la página de inicio, o `null` si no la tiene.
async function leerTextosDeLaSeccion({
  payload,
  usuario,
}: SesionDelPanel): Promise<TextosDeLaSeccion | null> {
  const pagina = await payload.findGlobal({
    slug: 'pagina-de-inicio',
    overrideAccess: false,
    user: usuario,
    depth: 0,
  })
  const seccion = pagina.secciones?.find((bloque) => bloque.blockType === 'planes')
  if (seccion?.blockType !== 'planes') return null
  return {
    titulo: seccion.titulo,
    bajada: seccion.bajada?.trim() || null,
    encabezado: seccion.encabezadoDeCaracteristicas,
    textoDelBoton: seccion.textoDelBoton,
    notaAlPie: seccion.notaAlPie?.trim() || null,
  }
}
