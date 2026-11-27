import type { DatosDeMensajes } from '../../aplicacion/consultar-mensajes'
import { fechaRelativa } from '../../dominio/fechas-del-panel'
import { textoDeListaVacia } from '../../dominio/lista-de-mensajes'
import { type ConsultaDeMensajes, rutaDeMensajes } from '../../dominio/mensajes'
import { BuscadorDeMensajes } from './buscador-de-mensajes'
import { FiltrosDeMensajes } from './filtros-de-mensajes'
import { HojaDelMensaje } from './hoja-del-mensaje'
import { ID_DE_LISTA } from './ids-de-mensajes'
import { PieDelListado } from './pie-del-listado'
import { SinMensajes } from './sin-mensajes'
import { TablaDeMensajes } from './tabla-de-mensajes'

interface Props {
  consulta: ConsultaDeMensajes
  datos: DatosDeMensajes
  puedeEliminar: boolean
  ahora: Date
}

function Listado({ consulta, datos, ahora }: Omit<Props, 'puedeEliminar'>) {
  return (
    <section
      id={ID_DE_LISTA}
      aria-label="Lista de mensajes"
      tabIndex={-1}
      className="rounded-lg border bg-card text-card-foreground shadow-sm outline-none"
    >
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-[0.85rem]">
        <FiltrosDeMensajes
          filtros={datos.filtros}
          actual={consulta.filtro}
          busqueda={consulta.busqueda}
        />
        <BuscadorDeMensajes busqueda={consulta.busqueda} filtro={consulta.filtro} />
      </div>
      <TablaDeMensajes
        mensajes={datos.mensajes}
        consulta={{ ...consulta, pagina: datos.paginacion.pagina }}
        ahora={ahora}
        textoVacio={textoDeListaVacia(consulta.filtro, consulta.busqueda)}
      />
      <PieDelListado paginacion={datos.paginacion} consulta={consulta} />
    </section>
  )
}

// Pantalla «Mensajes de contacto» (presentación): cabecera, listado con filtros y buscador, y el
// panel lateral con el mensaje abierto. Todo llega ya leído con los permisos de quien entra.
export function PantallaDeMensajes({ consulta, datos, puedeEliminar, ahora }: Props) {
  const { seleccionado } = datos
  return (
    <>
      <div className="mb-6 grid gap-1">
        <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance max-sm:text-2xl">
          Mensajes de contacto
        </h1>
        <p className="max-w-[60ch] text-muted-foreground">
          Lo que la gente escribe en «Contáctanos» del sitio. Respóndele por WhatsApp o por llamada
          y marca el mensaje como atendido.
        </p>
      </div>
      {datos.hayMensajes ? (
        <Listado consulta={consulta} datos={datos} ahora={ahora} />
      ) : (
        <SinMensajes />
      )}
      <HojaDelMensaje
        mensaje={seleccionado}
        recibido={seleccionado ? fechaRelativa(new Date(seleccionado.recibido), ahora) : null}
        puedeEliminar={puedeEliminar}
        rutaAlCerrar={rutaDeMensajes({ ...consulta, mensaje: null })}
      />
    </>
  )
}
