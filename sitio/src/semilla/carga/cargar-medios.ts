import { claveDeMedio } from '../datos/medios-referenciados'
import type { ClaveDeMedio, MedioSemilla } from '../datos/tipos'
import { asegurar, type IdDeDocumento, type PuertoDeCarga } from '../puerto-de-carga'

export class MedioNoCargadoError extends Error {
  constructor(clave: ClaveDeMedio) {
    super(`La semilla usa el medio «${clave}», que no está en la lista de medios.`)
    this.name = 'MedioNoCargadoError'
  }
}

// Id de Payload de cada medio, por el nombre de su archivo.
export class IdsDeMedios {
  constructor(private readonly ids: ReadonlyMap<ClaveDeMedio, IdDeDocumento>) {}

  de(clave: ClaveDeMedio): IdDeDocumento {
    const id = this.ids.get(clave)
    if (id === undefined) throw new MedioNoCargadoError(clave)
    return id
  }

  opcional(clave: ClaveDeMedio | undefined): IdDeDocumento | null {
    return clave === undefined ? null : this.de(clave)
  }
}

// Payload guarda el nombre del archivo subido en `filename`: es la clave natural del medio.
// Si ya existe, solo se actualiza el texto alternativo; el archivo no se vuelve a subir.
export async function cargarMedios(
  puerto: PuertoDeCarga,
  medios: readonly MedioSemilla[],
  resolverRuta: (archivo: string) => string,
): Promise<IdsDeMedios> {
  const ids = new Map<ClaveDeMedio, IdDeDocumento>()
  for (const { archivo, alt } of medios) {
    const clave = claveDeMedio(archivo)
    const id = await asegurar(puerto, 'medios', { filename: clave }, { alt }, resolverRuta(archivo))
    ids.set(clave, id)
  }
  return new IdsDeMedios(ids)
}
