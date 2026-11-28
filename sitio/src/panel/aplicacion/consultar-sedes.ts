import {
  FORMULARIO_DE_SEDE_NUEVA,
  type FormularioDeSede,
  formularioDeSedeGuardada,
} from '../dominio/formulario-de-sede'
import { leerId } from '../dominio/identificadores'
import type { SedeDelPanel } from '../dominio/sedes'
import type { PestanaGuardada } from '../dominio/vista-previa-de-sede'

// Título de «Contáctanos» y textos de los botones de cada sede (bloque de la página de inicio).
// `null` en un botón: el sitio no lo muestra.
export interface TextosDeContacto {
  titulo: string
  comoLlegar: string | null
  verMapa: string | null
}

// Lecturas con los permisos de quien entra. Las sedes, en su orden.
export interface RepositorioDeLecturaDeSedes {
  listarSedes(): Promise<SedeDelPanel[]>
  // `null` si la página de inicio no tiene «Contáctanos»: la vista previa usa los de siempre.
  leerTextosDeContacto(): Promise<TextosDeContacto | null>
}

export interface DatosDeEdicionDeSede {
  // `null`: una sede nueva.
  sede: SedeDelPanel | null
  formulario: FormularioDeSede
  pestanas: PestanaGuardada[]
  textos: TextosDeContacto
  // Otras sedes visibles. Sin ninguna, ocultar o borrar esta deja el sitio sin sedes.
  otrasVisibles: number
}

// Los valores con que se crea el bloque «Contáctanos» (`bloque-contacto.ts`).
export const TEXTOS_DE_CONTACTO_PREDETERMINADOS: TextosDeContacto = {
  titulo: 'Contáctanos',
  comoLlegar: 'Cómo llegar',
  verMapa: 'Ver mapa',
}

export function obtenerListadoDeSedes(
  repositorio: RepositorioDeLecturaDeSedes,
): Promise<SedeDelPanel[]> {
  return repositorio.listarSedes()
}

async function datosDeEdicion(
  repositorio: RepositorioDeLecturaDeSedes,
  id: number | null,
): Promise<DatosDeEdicionDeSede | null> {
  const [sedes, textos] = await Promise.all([
    repositorio.listarSedes(),
    repositorio.leerTextosDeContacto(),
  ])
  const sede = id === null ? null : (sedes.find((s) => s.id === id) ?? null)
  if (id !== null && !sede) return null
  return {
    sede,
    formulario: sede ? formularioDeSedeGuardada(sede) : FORMULARIO_DE_SEDE_NUEVA,
    pestanas: sedes.map(({ id: idDeSede, distrito, visible }) => ({
      id: idDeSede,
      distrito,
      visible,
    })),
    textos: textos ?? TEXTOS_DE_CONTACTO_PREDETERMINADOS,
    otrasVisibles: sedes.filter((s) => s.visible && s.id !== id).length,
  }
}

// `null` si el id de la URL no es válido o la sede no existe.
export function obtenerEdicionDeSede(
  repositorio: RepositorioDeLecturaDeSedes,
  idEnLaUrl: unknown,
): Promise<DatosDeEdicionDeSede | null> {
  const id = leerId(idEnLaUrl)
  return id === null ? Promise.resolve(null) : datosDeEdicion(repositorio, id)
}

export async function obtenerNuevaSede(
  repositorio: RepositorioDeLecturaDeSedes,
): Promise<DatosDeEdicionDeSede> {
  const datos = await datosDeEdicion(repositorio, null)
  // Sin id, siempre hay datos: `null` solo sale de una sede que no existe.
  if (!datos) throw new Error('No se pudieron preparar los datos de una sede nueva.')
  return datos
}
