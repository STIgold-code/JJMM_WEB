'use client'

import type { DatosDeEdicionDeArea } from '../../aplicacion/consultar-areas'
import { RUTA_DE_AREAS } from '../../dominio/areas-de-servicio'
import { erroresEnVivoDeArea } from '../../dominio/formulario-de-area'
import { vistaPreviaDeArea } from '../../dominio/vista-previa-de-area'
import { AvisoDeSalida } from '../comunes/aviso-de-salida'
import { BarraDeGuardado } from '../comunes/barra-de-guardado'
import { CabeceraDeEdicion } from '../comunes/cabecera-de-edicion'
import { CodigoDeArea } from './codigo-de-area'
import { DatosDelArea } from './datos-del-area'
import { GajoDelArea } from './gajo-del-area'
import { PuntosDelArea } from './puntos-del-area'
import { useEdicionDeArea } from './use-edicion-de-area'
import { VistaPreviaDelArea } from './vista-previa-del-area'

// Edición de un área en una sola página (maqueta «Editar área»): datos, «Qué incluye», gajo en la
// rueda y vista previa de «Nuestros servicios», con la barra de guardado y aviso al salir con
// cambios. El código es fijo y las áreas no se eliminan: son los gajos de la rueda.
export function EdicionDeArea({ datos }: { datos: DatosDeEdicionDeArea }) {
  const { raiz, edicion, cambios } = useEdicionDeArea(datos.area.id, datos.formulario)
  const { formulario, sucio } = edicion
  // Lo que dijo el servidor de un campo gana a lo detectado en vivo.
  const errores = { ...erroresEnVivoDeArea(formulario), ...edicion.errores }
  const vista = vistaPreviaDeArea({ ...datos, idDelArea: datos.area.id, formulario })
  return (
    <form
      ref={raiz}
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault()
        edicion.guardar()
      }}
    >
      <CabeceraDeEdicion
        volverA={{ ruta: RUTA_DE_AREAS, texto: 'Áreas de servicio' }}
        prefijo={<CodigoDeArea codigo={datos.area.codigo} enTitulo />}
        titulo={formulario.nombre.trim() || 'Sin nombre'}
        bajada="Lo que cambies aquí se ve en la pestaña de esta área y al pulsar su gajo en la rueda SIGE Mype."
      />
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 amplio:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
          <DatosDelArea formulario={formulario} errores={errores} cambios={cambios} />
          <PuntosDelArea formulario={formulario} errores={errores} cambios={cambios} />
          <GajoDelArea formulario={formulario} errores={errores} cambios={cambios} />
        </div>
        <VistaPreviaDelArea vista={vista} rueda={datos.rueda} />
      </div>
      <BarraDeGuardado
        sucio={sucio}
        guardando={edicion.guardando}
        guardadoRecien={edicion.guardadoRecien}
        alDescartar={edicion.descartar}
      />
      <AvisoDeSalida sucio={sucio} />
    </form>
  )
}
