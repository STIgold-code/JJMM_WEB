import type { VencimientoSemilla } from './tipos'

// Vencimientos tributarios de la guía (`two_clients.jpg`), tal como se publican hoy. El
// cronograma oficial de SUNAT por dígito del RUC queda pendiente (L7), por eso
// `cronogramas-sunat` no se carga.

// La imagen nombra estas obligaciones sin fecha; el campo «cuándo vence» es obligatorio.
const SIN_FECHA_PUBLICADA = 'Consulta la fecha con el estudio.'

const mensual = (obligacion: string, cuandoVence: string): VencimientoSemilla => ({
  obligacion,
  periodicidad: 'mensual',
  cuandoVence,
})

const anual = (obligacion: string, cuandoVence: string): VencimientoSemilla => ({
  obligacion,
  periodicidad: 'anual',
  cuandoVence,
})

export const VENCIMIENTOS: readonly VencimientoSemilla[] = [
  mensual('PDT 621 (IGV y Renta)', 'Los 07 de cada mes.'),
  mensual('PLAME', 'Inicio de las declaraciones mensuales, los 01 de cada mes.'),
  mensual('Vencimientos de AFP', 'Inicio de las declaraciones mensuales, los 03 de cada mes.'),
  mensual('Libros electrónicos', 'Inicio de las declaraciones mensuales, los 10 de cada mes.'),
  mensual('Depósito de detracciones', 'Hasta el 5.º día útil de cada mes.'),
  mensual('CONAFOVICER', SIN_FECHA_PUBLICADA),
  mensual('SENCICO', SIN_FECHA_PUBLICADA),
  mensual('OSCE', SIN_FECHA_PUBLICADA),
  anual('Declaración jurada anual', 'Inicia la declaración el 01 de marzo.'),
  anual('DAOT', 'Inicia la declaración el 01 de marzo.'),
  anual('ITAN', 'Inicia la declaración el 01 de abril.'),
  anual('SENCICO', 'Inicia la declaración el 01 de marzo.'),
  anual('Precio de transferencia', 'Inicia la declaración el 01 de abril.'),
  anual('INEI', 'Inicia la declaración según solicitud del INEI.'),
]
