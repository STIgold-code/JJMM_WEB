import type { ImagenConUsos } from '../../aplicacion/consultar-imagenes'
import { resumenDeImagen, tamanoLegible } from '../../dominio/selector-de-imagen'
import { esLogotipo } from '../../dominio/usos-de-imagenes'
import { MiniaturaDeImagen } from '../comunes/miniatura-de-imagen'

interface Props {
  imagen: ImagenConUsos
  puedeEliminar: boolean
}

const TIPOS: Readonly<Record<string, string>> = {
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
  'image/avif': 'AVIF',
  'image/svg+xml': 'SVG',
  'image/gif': 'GIF',
}

function detalleDelArchivo({ ancho, alto, tamano, mime }: ImagenConUsos): string {
  const partes = [resumenDeImagen({ ancho, alto })]
  if (tamano) partes.push(tamanoLegible(tamano))
  if (mime) partes.push(TIPOS[mime] ?? mime)
  return partes.join(' · ')
}

function SeUsaEn({ imagen, puedeEliminar }: Props) {
  if (imagen.usos.length === 0)
    return (
      <dd>No se usa en el sitio.{puedeEliminar && ' Puedes eliminarla si ya no la necesitas.'}</dd>
    )
  return (
    <dd className="grid gap-1">
      <ul className="list-disc pl-5">
        {imagen.usos.map((uso) => (
          <li key={`${uso.lugar}-${uso.texto}`}>{uso.texto}</li>
        ))}
      </ul>
      {puedeEliminar && (
        <p className="text-[0.8125rem] text-muted-foreground">
          Para eliminarla, primero reemplázala en esos lugares.
        </p>
      )}
    </dd>
  )
}

// Cabecera del panel lateral de una imagen: vista previa más grande, dónde se usa y los datos del
// archivo que guarda la colección.
export function DatosDeLaImagen({ imagen, puedeEliminar }: Props) {
  return (
    <>
      <MiniaturaDeImagen
        url={imagen.url}
        alt={imagen.alt}
        sizes="(max-width: 640px) 100vw, 32rem"
        entera={esLogotipo(imagen.usos, imagen.mime)}
        className="max-h-64 rounded-md border bg-muted"
      />
      <dl className="grid gap-3 text-sm [&_dt]:font-semibold">
        <div className="grid gap-1">
          <dt>Se usa en</dt>
          <SeUsaEn imagen={imagen} puedeEliminar={puedeEliminar} />
        </div>
        <div className="grid gap-1">
          <dt>Archivo</dt>
          <dd className="text-muted-foreground">{detalleDelArchivo(imagen)}</dd>
        </div>
      </dl>
    </>
  )
}
