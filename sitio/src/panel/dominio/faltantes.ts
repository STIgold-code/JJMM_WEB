import { rutaDeLaParte } from './guia-de-clientes'
import { listaEnAdmin } from './rutas-del-panel'
import { RUTA_DE_SEDES } from './sedes'

// «Lo que falta completar»: solo lo que se puede calcular con los datos. Lo que no se puede
// medir con honestidad (por ejemplo, si los vencimientos tienen fecha: la colección no guarda
// fechas) no aparece. `null` = la cuenta no puede leer esa colección.
export interface AvanceDelSitio {
  digitosDelCronograma: number | null
  sedes: { activas: number; conCelular: number } | null
  publicadas: number | null
}

export interface Faltante {
  clave: 'cronograma' | 'sedes' | 'publicaciones'
  texto: string
  actual: number
  total: number
  etiqueta: string
  completo: boolean
  href: string
}

const DIGITOS_DEL_RUC = 10

export function digitosConFecha(
  fechas: readonly { digito: number; fecha?: string | null }[] | null | undefined,
): number {
  const conFecha = (fechas ?? []).filter(
    ({ digito, fecha }) => Number.isInteger(digito) && digito >= 0 && digito <= 9 && Boolean(fecha),
  )
  return new Set(conFecha.map(({ digito }) => digito)).size
}

export function porcentaje(actual: number, total: number): number {
  if (total <= 0) return 0
  return Math.round(Math.min(actual / total, 1) * 1000) / 10
}

const faltante = (datos: Omit<Faltante, 'completo'>): Faltante => ({
  ...datos,
  completo: datos.actual >= datos.total,
})

function cronograma(digitos: number | null): Faltante[] {
  if (digitos === null) return []
  return [
    faltante({
      clave: 'cronograma',
      texto: 'Cargar el cronograma de SUNAT por dígito del RUC',
      actual: digitos,
      total: DIGITOS_DEL_RUC,
      etiqueta: `${digitos} de ${DIGITOS_DEL_RUC} dígitos`,
      href: rutaDeLaParte('cronograma'),
    }),
  ]
}

function sedes(avance: AvanceDelSitio['sedes']): Faltante[] {
  if (avance === null || avance.activas === 0) return []
  return [
    faltante({
      clave: 'sedes',
      texto: 'Agregar un celular a cada sede activa',
      actual: avance.conCelular,
      total: avance.activas,
      etiqueta: `${avance.conCelular} de ${avance.activas} sedes`,
      href: RUTA_DE_SEDES,
    }),
  ]
}

function publicaciones(publicadas: number | null): Faltante[] {
  if (publicadas === null) return []
  return [
    faltante({
      clave: 'publicaciones',
      texto: 'Publicar la primera entrada del blog',
      actual: Math.min(publicadas, 1),
      total: 1,
      etiqueta: publicadas === 1 ? '1 publicada' : `${publicadas} publicadas`,
      href: listaEnAdmin('publicaciones'),
    }),
  ]
}

export function faltantesDelSitio(avance: AvanceDelSitio): Faltante[] {
  return [
    ...cronograma(avance.digitosDelCronograma),
    ...sedes(avance.sedes),
    ...publicaciones(avance.publicadas),
  ]
}

export function cantidadPorCompletar(faltantes: readonly Faltante[]): number {
  return faltantes.filter((f) => !f.completo).length
}
