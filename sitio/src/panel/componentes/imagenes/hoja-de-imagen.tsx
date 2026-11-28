'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { guardarElTextoAlternativo } from '../../acciones/imagenes'
import type { ImagenConUsos } from '../../aplicacion/consultar-imagenes'
import { LARGO_MAXIMO_DEL_ALT } from '../../dominio/subida-de-imagenes'
import { AreaDeTexto } from '../comunes/area-de-texto'
import { HojaDeEdicion } from '../comunes/hoja-de-edicion'
import { useFormularioEnHoja } from '../comunes/use-formulario-en-hoja'
import { DatosDeLaImagen } from './datos-de-la-imagen'
import { EliminarImagen } from './eliminar-imagen'
import { ID_DE_LA_GALERIA, idDeLaImagen } from './ids-de-imagenes'

interface Props {
  imagen: ImagenConUsos | null
  puedeEliminar: boolean
  rutaAlCerrar: string
}

interface PropsDeEdicion {
  imagen: ImagenConUsos
  abierta: boolean
  puedeEliminar: boolean
  alCerrar: () => void
}

// El panel se abre desde la URL: al cerrarlo el foco vuelve a la tarjeta de la imagen o, si ya no
// está en la página, a la galería.
function devolverFoco(evento: Event, id: number): void {
  evento.preventDefault()
  const destino =
    document.getElementById(idDeLaImagen(id)) ??
    document.getElementById(ID_DE_LA_GALERIA) ??
    document.getElementById('contenido')
  destino?.focus()
}

const hayCambios = (original: { alt: string }, actual: { alt: string }) =>
  original.alt.trim() !== actual.alt.trim()

function EdicionDeLaImagen({ imagen, abierta, puedeEliminar, alCerrar }: PropsDeEdicion) {
  const edicion = useFormularioEnHoja({
    inicial: { alt: imagen.alt },
    hayCambios,
    guardarEnServidor: (formulario) => guardarElTextoAlternativo(imagen.id, formulario),
    alGuardar: alCerrar,
  })
  const eliminable = puedeEliminar && imagen.usos.length === 0
  return (
    <HojaDeEdicion
      abierta={abierta}
      alCerrar={alCerrar}
      alCerrarFoco={(evento) => devolverFoco(evento, imagen.id)}
      titulo={imagen.nombre}
      descripcion="Revisa su texto alternativo: es lo que leen los lectores de pantalla y Google."
      sucio={edicion.sucio}
      guardando={edicion.guardando}
      textoDeGuardar="Guardar texto"
      alGuardar={edicion.guardar}
      eliminar={
        eliminable ? (
          <EliminarImagen id={imagen.id} nombre={imagen.nombre} alEliminar={alCerrar} />
        ) : undefined
      }
    >
      <DatosDeLaImagen imagen={imagen} puedeEliminar={puedeEliminar} />
      <AreaDeTexto
        id="imagen-alt"
        etiqueta="Texto alternativo"
        rows={3}
        maxLength={LARGO_MAXIMO_DEL_ALT}
        value={edicion.formulario.alt}
        onChange={(evento) => edicion.cambiar('alt', evento.target.value)}
        ayuda="Describe lo que se ve, en una frase. Si es un logotipo, escribe el nombre de la empresa."
        error={edicion.errores.alt}
      />
    </HojaDeEdicion>
  )
}

// Panel lateral con la imagen abierta (`?imagen=<id>`). Cerrarlo quita el id de la URL; la última
// imagen se conserva mientras dura la animación de salida.
export function HojaDeImagen({ imagen, puedeEliminar, rutaAlCerrar }: Props) {
  const router = useRouter()
  const [cerrada, setCerrada] = useState<number | null>(null)
  const [visible, setVisible] = useState<ImagenConUsos | null>(null)
  if (imagen && visible !== imagen) setVisible(imagen)
  if (!imagen && cerrada !== null) setCerrada(null)
  const abierta = imagen !== null && cerrada !== imagen.id

  function cerrar(): void {
    if (imagen) setCerrada(imagen.id)
    router.replace(rutaAlCerrar, { scroll: false })
  }

  if (!visible) return null
  return (
    <EdicionDeLaImagen
      key={visible.id}
      imagen={visible}
      abierta={abierta}
      puedeEliminar={puedeEliminar}
      alCerrar={cerrar}
    />
  )
}
