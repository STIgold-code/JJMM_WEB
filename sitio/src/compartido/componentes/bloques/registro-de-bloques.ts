import type { ReactNode } from 'react'

// Forma mínima que Payload entrega para cualquier bloque de un campo `blocks`.
export interface BloqueBase {
  blockType: string
  id?: string | null
  blockName?: string | null
}

// Interfaz de props común a todos los bloques (principio de sustitución de Liskov):
// cualquier componente registrado se dibuja igual, recibiendo solo su bloque.
export interface PropsDeBloque<B extends BloqueBase> {
  bloque: B
}

export type ComponenteDeBloque<B extends BloqueBase> = (
  props: PropsDeBloque<B>,
) => ReactNode | Promise<ReactNode>

// Registro `tipo → componente` (principio abierto/cerrado): un bloque nuevo se agrega con
// una entrada más, sin modificar los componentes existentes. El tipo exige una entrada por
// cada tipo de la unión B, así que olvidar registrar un bloque es un error de compilación.
export type RegistroDeBloques<B extends BloqueBase> = {
  readonly [T in B['blockType']]: ComponenteDeBloque<Extract<B, { blockType: T }>>
}

export class TipoDeBloqueDesconocidoError extends Error {
  readonly tipo: string

  constructor(tipo: string) {
    super(`No hay un componente registrado para el bloque «${tipo}».`)
    this.name = 'TipoDeBloqueDesconocidoError'
    this.tipo = tipo
  }
}

// Solo llega aquí un tipo sin registrar si hay datos guardados de un bloque que ya se quitó
// del código. Se falla de forma explícita en lugar de omitir la sección sin aviso.
export function buscarComponenteDeBloque<B extends BloqueBase>(
  registro: RegistroDeBloques<B>,
  bloque: B,
): ComponenteDeBloque<B> {
  const tipo = bloque.blockType
  if (!Object.hasOwn(registro, tipo)) throw new TipoDeBloqueDesconocidoError(tipo)

  // `as` justificado: el tipo mapeado garantiza que la entrada de `tipo` acepta exactamente
  // el bloque de ese tipo, pero TypeScript no puede correlacionar la clave con la variante
  // de la unión (microsoft/TypeScript#30581).
  return registro[tipo as B['blockType']] as ComponenteDeBloque<B>
}
