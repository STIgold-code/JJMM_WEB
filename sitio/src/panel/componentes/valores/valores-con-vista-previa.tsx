'use client'

import { Plus, Star } from 'lucide-react'

import { ordenarLosValores } from '../../acciones/valores'
import type { DatosDeValores } from '../../aplicacion/consultar-valores'
import { RUTA_DE_LA_PAGINA_DE_INICIO } from '../../dominio/rutas-del-panel'
import type { ValorDelPanel } from '../../dominio/valores'
import { CabeceraDeEdicion } from '../comunes/cabecera-de-edicion'
import { EstadoVacio } from '../comunes/estado-vacio'
import { useArrastre } from '../comunes/use-arrastre'
import { type AccionesDeLaLista, useListaOrdenable } from '../comunes/use-lista-ordenable'
import { usePanelAbierto } from '../guia/use-panel-abierto'
import { Button } from '../ui/button'
import { FilaDeValor } from './fila-de-valor'
import { HojaDeValor } from './hoja-de-valor'
import { VistaPreviaDeValores } from './vista-previa-de-valores'

const ACCIONES: AccionesDeLaLista = { ordenar: ordenarLosValores }

interface PropsDeLista {
  valores: ValorDelPanel[]
  alEditar: (id: number) => void
  alMover: (desde: number, hacia: number, paso?: -1 | 1) => void
}

function Filas({ valores, alEditar, alMover }: PropsDeLista) {
  const { propsDeFila, propsDeAsa } = useArrastre((desde, hacia) => alMover(desde, hacia))
  return (
    <table className="w-full border-collapse text-sm max-sm:block">
      <thead className="sr-only">
        <tr>
          <th scope="col">Orden</th>
          <th scope="col">Valor</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody className="max-sm:block">
        {valores.map((valor, indice) => (
          <FilaDeValor
            key={valor.id}
            valor={valor}
            indice={indice}
            total={valores.length}
            alEditar={alEditar}
            alMover={alMover}
            propsDeFila={propsDeFila(indice)}
            propsDeAsa={propsDeAsa(indice)}
          />
        ))}
      </tbody>
    </table>
  )
}

function Lista(props: PropsDeLista) {
  const cantidad = props.valores.length
  return (
    <section
      aria-label="Lista de valores"
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      {cantidad > 0 ? (
        <Filas {...props} />
      ) : (
        <EstadoVacio
          Icono={Star}
          titulo="Todavía no hay valores"
          texto="Aquí aparecen las razones de «¿Por qué elegirnos?», cada una con su ícono. Crea la primera con «Nuevo valor»."
        />
      )}
      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t px-4 py-3 text-[0.8125rem] text-muted-foreground">
        <span>{`${cantidad} ${cantidad === 1 ? 'valor' : 'valores'}`}</span>
        <span>Arrastra o usa las flechas para ordenar; el cambio se guarda solo.</span>
      </div>
    </section>
  )
}

interface Props {
  datos: DatosDeValores
  // Lo decide el servidor con el rol de la sesión; la acción de borrar lo vuelve a comprobar.
  puedeEliminar: boolean
}

// Pantalla «Valores» (maqueta): la lista ordenable (guardada al instante), la vista previa de
// «¿Por qué elegirnos?» en el orden de la lista y el panel lateral para crear o editar.
export function ValoresConVistaPrevia({ datos, puedeEliminar }: Props) {
  const { elementos, anuncio, mover } = useListaOrdenable(datos.valores, ACCIONES)
  const panel = usePanelAbierto(datos.valores)
  return (
    <>
      <CabeceraDeEdicion
        volverA={{ ruta: RUTA_DE_LA_PAGINA_DE_INICIO, texto: 'Página de inicio' }}
        titulo="Valores"
        bajada="Las razones que muestra «¿Por qué elegirnos?», cada una con su ícono, en este orden. El título y la bajada de esa sección se editarán desde Página de inicio."
        accion={
          <Button type="button" onClick={panel.abrirNuevo}>
            <Plus aria-hidden="true" />
            Nuevo valor
          </Button>
        }
      />
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 amplio:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <Lista valores={elementos} alEditar={panel.abrir} alMover={mover} />
        <VistaPreviaDeValores valores={elementos} textos={datos.textos} />
      </div>
      <p aria-live="assertive" className="sr-only">
        {anuncio}
      </p>
      {panel.hayPanel && (
        <HojaDeValor
          key={panel.clave}
          valor={panel.editado}
          puedeEliminar={puedeEliminar}
          alCerrar={panel.cerrar}
        />
      )}
    </>
  )
}
