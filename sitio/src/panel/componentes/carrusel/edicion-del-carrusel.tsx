'use client'

import type { FormularioDelCarrusel } from '../../dominio/carrusel-de-portadas'
import { RUTA_DE_LA_PAGINA_DE_INICIO } from '../../dominio/pagina-de-inicio'
import { vistaPreviaDePortada } from '../../dominio/vista-previa-de-portada'
import { AvisoDeSalida } from '../comunes/aviso-de-salida'
import { BarraDeGuardado } from '../comunes/barra-de-guardado'
import { CabeceraDeEdicion } from '../comunes/cabecera-de-edicion'
import { AvisoDePaginaCambiada } from '../pagina-de-inicio/aviso-de-pagina-cambiada'
import type { CambiosDelCarrusel } from './cambios-del-carrusel'
import { EditorDePortada } from './editor-de-portada'
import { ListaDePortadas } from './lista-de-portadas'
import { useEdicionDelCarrusel } from './use-edicion-del-carrusel'
import { VistaPreviaDeLaPortada } from './vista-previa-de-la-portada'

// Al abrir una portada, su editor queda a la vista (en el celular está debajo de la lista).
function mostrarEditor(): void {
  requestAnimationFrame(() => document.getElementById('editor-de-portada')?.scrollIntoView())
}

type Edicion = ReturnType<typeof useEdicionDelCarrusel>

interface PropsDeColumnas {
  formulario: FormularioDelCarrusel
  errores: Edicion['errores']
  cambios: CambiosDelCarrusel
  seleccionada: number | null
  seleccionar: (clave: number) => void
}

// Lista y editor a la izquierda; vista previa a la derecha (debajo, en pantallas angostas).
function Columnas({ formulario, errores, cambios, seleccionada, seleccionar }: PropsDeColumnas) {
  const indice = Math.max(
    0,
    formulario.portadas.findIndex((p) => p.clave === seleccionada),
  )
  const portada = formulario.portadas[indice]
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 amplio:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
        <ListaDePortadas
          formulario={formulario}
          errores={errores}
          abierta={portada?.clave ?? null}
          cambios={cambios}
          alEditar={(clave) => {
            seleccionar(clave)
            mostrarEditor()
          }}
        />
        {portada && (
          <EditorDePortada
            portada={portada}
            indice={indice}
            errores={errores.portada?.[indice]}
            cambios={cambios}
          />
        )}
      </div>
      {portada && (
        <VistaPreviaDeLaPortada vista={vistaPreviaDePortada(portada)} numero={indice + 1} />
      )}
    </div>
  )
}

// Edición del carrusel de portadas en una sola página (maqueta «Portadas»): la lista con los
// segundos por portada, el editor de la portada abierta y su vista previa, la barra de guardado al
// pie y aviso al salir con cambios sin guardar.
export function EdicionDelCarrusel({ guardado }: { guardado: FormularioDelCarrusel }) {
  const { raiz, formulario, errores, cambios, ...edicion } = useEdicionDelCarrusel(guardado)
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
        volverA={{ ruta: RUTA_DE_LA_PAGINA_DE_INICIO, texto: 'Página de inicio' }}
        titulo="Carrusel de portadas"
        bajada="Las imágenes grandes que abren el sitio. Pasan solas, una tras otra, en este orden."
      />
      {edicion.desactualizada && <AvisoDePaginaCambiada />}
      <Columnas
        {...{ formulario, errores, cambios }}
        seleccionada={edicion.seleccionada}
        seleccionar={edicion.seleccionar}
      />
      <BarraDeGuardado
        sucio={edicion.sucio}
        guardando={edicion.guardando}
        guardadoRecien={edicion.guardadoRecien}
        alDescartar={edicion.descartar}
      />
      <AvisoDeSalida sucio={edicion.sucio} />
    </form>
  )
}
