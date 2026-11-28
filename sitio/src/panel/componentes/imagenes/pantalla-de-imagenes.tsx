import { ImageIcon } from 'lucide-react'

import type { DatosDeImagenes } from '../../aplicacion/consultar-imagenes'
import {
  type ConsultaDeImagenes,
  rutaDeImagenes,
  textoDeGaleriaVacia,
} from '../../dominio/imagenes'
import { EstadoVacio } from '../comunes/estado-vacio'
import { DialogoDeSubida } from './dialogo-de-subida'
import { GaleriaDeImagenes } from './galeria-de-imagenes'
import { HerramientasDeImagenes } from './herramientas-de-imagenes'
import { HojaDeImagen } from './hoja-de-imagen'
import { ID_DE_LA_GALERIA } from './ids-de-imagenes'
import { PieDeImagenes } from './pie-de-imagenes'

interface Props {
  consulta: ConsultaDeImagenes
  datos: DatosDeImagenes
  puedeEliminar: boolean
}

function Cabecera() {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="grid gap-1">
        <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance max-sm:text-2xl">
          Imágenes
        </h1>
        <p className="max-w-[60ch] text-muted-foreground">
          Todas las imágenes del sitio. Ábrelas para revisar su texto alternativo, que es lo que
          leen los lectores de pantalla y Google.
        </p>
      </div>
      <DialogoDeSubida />
    </div>
  )
}

function Galeria({ consulta, datos }: Omit<Props, 'puedeEliminar'>) {
  return (
    <section
      id={ID_DE_LA_GALERIA}
      aria-label="Biblioteca de imágenes"
      tabIndex={-1}
      className="rounded-lg border bg-card text-card-foreground shadow-sm outline-none"
    >
      <HerramientasDeImagenes
        filtros={datos.filtros}
        filtro={consulta.filtro}
        busqueda={consulta.busqueda}
      />
      <GaleriaDeImagenes
        imagenes={datos.imagenes}
        consulta={{ ...consulta, pagina: datos.paginacion.pagina }}
        textoVacio={textoDeGaleriaVacia(consulta.filtro, consulta.busqueda)}
      />
      <PieDeImagenes paginacion={datos.paginacion} consulta={consulta} />
    </section>
  )
}

// Pantalla «Imágenes» (presentación): cabecera con «Subir imágenes», galería con filtros por uso
// y buscador, y el panel lateral con la imagen abierta. Todo llega ya leído con los permisos de
// quien entra.
export function PantallaDeImagenes({ consulta, datos, puedeEliminar }: Props) {
  return (
    <>
      <Cabecera />
      {datos.hayImagenes ? (
        <Galeria consulta={consulta} datos={datos} />
      ) : (
        <section
          className="rounded-lg border bg-card shadow-sm"
          aria-label="Biblioteca de imágenes"
        >
          <EstadoVacio
            Icono={ImageIcon}
            titulo="Aún no hay imágenes"
            texto="Las imágenes que subas aparecerán aquí, listas para usarse en el inicio, los clientes y el blog."
          />
        </section>
      )}
      <HojaDeImagen
        imagen={datos.seleccionada}
        puedeEliminar={puedeEliminar}
        rutaAlCerrar={rutaDeImagenes({ ...consulta, imagen: null })}
      />
    </>
  )
}
