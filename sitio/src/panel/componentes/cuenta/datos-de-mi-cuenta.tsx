'use client'

import { useState, useTransition } from 'react'

import { guardarElNombrePropio } from '../../acciones/cuenta'
import { AvisoDeSalida } from '../comunes/aviso-de-salida'
import { BarraDeGuardado } from '../comunes/barra-de-guardado'
import { Campo } from '../comunes/campo'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import { avisarError, avisarExito } from '../mensajes/avisos'
import { InsigniaDeRol } from '../usuarios/insignia-de-rol'

interface Props {
  nombre: string
  correo: string
  rol: string
}

// Guardar el nombre propio: «Guardar cambios» solo con cambios; al guardar bien, lo escrito pasa
// a ser lo guardado.
function useNombrePropio(guardado: string) {
  const [original, setOriginal] = useState(guardado)
  const [nombre, setNombre] = useState(guardado)
  const [error, setError] = useState<string | undefined>()
  const [guardadoRecien, setGuardadoRecien] = useState(false)
  const [guardando, iniciar] = useTransition()
  const sucio = nombre.trim() !== original.trim()

  const guardar = () =>
    iniciar(async () => {
      const estado = await guardarElNombrePropio({ nombre })
      if (estado.estado === 'guardado') {
        setOriginal(nombre.trim())
        setNombre(nombre.trim())
        setGuardadoRecien(true)
        avisarExito(estado.aviso)
      } else if (estado.estado === 'error') avisarError(estado.error)
      else setError(estado.errores.nombre ?? estado.errores.general)
    })

  const cambiar = (valor: string) => {
    setNombre(valor)
    setError(undefined)
  }
  return { nombre, error, sucio, guardando, guardadoRecien, guardar, cambiar, original }
}

interface PropsDeCampos extends Props {
  error: string | undefined
  alCambiar: (nombre: string) => void
}

// El correo y el rol son de solo lectura: los cambia el administrador.
function Campos({ nombre, correo, rol, error, alCambiar }: PropsDeCampos) {
  return (
    <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
      <Campo
        id="mi-nombre"
        etiqueta="Nombre"
        autoComplete="name"
        value={nombre}
        error={error}
        onChange={(evento) => alCambiar(evento.target.value)}
      />
      <Campo
        id="mi-correo"
        etiqueta="Correo"
        type="email"
        value={correo}
        readOnly
        ayuda="Para cambiarlo, pídelo al administrador."
      />
      <div className="grid content-start gap-[0.4rem]">
        <span className="text-sm font-semibold">Rol</span>
        <InsigniaDeRol rol={rol} />
      </div>
    </div>
  )
}

// «Datos»: el nombre se edita; «Guardar cambios» solo con cambios.
export function DatosDeMiCuenta({ nombre: guardado, correo, rol }: Props) {
  const { nombre, error, sucio, ...edicion } = useNombrePropio(guardado)
  return (
    <form
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault()
        if (sucio && !edicion.guardando) edicion.guardar()
      }}
    >
      <TarjetaDelPanel idDelTitulo="titulo-datos" titulo="Datos">
        <Campos {...{ nombre, correo, rol, error }} alCambiar={edicion.cambiar} />
        <BarraDeGuardado
          enTarjeta
          sucio={sucio}
          guardando={edicion.guardando}
          guardadoRecien={edicion.guardadoRecien}
          alDescartar={() => edicion.cambiar(edicion.original)}
        />
      </TarjetaDelPanel>
      <AvisoDeSalida sucio={sucio} />
    </form>
  )
}
