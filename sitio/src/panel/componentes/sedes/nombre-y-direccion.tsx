'use client'

import type { FormularioDeSede } from '../../dominio/formulario-de-sede'
import type { ErroresDeSede } from '../../dominio/validacion-de-sede'
import { Campo } from '../comunes/campo'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import type { CambiosDelFormulario } from './cambios-del-formulario'

interface Props {
  formulario: FormularioDeSede
  errores: ErroresDeSede
  alCambiar: CambiosDelFormulario['cambiarTexto']
}

type Campos = 'nombre' | 'direccion' | 'distrito' | 'ciudad'

const ANCHO_COMPLETO = 'grid gap-[0.4rem] sm:col-span-2'

const CAMPOS: readonly { campo: Campos; etiqueta: string; ayuda?: string; ancho?: string }[] = [
  {
    campo: 'nombre',
    etiqueta: 'Nombre',
    ayuda: 'Encabeza la sede en el pie y en «Contáctanos».',
    ancho: ANCHO_COMPLETO,
  },
  { campo: 'direccion', etiqueta: 'Dirección', ancho: ANCHO_COMPLETO },
  {
    campo: 'distrito',
    etiqueta: 'Distrito',
    ayuda: 'Nombra la pestaña de la sede en «Contáctanos».',
  },
  { campo: 'ciudad', etiqueta: 'Ciudad' },
]

// «Nombre y dirección»: lo que el sitio muestra de la sede en el pie y en «Contáctanos». Los
// cuatro campos son obligatorios en la colección.
export function NombreYDireccion({ formulario, errores, alCambiar }: Props) {
  return (
    <TarjetaDelPanel idDelTitulo="titulo-direccion" titulo="Nombre y dirección">
      <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
        {CAMPOS.map(({ campo, etiqueta, ayuda, ancho }) => (
          <Campo
            key={campo}
            id={`sede-${campo}`}
            etiqueta={etiqueta}
            ayuda={ayuda}
            className={ancho}
            error={errores[campo]}
            required
            value={formulario[campo]}
            onChange={(evento) => alCambiar(campo, evento.target.value)}
          />
        ))}
      </div>
    </TarjetaDelPanel>
  )
}
