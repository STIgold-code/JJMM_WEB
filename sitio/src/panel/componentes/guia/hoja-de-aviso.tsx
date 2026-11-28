'use client'

import type { ChangeEvent } from 'react'

import { eliminarElAviso, guardarElAviso } from '../../acciones/avisos'
import {
  type AvisoDelPanel,
  type FormularioDeAviso,
  formularioDeAviso,
  hayCambiosEnElAviso,
} from '../../dominio/avisos-para-clientes'
import type { ErroresDeAviso } from '../../dominio/validacion-de-aviso'
import { AreaDeTexto } from '../comunes/area-de-texto'
import { Campo } from '../comunes/campo'
import { HojaDeEdicion } from '../comunes/hoja-de-edicion'
import { useFormularioEnHoja } from '../comunes/use-formulario-en-hoja'
import { EliminarDeLaGuia } from './eliminar-de-la-guia'

interface Props {
  // Nulo: «Nuevo aviso».
  aviso: AvisoDelPanel | null
  puedeEliminar: boolean
  alCerrar: () => void
}

// Panel lateral de un aviso (`aviso` nulo: uno nuevo). El servidor valida todo de nuevo.
export function HojaDeAviso({ aviso, puedeEliminar, alCerrar }: Props) {
  const edicion = useFormularioEnHoja<FormularioDeAviso, ErroresDeAviso>({
    inicial: formularioDeAviso(aviso),
    hayCambios: hayCambiosEnElAviso,
    guardarEnServidor: (formulario) => guardarElAviso(aviso?.id ?? null, formulario),
    alGuardar: alCerrar,
  })
  return (
    <HojaDeEdicion
      abierta
      alCerrar={alCerrar}
      titulo={aviso ? 'Editar aviso' : 'Nuevo aviso'}
      descripcion={
        aviso
          ? 'Los cambios se ven en la guía al guardar.'
          : 'Se crea oculto y al final de la lista.'
      }
      sucio={edicion.sucio}
      guardando={edicion.guardando}
      textoDeGuardar={aviso ? 'Guardar aviso' : 'Crear aviso'}
      alGuardar={edicion.guardar}
      eliminar={aviso && puedeEliminar && <Eliminar aviso={aviso} alEliminar={alCerrar} />}
    >
      <CamposDeAviso {...edicion} />
    </HojaDeEdicion>
  )
}

interface PropsDeCampos {
  formulario: FormularioDeAviso
  errores: ErroresDeAviso
  cambiar: <C extends keyof FormularioDeAviso>(campo: C, valor: FormularioDeAviso[C]) => void
}

// Los campos de la maqueta: título, cuándo aplica, documentos (uno por línea; en la guía son una
// lista) y correo.
function CamposDeAviso({ formulario, errores, cambiar }: PropsDeCampos) {
  // Valor, error y cambio de un campo de texto (todos se llaman igual en el formulario y en los
  // errores).
  const enlazar = (campo: keyof FormularioDeAviso) => ({
    value: formulario[campo],
    error: errores[campo],
    onChange: (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      cambiar(campo, evento.target.value),
  })
  return (
    <>
      <Campo id="aviso-titulo" etiqueta="Título" required maxLength={200} {...enlazar('titulo')} />
      <AreaDeTexto
        id="aviso-cuando"
        etiqueta="Cuándo aplica"
        rows={4}
        required
        ayuda="Deja una línea en blanco para separar párrafos."
        {...enlazar('cuandoAplica')}
      />
      <AreaDeTexto
        id="aviso-documentos"
        etiqueta="Documentos que debe enviar el cliente"
        rows={8}
        ayuda="Uno por línea. En la guía se muestran como una lista."
        {...enlazar('documentos')}
      />
      <Campo
        id="aviso-correo"
        etiqueta="Correo para enviarlos"
        type="email"
        inputMode="email"
        ayuda="Opcional."
        {...enlazar('correo')}
      />
    </>
  )
}

function Eliminar({ aviso, alEliminar }: { aviso: AvisoDelPanel; alEliminar: () => void }) {
  return (
    <EliminarDeLaGuia
      accion="Eliminar aviso"
      titulo={`¿Eliminar «${aviso.titulo}»?`}
      texto="Deja de verse en la guía y no se puede recuperar. Si solo quieres ocultarlo, apaga «Visible» en la lista."
      eliminar={() => eliminarElAviso(aviso.id)}
      alEliminar={alEliminar}
    />
  )
}
