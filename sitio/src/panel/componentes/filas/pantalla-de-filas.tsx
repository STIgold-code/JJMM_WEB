'use client'

import { Plus } from 'lucide-react'
import { type ComponentProps, useState } from 'react'

import type { DatosDeLasFilas } from '../../aplicacion/consultar-planes'
import {
  conocidasDe,
  type FilaDelFormulario,
  formularioDeFilas,
  vistaPreviaDeFilas,
} from '../../dominio/filas-de-la-tabla'
import { RUTA_DE_PLANES } from '../../dominio/planes'
import { ERROR_DE_TABLA_CAMBIADA, type ErroresDeFilas } from '../../dominio/validacion-de-filas'
import { AvisoDeSalida } from '../comunes/aviso-de-salida'
import { BarraDeGuardado } from '../comunes/barra-de-guardado'
import { CabeceraDeEdicion } from '../comunes/cabecera-de-edicion'
import type { EdicionEnPagina } from '../comunes/use-edicion-en-pagina'
import { useFocoDeListaEditable } from '../comunes/use-foco-de-lista-editable'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import { AvisoDePaginaCambiada } from '../pagina-de-inicio/aviso-de-pagina-cambiada'
import { VistaPrevia } from '../planes/vista-previa'
import { Button } from '../ui/button'
import { idDeLaFila } from './fila-de-la-tabla'
import { ListaDeFilas } from './lista-de-filas'
import { QuitarFila } from './quitar-fila'
import { useEdicionDeFilas } from './use-edicion-de-filas'

const ID_DE_AGREGAR = 'agregar-fila'

function Pie({ total, alAgregar }: { total: number; alAgregar: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t px-4 py-3 text-[0.8125rem] text-muted-foreground">
      <Button
        id={ID_DE_AGREGAR}
        type="button"
        variant="outline"
        size="sm"
        className="bg-card"
        onClick={alAgregar}
      >
        <Plus aria-hidden="true" />
        Agregar fila
      </Button>
      <span>{`${total} ${total === 1 ? 'fila' : 'filas'} · Los cambios se aplican al guardar.`}</span>
    </div>
  )
}

// Si otra persona cambió las filas mientras tanto, el servidor no guardó: aviso fijo con
// «Recargar la página», como en «Página de inicio».
function Cabecera({ tablaCambiada }: { tablaCambiada: boolean }) {
  return (
    <>
      <CabeceraDeEdicion
        volverA={{ ruta: RUTA_DE_PLANES, texto: 'Planes' }}
        titulo="Filas de la tabla"
        bajada="Lo que se compara en «Nuestros planes»: las filas son las mismas para todos los planes. Qué incluye cada plan en cada fila se marca al editar el plan."
      />
      {tablaCambiada && <AvisoDePaginaCambiada texto={ERROR_DE_TABLA_CAMBIADA} />}
    </>
  )
}

// Barra de guardado al pie y aviso al salir con cambios sin guardar.
function Guardado({ edicion }: { edicion: EdicionEnPagina<FilaDelFormulario[], ErroresDeFilas> }) {
  return (
    <>
      <BarraDeGuardado
        sucio={edicion.sucio}
        guardando={edicion.guardando}
        guardadoRecien={edicion.guardadoRecien}
        alDescartar={edicion.descartar}
      />
      <AvisoDeSalida sucio={edicion.sucio} />
    </>
  )
}

type PropsDeColumnas = ComponentProps<typeof ListaDeFilas> & { alAgregar: () => void }

// La lista de filas y, al costado, la vista previa de la tabla del sitio con lo escrito.
function Columnas(props: PropsDeColumnas) {
  const { filas, datos } = props
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 amplio:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      <TarjetaDelPanel
        idDelTitulo="titulo-filas"
        titulo="Filas"
        bajada="Cambia el nombre en la misma fila, ordénalas o quita las que ya no ofreces. Nunca escribas montos: el sitio muestra «Consultar»."
      >
        <ListaDeFilas {...props} />
        <Pie total={filas.length} alAgregar={props.alAgregar} />
      </TarjetaDelPanel>
      <VistaPrevia
        vista={vistaPreviaDeFilas(datos.planes, datos.inclusiones, filas)}
        textos={datos.textos}
      />
    </div>
  )
}

interface Props {
  datos: DatosDeLasFilas
  // Lo decide el servidor con el rol de la sesión; la acción lo vuelve a comprobar.
  puedeQuitar: boolean
}

// «Planes › Filas de la tabla» (maqueta): renombrar en la misma fila, ordenar, agregar y quitar
// (con un diálogo que dice qué tenía cada plan en esa fila); todo se aplica con «Guardar cambios».
export function PantallaDeFilas({ datos, puedeQuitar }: Props) {
  const { raiz, edicion, cambios, anuncio, errores, tablaCambiada } = useEdicionDeFilas(
    formularioDeFilas(datos.caracteristicas),
    conocidasDe(datos.caracteristicas),
  )
  const filas = edicion.formulario
  const [aQuitar, setAQuitar] = useState<FilaDelFormulario | null>(null)
  useFocoDeListaEditable(
    filas.map((f) => f.clave),
    idDeLaFila,
    ID_DE_AGREGAR,
  )
  return (
    <form
      ref={raiz}
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault()
        edicion.guardar()
      }}
    >
      <Cabecera tablaCambiada={tablaCambiada} />
      <Columnas
        {...{ filas, datos, errores, puedeQuitar, cambios }}
        alQuitar={setAQuitar}
        alAgregar={cambios.agregar}
      />
      <p aria-live="assertive" className="sr-only">
        {anuncio}
      </p>
      <QuitarFila
        fila={aQuitar}
        datos={datos}
        alQuitar={cambios.quitar}
        alCerrar={() => setAQuitar(null)}
      />
      <Guardado edicion={edicion} />
    </form>
  )
}
