import type {
  AreaSemilla,
  AvisoSemilla,
  ClienteSemilla,
  ValorSemilla,
  VencimientoSemilla,
} from '../datos/tipos'
import type { PuertoDeCarga } from '../puerto-de-carga'
import { cargarEnOrden } from './cargar-en-orden'
import type { IdsDeMedios } from './cargar-medios'

// Listas ordenables del inicio y de la guía, cada una con su clave natural.

export async function cargarAreas(puerto: PuertoDeCarga, areas: readonly AreaSemilla[]) {
  await cargarEnOrden(
    puerto,
    'areas-de-servicio',
    areas,
    (area, orden) => ({ ...area, orden }),
    ({ codigo }) => ({ codigo }),
  )
}

export async function cargarValores(puerto: PuertoDeCarga, valores: readonly ValorSemilla[]) {
  await cargarEnOrden(
    puerto,
    'valores',
    valores,
    (valor, orden) => ({ ...valor, orden }),
    ({ nombre }) => ({ nombre }),
  )
}

// Dos clientes comparten el nombre «por confirmar», así que la clave natural es su logotipo.
export async function cargarClientes(
  puerto: PuertoDeCarga,
  clientes: readonly ClienteSemilla[],
  medios: IdsDeMedios,
) {
  await cargarEnOrden(
    puerto,
    'clientes',
    clientes,
    ({ nombre, logo }, orden) => ({ nombre, logo: medios.de(logo), orden, activo: true }),
    ({ logo }) => ({ logo: medios.de(logo) }),
  )
}

export async function cargarAvisos(puerto: PuertoDeCarga, avisos: readonly AvisoSemilla[]) {
  await cargarEnOrden(
    puerto,
    'avisos-para-clientes',
    avisos,
    (aviso, orden) => ({ ...aviso, orden }),
    ({ titulo }) => ({ titulo }),
  )
}

// SENCICO aparece como obligación mensual y anual: la clave incluye la periodicidad.
export async function cargarVencimientos(
  puerto: PuertoDeCarga,
  vencimientos: readonly VencimientoSemilla[],
) {
  await cargarEnOrden(
    puerto,
    'vencimientos',
    vencimientos,
    (vencimiento, orden) => ({ ...vencimiento, orden }),
    ({ obligacion, periodicidad }) => ({ obligacion, periodicidad }),
  )
}
