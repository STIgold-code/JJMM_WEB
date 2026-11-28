'use client'

import type { DatosDeEdicionDeSede } from '../../aplicacion/consultar-sedes'
import {
  erroresEnVivoDeSede,
  type FormularioDeSede,
  unirErroresDeSede,
} from '../../dominio/formulario-de-sede'
import { RUTA_DE_SEDES } from '../../dominio/sedes'
import type { ErroresDeSede } from '../../dominio/validacion-de-sede'
import { vistaPreviaDeSede } from '../../dominio/vista-previa-de-sede'
import { AvisoDeSalida } from '../comunes/aviso-de-salida'
import { BarraDeGuardado } from '../comunes/barra-de-guardado'
import { CabeceraDeEdicion } from '../comunes/cabecera-de-edicion'
import { type CambiosDelFormulario, cambiosDelFormulario } from './cambios-del-formulario'
import { CelularesYCorreo } from './celulares-y-correo'
import { EliminarSede } from './eliminar-sede'
import { MapaDeLaSede } from './mapa-de-la-sede'
import { NombreYDireccion } from './nombre-y-direccion'
import { PublicacionDeSede } from './publicacion-de-sede'
import { useEdicionDeSede } from './use-edicion-de-sede'
import { VistaPreviaDeSede } from './vista-previa-de-sede'

interface Props {
  datos: DatosDeEdicionDeSede
  // Lo decide el servidor con el rol de la sesión; la acción de borrar lo vuelve a comprobar.
  puedeEliminar: boolean
}

function Cabecera({ nueva, nombre }: { nueva: boolean; nombre: string }) {
  return (
    <CabeceraDeEdicion
      volverA={{ ruta: RUTA_DE_SEDES, texto: 'Sedes' }}
      titulo={nombre.trim() || (nueva ? 'Nueva sede' : 'Sin nombre')}
      bajada={
        nueva
          ? 'Completa los datos y mira la vista previa antes de crearla. La sede se agrega al final de la lista.'
          : 'Lo que cambies aquí se ve en el pie del sitio y en la pestaña de esta sede en «Contáctanos».'
      }
    />
  )
}

interface PropsDeSecciones extends Props {
  formulario: FormularioDeSede
  errores: ErroresDeSede
  cambios: CambiosDelFormulario
}

// Columna de edición: las secciones de la maqueta y, para el administrador, el borrado.
function Secciones({ datos, puedeEliminar, formulario, errores, cambios }: PropsDeSecciones) {
  const { sede, otrasVisibles } = datos
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <NombreYDireccion
        formulario={formulario}
        errores={errores}
        alCambiar={cambios.cambiarTexto}
      />
      <CelularesYCorreo formulario={formulario} errores={errores} cambios={cambios} />
      <MapaDeLaSede
        mapa={formulario.mapa}
        error={errores.mapa}
        alCambiar={(mapa) => cambios.cambiarTexto('mapa', mapa)}
      />
      <PublicacionDeSede
        visible={formulario.visible}
        otrasVisibles={otrasVisibles}
        alCambiar={cambios.cambiarVisible}
      />
      {puedeEliminar && sede && (
        <EliminarSede
          id={sede.id}
          nombre={sede.nombre}
          ultimaVisible={sede.visible && otrasVisibles === 0}
        />
      )}
    </div>
  )
}

// Edición (o creación) de una sede en una sola página: nombre y dirección, celulares y correo,
// mapa y publicación, con la vista previa de su pestaña en «Contáctanos», la barra de guardado
// al pie y aviso al salir con cambios sin guardar.
export function EdicionDeSede({ datos, puedeEliminar }: Props) {
  const idDeLaSede = datos.sede?.id ?? null
  const { raiz, formulario, sucio, ...edicion } = useEdicionDeSede(idDeLaSede, datos.formulario)
  const cambios = cambiosDelFormulario(edicion.setFormulario, edicion.limpiadores)
  const errores = unirErroresDeSede(erroresEnVivoDeSede(formulario), edicion.erroresDelServidor)
  const vista = vistaPreviaDeSede({ formulario, idDeLaSede, sedes: datos.pestanas })
  return (
    <form
      ref={raiz}
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault()
        edicion.guardar()
      }}
    >
      <Cabecera nueva={idDeLaSede === null} nombre={formulario.nombre} />
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 amplio:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <Secciones {...{ datos, puedeEliminar, formulario, errores, cambios }} />
        <VistaPreviaDeSede vista={vista} textos={datos.textos} />
      </div>
      <BarraDeGuardado
        sucio={sucio}
        guardando={edicion.guardando}
        guardadoRecien={edicion.guardadoRecien}
        alDescartar={edicion.descartar}
        textoDeGuardar={idDeLaSede === null ? 'Crear sede' : undefined}
      />
      <AvisoDeSalida sucio={sucio} />
    </form>
  )
}
