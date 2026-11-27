import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import type { EstadoActual } from '../dominio/item-actual'
import type { ItemDeMenu } from '../dominio/item-de-menu'

interface PropsEnlaceDeMenu {
  item: ItemDeMenu
  actual: EstadoActual
  // 'cabecera': el logo reemplaza a la etiqueta. 'panel': etiqueta y logo decorativo.
  variante: 'cabecera' | 'panel'
  alElegir?: () => void
}

function Contenido({ item, variante }: Pick<PropsEnlaceDeMenu, 'item' | 'variante'>) {
  const { imagen } = item
  if (!imagen) return <>{item.etiqueta}</>
  const enCabecera = variante === 'cabecera'
  return (
    <>
      {enCabecera ? null : item.etiqueta}
      <Image
        src={imagen.url}
        alt={enCabecera ? imagen.alt || item.etiqueta : ''}
        width={imagen.ancho}
        height={imagen.alto}
      />
    </>
  )
}

// Sección (`/#ancla`) y externo con <a>; página interna con <Link> para navegar sin recargar.
export function EnlaceDeMenu({ item, actual, variante, alElegir }: PropsEnlaceDeMenu) {
  const contenido: ReactNode = (
    <>
      <Contenido item={item} variante={variante} />
      {item.nuevaPestana ? <span className="oculto"> (se abre en una pestaña nueva)</span> : null}
    </>
  )
  const comunes = { 'aria-current': actual, onClick: alElegir }
  if (item.externo || item.seccion !== null) {
    const nueva = item.nuevaPestana ? { target: '_blank' } : {}
    const rel = item.externo ? 'noopener' : undefined
    return (
      <a href={item.href} rel={rel} {...nueva} {...comunes}>
        {contenido}
      </a>
    )
  }
  return (
    <Link href={item.href} {...comunes}>
      {contenido}
    </Link>
  )
}
