import type { Rol } from '@/compartido/dominio/roles'

import {
  type CambiosDeFilas,
  cambiosDeFilas,
  type FilaGuardada,
  hayAlgoQueEscribir,
} from '../dominio/cambios-de-filas'
import { puedeEliminarDelCatalogo } from '../dominio/catalogo'
import type { Aviso } from '../dominio/respuesta-al-mensaje'
import {
  ERROR_DE_TABLA_CAMBIADA,
  type ErroresDeFilas,
  validarFilas,
} from '../dominio/validacion-de-filas'
import { ERROR_SIN_PERMISO } from './gestionar-mensajes'
import {
  type EstadoDelGuardado,
  estadoDelRechazo,
  type ResultadoDeEscritura,
} from './resultados-de-escritura'

// «Filas de la tabla»: la lista entera se guarda de una vez (maqueta: «Los cambios se aplican al
// guardar»). El repositorio aplica los cambios en una transacción: borrar (cada fila borra antes
// sus celdas, hook de la colección), actualizar y crear; todo o nada. Un rechazo de la colección
// vuelve con el campo como `filas.<posición>.<campo>`.
export interface RepositorioDeEscrituraDeFilas {
  listarFilas(): Promise<FilaGuardada[]>
  aplicar(cambios: CambiosDeFilas): Promise<ResultadoDeEscritura>
}

export type EstadoDelGuardadoDeFilas = EstadoDelGuardado<ErroresDeFilas>

export const AVISO_DE_FILAS_GUARDADAS: Aviso = {
  titulo: 'Filas guardadas',
  detalle: 'La tabla «Nuestros planes» ya muestra las filas en este orden.',
}

const TEXTOS = {
  inexistente: ERROR_DE_TABLA_CAMBIADA,
  invalido:
    'No se pudo guardar: alguna fila tiene datos que no son válidos. Recarga la página e inténtalo de nuevo.',
}

const FILA = /^filas\.(\d+)\./

// Lo que la colección rechazó va a su fila: el nombre es lo único que se escribe (vacío, con
// montos o repetido en la base).
function erroresDelCampo(campo: string): ErroresDeFilas | undefined {
  const fila = FILA.exec(campo)
  if (!fila?.[1]) return undefined
  return { fila: { [Number(fila[1])]: 'Revisa este nombre: puede que ya exista otra fila igual.' } }
}

// El rol sale de la sesión del servidor, nunca del navegador: solo el administrador quita filas
// (quitar una borra sus celdas en todos los planes).
export async function guardarFilas(
  repositorio: RepositorioDeEscrituraDeFilas,
  entrada: { formulario: unknown; rol: Rol },
): Promise<EstadoDelGuardadoDeFilas> {
  const guardadas = await repositorio.listarFilas()
  const validacion = validarFilas(
    entrada.formulario,
    guardadas.map((fila) => fila.id),
  )
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const cambios = cambiosDeFilas(guardadas, validacion.datos)
  if (cambios.eliminar.length > 0 && !puedeEliminarDelCatalogo(entrada.rol))
    return { estado: 'error', error: ERROR_SIN_PERMISO }
  if (!hayAlgoQueEscribir(cambios)) return { estado: 'guardado', aviso: AVISO_DE_FILAS_GUARDADAS }
  const escritura = await repositorio.aplicar(cambios)
  if (escritura.estado !== 'hecho')
    return estadoDelRechazo<ErroresDeFilas>(escritura, erroresDelCampo, TEXTOS)
  return { estado: 'guardado', aviso: AVISO_DE_FILAS_GUARDADAS }
}
