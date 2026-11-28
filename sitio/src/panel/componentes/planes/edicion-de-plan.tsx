'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { ComponentProps } from 'react'

import type { DatosDeEdicionDePlan } from '../../aplicacion/consultar-planes'
import { erroresEnVivo, type FormularioDePlan, unirErrores } from '../../dominio/formulario-de-plan'
import { RUTA_DE_PLANES } from '../../dominio/planes'
import type { ErroresDelPlan } from '../../dominio/validacion-de-plan'
import { vistaPreviaDePlanes } from '../../dominio/vista-previa-de-planes'
import { BarraDeGuardado } from './barra-de-guardado'
import { Confirmacion } from './confirmacion'
import { DatosDelPlan } from './datos-del-plan'
import { EliminarPlan } from './eliminar-plan'
import { QueIncluye } from './que-incluye'
import { useAvisoDeSalida } from './use-aviso-de-salida'
import { useEdicionDePlan } from './use-edicion-de-plan'
import { VistaPrevia } from './vista-previa'

interface Props {
  datos: DatosDeEdicionDePlan
  // Lo decide el servidor con el rol de la sesión; la acción de borrar lo vuelve a comprobar.
  puedeEliminar: boolean
}

function Cabecera({ nombre }: { nombre: string }) {
  return (
    <div className="mb-6 grid gap-1">
      <Link
        href={RUTA_DE_PLANES}
        className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Planes
      </Link>
      <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance [overflow-wrap:anywhere] max-sm:text-2xl">
        {nombre.trim() || 'Sin nombre'}
      </h1>
      <p className="max-w-[60ch] text-muted-foreground">
        Edita el plan y mira la vista previa para ver cómo queda la tabla del sitio antes de
        guardar.
      </p>
    </div>
  )
}

// Con cambios sin guardar, salir por un enlace del panel pide confirmación.
function AvisoDeSalida({ sucio }: { sucio: boolean }) {
  const { destino, salirSinGuardar, seguirEditando } = useAvisoDeSalida(sucio)
  return (
    <Confirmacion
      abierta={destino !== null}
      titulo="Tienes cambios sin guardar"
      texto="Si sales ahora, se pierden. Vuelve y pulsa «Guardar cambios» para conservarlos."
      accion="Salir sin guardar"
      cancelar="Seguir editando"
      alConfirmar={salirSinGuardar}
      alCerrar={seguirEditando}
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
