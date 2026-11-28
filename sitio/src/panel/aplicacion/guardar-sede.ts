import { leerId } from '../dominio/identificadores'
import { ordenAlFinal } from '../dominio/orden'
import { type Aviso, ERROR_DE_CELULAR, ERROR_DE_CORREO } from '../dominio/respuesta-al-mensaje'
import { avisoDeSedeCreada, avisoDeSedeGuardada } from '../dominio/sedes'
import {
  ERROR_DE_MAPA,
  ERROR_SIN_CELULARES,
  type ErroresDeSede,
  validarFormularioDeSede,
} from '../dominio/validacion-de-sede'
import {
  ERROR_DE_SEDE_INEXISTENTE,
  rechazoDeSedeComoError,
  type RepositorioDeEscrituraDeSedes,
} from './gestionar-sedes'
import type { RechazoDelRepositorio } from './resultados-de-escritura'

// Guardar la edición de una sede y crear una sede nueva (las dos, con el formulario completo).
export type EstadoDelGuardadoDeSede =
  | { estado: 'guardado'; aviso: Aviso }
  | { estado: 'creado'; id: number; aviso: Aviso }
  | { estado: 'invalido'; errores: ErroresDeSede }
  | { estado: 'error'; error: string }

const MENSAJES_POR_CAMPO: Readonly<Record<string, Partial<ErroresDeSede>>> = {
  nombre: { nombre: 'Revisa el nombre de la sede.' },
  direccion: { direccion: 'Revisa la dirección de la sede.' },
  distrito: { distrito: 'Revisa el distrito.' },
  ciudad: { ciudad: 'Revisa la ciudad.' },
  correo: { correo: ERROR_DE_CORREO },
  enlaceDeMapa: { mapa: ERROR_DE_MAPA },
  celulares: { celulares: ERROR_SIN_CELULARES },
}

// Celular rechazado por la colección: Payload lo nombra `celulares.<fila>.<campo>`.
const CAMPO_DE_CELULAR = /^celulares\.(\d+)\./

// Lo que la colección rechazó va junto a su campo, con el texto del panel. Un campo que el panel
// no conoce no tiene dónde mostrarse: queda como aviso general.
function erroresDeLaColeccion(campos: readonly string[]): ErroresDeSede | null {
  const celular: Record<number, string> = {}
  let errores: ErroresDeSede = {}
  for (const campo of campos) {
    const fila = CAMPO_DE_CELULAR.exec(campo)?.[1]
    if (fila) celular[Number(fila)] = ERROR_DE_CELULAR
    errores = { ...errores, ...MENSAJES_POR_CAMPO[campo] }
  }
  if (Object.keys(celular).length > 0) errores.celular = celular
  return Object.keys(errores).length > 0 ? errores : null
}

function estadoDelRechazo(rechazo: RechazoDelRepositorio): EstadoDelGuardadoDeSede {
  const errores = rechazo.estado === 'invalido' ? erroresDeLaColeccion(rechazo.campos) : null
  if (errores) return { estado: 'invalido', errores }
  return { estado: 'error', error: rechazoDeSedeComoError(rechazo) }
}

export async function guardarSede(
  repositorio: RepositorioDeEscrituraDeSedes,
  entrada: { id: unknown; formulario: unknown },
): Promise<EstadoDelGuardadoDeSede> {
  const id = leerId(entrada.id)
  if (id === null) return { estado: 'error', error: ERROR_DE_SEDE_INEXISTENTE }
  const validacion = validarFormularioDeSede(entrada.formulario)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const escritura = await repositorio.guardar(id, validacion.datos)
  if (escritura.estado === 'hecho')
    return { estado: 'guardado', aviso: avisoDeSedeGuardada(validacion.datos.visible) }
  return estadoDelRechazo(escritura)
}

// La sede nueva va al final de la lista (la última pestaña de «Contáctanos»).
export async function crearSede(
  repositorio: RepositorioDeEscrituraDeSedes,
  entrada: { formulario: unknown },
): Promise<EstadoDelGuardadoDeSede> {
  const validacion = validarFormularioDeSede(entrada.formulario)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const { datos } = validacion
  const orden = ordenAlFinal(await repositorio.listarPosiciones())
  const escritura = await repositorio.crear(datos, orden)
  if (escritura.estado !== 'hecho') return estadoDelRechazo(escritura)
  return {
    estado: 'creado',
    id: escritura.id,
    aviso: avisoDeSedeCreada(datos.nombre, datos.visible),
  }
}
