// RUC peruano: 11 dígitos, prefijo que asigna SUNAT y dígito verificador (módulo 11).
const PATRON_RUC = /^\d{11}$/
const PREFIJOS_VALIDOS = ['10', '15', '16', '17', '20']
const PESOS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]

export class RucInvalidoError extends Error {
  constructor(ruc: string) {
    super(`El RUC «${ruc}» no es válido.`)
    this.name = 'RucInvalidoError'
  }
}

function digitoVerificador(primerosDiez: string): number {
  const suma = PESOS.reduce((total, peso, i) => total + peso * Number(primerosDiez[i]), 0)
  // 11 - resto da 10 u 11 en dos casos; SUNAT usa su último dígito (0 y 1).
  return (11 - (suma % 11)) % 10
}

export function esRucValido(valor: string): boolean {
  const ruc = valor.replace(/\s+/g, '')
  if (!PATRON_RUC.test(ruc)) return false
  if (!PREFIJOS_VALIDOS.includes(ruc.slice(0, 2))) return false
  return digitoVerificador(ruc.slice(0, 10)) === Number(ruc[10])
}

// Por qué un RUC no sirve, para orientar a quien lo escribe; null si es válido.
export type MotivoDeRucInvalido = 'vacio' | 'formato' | 'invalido'

export function motivoDeRucInvalido(valor: string): MotivoDeRucInvalido | null {
  const ruc = valor.replace(/\s+/g, '')
  if (ruc.length === 0) return 'vacio'
  if (!PATRON_RUC.test(ruc)) return 'formato'
  return esRucValido(ruc) ? null : 'invalido'
}

export function ultimoDigitoDelRuc(valor: string): number {
  if (!esRucValido(valor)) throw new RucInvalidoError(valor)
  return Number(valor.trim().slice(-1))
}
