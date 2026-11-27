import { type TipoDeDestino, validarDestino } from '@/compartido/dominio/destino-de-enlace'
import type { Imagen } from '@/compartido/dominio/imagen'

// Ítem del menú tal como se guarda en el panel.
export interface ItemDeMenuGuardado {
  etiqueta: string
  tipo: TipoDeDestino
  destino: string | null
  abrirEnNuevaPestana: boolean
  imagen: Imagen | null
}

// Ítem listo para dibujar. `seccion` es el id del ancla en el inicio (para marcar la activa).
export interface ItemDeMenu {
  etiqueta: string
  href: string
  seccion: string | null
  externo: boolean
  nuevaPestana: boolean
  imagen: Imagen | null
}

// Las secciones viven en el inicio: se enlazan como `/#ancla` para que el menú funcione
// también desde la guía o el blog. Un destino inválido no se publica (el panel lo impide).
export function resolverItemDeMenu(guardado: ItemDeMenuGuardado): ItemDeMenu | null {
  const { destino, tipo } = guardado
  if (!destino || validarDestino(tipo, destino) !== null) return null

  const esSeccion = tipo === 'seccion'
  return {
    etiqueta: guardado.etiqueta,
    href: esSeccion ? `/${destino}` : destino,
    seccion: esSeccion ? destino.slice(1) : null,
    externo: tipo === 'externa',
    nuevaPestana: guardado.abrirEnNuevaPestana,
    imagen: guardado.imagen,
  }
}
