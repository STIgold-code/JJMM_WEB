import { cn } from 'cn'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface Props {
  // Dirección de `medios` (`/api/medios/file/...`) o un `blob:` local (vista previa al subir).
  url: string | null
  alt: string
  // `sizes` de `next/image`: el ancho con que se dibuja, para no bajar el original.
  sizes: string
  // Los logotipos se ven enteros sobre blanco; las fotos llenan el recuadro.
  entera?: boolean
  className?: string
}

// Miniatura de una imagen del panel en un recuadro de proporción fija. Las de `medios` pasan por
// el optimizador de Next (AVIF o WebP al ancho pedido); una vista previa local no.
export function MiniaturaDeImagen({ url, alt, sizes, entera = false, className }: Props) {
  return (
    <span
      className={cn(
        'relative grid aspect-[4/3] w-full place-items-center overflow-hidden bg-white',
        className,
      )}
    >
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          sizes={sizes}
          unoptimized={url.startsWith('blob:')}
          className={entera ? 'object-contain p-3' : 'object-cover'}
        />
      ) : (
        <ImageIcon aria-hidden="true" strokeWidth={1.5} className="size-8 text-muted-foreground" />
      )}
    </span>
  )
}
