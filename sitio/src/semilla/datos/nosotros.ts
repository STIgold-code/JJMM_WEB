import { archivoDeLogoDeCliente, NOMBRES_DE_CLIENTES } from './medios'
import type { ClienteSemilla, ValorSemilla } from './tipos'

// Valores de «¿Por qué elegirnos?» con el ícono que usa el inicio v4.
export const VALORES: readonly ValorSemilla[] = [
  { nombre: 'Excelencia', icono: 'pulgar' },
  { nombre: 'Compromiso', icono: 'trofeo' },
  { nombre: 'Innovación', icono: 'foco' },
  { nombre: 'Confidencialidad', icono: 'candado' },
  { nombre: 'Equidad', icono: 'balanza' },
  { nombre: 'Trabajo en equipo', icono: 'equipo' },
]

// Los 11 logotipos de clientes del inicio v4, en su orden.
export const CLIENTES: readonly ClienteSemilla[] = NOMBRES_DE_CLIENTES.map((nombre, indice) => ({
  nombre,
  logo: archivoDeLogoDeCliente(indice),
}))
