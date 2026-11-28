import type { AvisoDelPanel } from '../dominio/avisos-para-clientes'
import type { CronogramaDelPanel } from '../dominio/cronogramas-del-panel'
import type { VencimientoDelPanel } from '../dominio/vencimientos-del-panel'

// Lecturas de la pantalla «Guía de clientes», con los permisos de quien entra. Avisos y
// vencimientos, en el orden del panel.
export interface RepositorioDeLecturaDeLaGuia {
  listarAvisos(): Promise<AvisoDelPanel[]>
  listarVencimientos(): Promise<VencimientoDelPanel[]>
  listarCronogramas(): Promise<CronogramaDelPanel[]>
}

export interface DatosDeLaGuia {
  avisos: AvisoDelPanel[]
  vencimientos: VencimientoDelPanel[]
  // Del periodo más reciente al más antiguo.
  cronogramas: CronogramaDelPanel[]
}

const delMasReciente = (a: CronogramaDelPanel, b: CronogramaDelPanel) =>
  b.anio - a.anio || b.mes - a.mes

export async function obtenerGuiaDeClientes(
  repositorio: RepositorioDeLecturaDeLaGuia,
): Promise<DatosDeLaGuia> {
  const [avisos, vencimientos, cronogramas] = await Promise.all([
    repositorio.listarAvisos(),
    repositorio.listarVencimientos(),
    repositorio.listarCronogramas(),
  ])
  return { avisos, vencimientos, cronogramas: [...cronogramas].sort(delMasReciente) }
}
