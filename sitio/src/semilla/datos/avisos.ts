import type { AvisoSemilla } from './tipos'

// Avisos de la guía de clientes, transcritos de sus imágenes (`one_clients.jpg` y
// `tercer_clients.jpg`). El modelo de avisos tiene una sola lista de documentos, así que los
// «documentos para análisis» del cierre tributario van en un aviso propio y la nota sobre los
// tres días hábiles va en «cuándo aplica».

const lista = (...textos: string[]): AvisoSemilla['documentos'] =>
  textos.map((texto) => ({ texto }))

const CORREO_CONTABILIDAD = 'contabilidad@jjmm.com.pe'
const INICIO_DEL_CIERRE_TRIBUTARIO = 'Inicia del 1.º al 5.º día útil de cada mes.'

const CIERRE_TRIBUTARIO: AvisoSemilla = {
  titulo: 'Cierre tributario',
  cuandoAplica: `${INICIO_DEL_CIERRE_TRIBUTARIO}\n\nA la recepción de la documentación se tomará 03 días hábiles, para una liquidación preliminar. Si hay alguna observación en la documentación recibida se informará con tiempo para que pueda subsanar a la declaración.`,
  documentos: lista(
    'Comprobantes de compras',
    'Comprobantes de ventas',
    'Estados de cuenta bancarios',
    'Liquidaciones de caja chica',
    'Entregas a rendir',
    'Recibos de pago',
    'Contratos',
    'Préstamos bancarios',
  ),
  correoDeContacto: CORREO_CONTABILIDAD,
  activo: true,
}

const DOCUMENTOS_PARA_ANALISIS: AvisoSemilla = {
  titulo: 'Cierre tributario: documentos para análisis',
  cuandoAplica: INICIO_DEL_CIERRE_TRIBUTARIO,
  documentos: lista(
    'Reporte de caja',
    'Estados de cuenta corriente (cheques, depósitos y transferencias)',
    'Cuentas por cobrar',
    'Cuentas por pagar',
    'Seguros',
    'Trabajos en curso',
    'Préstamos bancarios (cronogramas de pago)',
    'Préstamos de accionistas',
    'Rendiciones de cuentas',
    'Inventario de mercadería',
    'Pagos AFP',
    'Planilla (descuentos, tardanzas, vacaciones, CTS, etc.)',
  ),
  correoDeContacto: CORREO_CONTABILIDAD,
  activo: true,
}

// El correo de recursos humanos se publica hoy en la guía, pero su vigencia está por
// confirmar (L7).
const CIERRE_DE_PLANILLA: AvisoSemilla = {
  titulo: 'Cierre de planilla',
  cuandoAplica: 'Inicia el 20 de cada mes.',
  documentos: lista(
    'Reporte de ingresos, salidas y refrigerios',
    'Cálculo de horas mensual',
    'Cálculo de horas extras',
    'Descansos médicos emitidos por EsSalud y privados',
    'Permisos',
    'Vacaciones',
    'Descuentos',
    'Alta de nuevos colaboradores, alta de derechohabientes',
    'Afiliación a entidades privadas AFP - ONP',
    'Pagos SCTR',
    'Pagos EPS',
    'Pagos EsSalud Vida',
    'Liquidación de beneficios sociales',
    'Actualización de pendientes referente a planillas',
    'Cronograma de vacaciones de los colaboradores',
    'Cuentas de CTS, si fuese el caso',
  ),
  correoDeContacto: 'recursoshumanos@jjmm.com.pe',
  activo: true,
}

export const AVISOS: readonly AvisoSemilla[] = [
  CIERRE_TRIBUTARIO,
  DOCUMENTOS_PARA_ANALISIS,
  CIERRE_DE_PLANILLA,
]
