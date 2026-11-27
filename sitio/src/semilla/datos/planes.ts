import type { CaracteristicaSemilla, CeldaSemilla, PlanSemilla } from './tipos'

// Planes y matriz del inicio v4 (`public/web/js/inicio.js`, listado FILAS). Sin montos (S9).

const plan = (nombre: string): PlanSemilla => ({
  nombre,
  destacado: false,
  mensajeDeConsulta: `Hola, quiero información del plan ${nombre}.`,
})

export const PLANES: readonly PlanSemilla[] = [
  plan('Emprende'),
  plan('SIGEMype I'),
  plan('SIGEMype II'),
  plan('SIGEMype Business'),
]

const S: CeldaSemilla = 'incluido'
const N: CeldaSemilla = 'no-incluido'
const texto = (valor: string): CeldaSemilla => ({ texto: valor })
const CONSULTAR = texto('Consultar')

type Fila = [nombre: string, ...celdas: CeldaSemilla[]]

// Una fila por característica; las celdas siguen el orden de PLANES.
const FILAS: Fila[] = [
  ['Para empresas con ventas anuales hasta de', CONSULTAR, CONSULTAR, CONSULTAR, CONSULTAR],
  [
    'Gestión integral de planilla hasta',
    texto('2 trabajadores'),
    texto('4 trabajadores'),
    texto('6 trabajadores'),
    texto('12 trabajadores'),
  ],
  ['Registro contable mensual de compras y ventas', S, S, S, S],
  ['Cálculo mensual del Impuesto a la Renta', S, S, S, S],
  ['Cálculo mensual del IGV', S, S, S, S],
  ['Cálculo y declaración mensual de la planilla electrónica', S, S, S, S],
  ['Declaración del PDT 621 (IGV y Renta)', S, S, S, S],
  ['Registro de Compras y Ventas en formato SUNAT', S, S, S, S],
  ['Libro Diario Simplificado mensual', S, S, S, S],
  ['Libro Diario y Libro Mayor mensual', N, S, S, S],
  ['Libro Bancos mensual', N, S, S, S],
  ['Otros libros obligatorios', N, N, S, S],
  ['Manejo de Kardex', N, N, N, S],
  ['Asesoría tributaria según tu régimen y sector', S, S, S, S],
  ['Asesoría tributaria y financiera en tu empresa', N, N, N, S],
  ['Elaboración y presentación de la DAOT', S, S, S, S],
  ['Impuesto a la Renta anual', N, N, N, S],
  ['Estados financieros intermedios', N, N, N, N],
  ['Una visita al mes para recoger y enviar documentación', N, N, S, S],
  ['Costo por trabajador adicional en planilla', CONSULTAR, CONSULTAR, CONSULTAR, CONSULTAR],
  ['Límite de registro de comprobantes de pago', CONSULTAR, CONSULTAR, CONSULTAR, CONSULTAR],
  ['Libros electrónicos', S, S, S, S],
]

export const CARACTERISTICAS: readonly CaracteristicaSemilla[] = FILAS.map(
  ([nombre, ...celdas]) => ({ nombre, celdas }),
)
