'use client'

import type { DatosDeLaPaginaDeInicio } from '../../aplicacion/consultar-pagina-de-inicio'
import type { SeccionDelPanel } from '../../dominio/pagina-de-inicio'
import { AvisoDeSalida } from '../comunes/aviso-de-salida'
import { BarraDeGuardado } from '../comunes/barra-de-guardado'
import { useArrastre } from '../comunes/use-arrastre'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import { AvisoDePaginaCambiada } from './aviso-de-pagina-cambiada'
import { FilaDeSeccion } from './fila-de-seccion'
import { useOrdenDeSecciones } from './use-orden-de-secciones'

interface PropsDeFilas {
  secciones: SeccionDelPanel[]
  ordenable: boolean
  alMover: (desde: number, hacia: number, paso?: -1 | 1) => void
}

function Filas({ secciones, ordenable, alMover }: PropsDeFilas) {
  const { propsDeFila, propsDeAsa } = useArrastre((desde, hacia) => alMover(desde, hacia))
  return (
    <ol aria-labelledby="titulo-secciones">
      {secciones.map((seccion, indice) => (
        <FilaDeSeccion
          key={seccion.clave}
          seccion={seccion}
          indice={indice}
          total={secciones.length}
          orden={
            ordenable
              ? { alMover, propsDeFila: propsDeFila(indice), propsDeAsa: propsDeAsa(indice) }
              : null
          }
        />
      ))}
    </ol>
  )
}

// Secciones del inicio en su orden, con orden por asa y flechas y «Guardar cambios» (maqueta
// «Página de inicio»). Si la página no se puede ordenar (una sola sección o sin ids), la lista
// se muestra sin controles de orden ni barra de guardado.
export function ListaDeSecciones({ datos }: { datos: DatosDeLaPaginaDeInicio }) {
  const edicion = useOrdenDeSecciones(datos.secciones, datos.actualizadoEn)
  return (
    <form
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault()
        if (edicion.sucio && !edicion.guardando) edicion.guardar()
      }}
    >
      {edicion.desactualizada && <AvisoDePaginaCambiada />}
      <TarjetaDelPanel
        idDelTitulo="titulo-secciones"
        titulo="Secciones"
        bajada="Las listas (áreas, planes, valores, clientes y sedes) se editan en su propia pantalla; aquí van los títulos y textos de cada sección."
      >
        <Filas secciones={edicion.secciones} ordenable={datos.ordenable} alMover={edicion.mover} />
      </TarjetaDelPanel>
      <p aria-live="assertive" className="sr-only">
        {edicion.anuncio}
      </p>
      {datos.ordenable && (
        <>
          <BarraDeGuardado
            sucio={edicion.sucio}
            guardando={edicion.guardando}
            guardadoRecien={edicion.guardadoRecien}
            alDescartar={edicion.descartar}
          />
          <AvisoDeSalida sucio={edicion.sucio} />
        </>
      )}
    </form>
  )
}
