'use client'

import type { ComponentProps } from 'react'

import type { DatosDeEdicionDePlan } from '../../aplicacion/consultar-planes'
import { erroresEnVivo, type FormularioDePlan, unirErrores } from '../../dominio/formulario-de-plan'
import { RUTA_DE_PLANES } from '../../dominio/planes'
import type { ErroresDelPlan } from '../../dominio/validacion-de-plan'
import { vistaPreviaDePlanes } from '../../dominio/vista-previa-de-planes'
import { AvisoDeSalida } from '../comunes/aviso-de-salida'
import { BarraDeGuardado } from '../comunes/barra-de-guardado'
import { CabeceraDeEdicion } from '../comunes/cabecera-de-edicion'
import { DatosDelPlan } from './datos-del-plan'
import { EliminarPlan } from './eliminar-plan'
import { QueIncluye } from './que-incluye'
import { useEdicionDePlan } from './use-edicion-de-plan'
import { VistaPrevia } from './vista-previa'

interface Props {
  datos: DatosDeEdicionDePlan
  // Lo decide el servidor con el rol de la sesión; la acción de borrar lo vuelve a comprobar.
  puedeEliminar: boolean
}

function Cabecera({ nombre }: { nombre: string }) {
  return (
    <CabeceraDeEdicion
      volverA={{ ruta: RUTA_DE_PLANES, texto: 'Planes' }}
      titulo={nombre.trim() || 'Sin nombre'}
      bajada="Edita el plan y mira la vista previa para ver cómo queda la tabla del sitio antes de guardar."
    />
  )
}

interface PropsDeSecciones extends Props {
  formulario: FormularioDePlan
  errores: ErroresDelPlan
  alCambiar: ComponentProps<typeof DatosDelPlan>['alCambiar']
  alCambiarCelda: ComponentProps<typeof QueIncluye>['alCambiar']
}

// Columna de edición: «Datos del plan», «Qué incluye» y, para el administrador, el borrado.
function Secciones({ datos, puedeEliminar, formulario, errores, ...cambios }: PropsDeSecciones) {
  const { plan } = datos
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <DatosDelPlan
        formulario={formulario}
        errorDelNombre={errores.nombre}
        alCambiar={cambios.alCambiar}
      />
      <QueIncluye
        caracteristicas={datos.caracteristicas}
        celdas={formulario.celdas}
        errores={errores.celdas ?? {}}
        alCambiar={cambios.alCambiarCelda}
      />
      {puedeEliminar && (
        <EliminarPlan id={plan.id} nombre={plan.nombre} celdasGuardadas={datos.celdasGuardadas} />
      )}
    </div>
  )
}

// Edición de un plan en una sola página: datos, «Qué incluye» y vista previa de la tabla del
// sitio, con la barra de guardado al pie y aviso al salir con cambios sin guardar.
export function EdicionDePlan({ datos, puedeEliminar }: Props) {
  const { raiz, formulario, sucio, guardar, ...edicion } = useEdicionDePlan(
    datos.plan.id,
    datos.formulario,
  )
  const errores = unirErrores(erroresEnVivo(formulario), edicion.errores)
  const vista = vistaPreviaDePlanes({ ...datos, idDelPlan: datos.plan.id, formulario })
  return (
    <form
      ref={raiz}
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault()
        guardar()
      }}
    >
      <Cabecera nombre={formulario.nombre} />
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 amplio:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <Secciones
          datos={datos}
          puedeEliminar={puedeEliminar}
          formulario={formulario}
          errores={errores}
          alCambiar={edicion.cambiar}
          alCambiarCelda={edicion.cambiarCeldaDe}
        />
        <VistaPrevia vista={vista} textos={datos.textos} />
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
