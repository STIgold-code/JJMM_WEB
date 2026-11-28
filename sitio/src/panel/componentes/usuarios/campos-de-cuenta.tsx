'use client'

import type { Rol } from '@/compartido/dominio/roles'

import type { FormularioDeCuenta } from '../../dominio/usuarios'
import type { ErroresDeUsuario } from '../../dominio/validacion-de-usuario'
import { Campo } from '../comunes/campo'
import { CampoDeClave } from '../comunes/campo-de-clave'
import { SelectorDeRol } from './selector-de-rol'

interface Props {
  formulario: FormularioDeCuenta
  errores: ErroresDeUsuario
  // Al editar otra cuenta la contraseña es opcional (vacía: no cambia).
  nueva: boolean
  cambiar: <C extends keyof FormularioDeCuenta>(campo: C, valor: FormularioDeCuenta[C]) => void
}

const AYUDA_DE_CLAVE_NUEVA = 'Al menos 10 caracteres. Pídele que la cambie en Mi cuenta al entrar.'
const AYUDA_DE_CLAVE_OTRA =
  'Déjala vacía para no cambiarla. Si escribes una (al menos 10 caracteres), se cierran sus sesiones abiertas.'

// Campos reales de la colección `usuarios`: nombre, correo, rol y contraseña.
export function CamposDeCuenta({ formulario, errores, nueva, cambiar }: Props) {
  return (
    <div className="grid gap-4">
      <Campo
        id="cuenta-nombre"
        etiqueta="Nombre"
        required
        value={formulario.nombre}
        error={errores.nombre}
        onChange={(evento) => cambiar('nombre', evento.target.value)}
      />
      <Campo
        id="cuenta-correo"
        etiqueta="Correo"
        type="email"
        required
        placeholder="nombre@jjmm.com.pe"
        value={formulario.correo}
        error={errores.correo}
        onChange={(evento) => cambiar('correo', evento.target.value)}
      />
      <SelectorDeRol
        valor={formulario.rol}
        error={errores.rol}
        alCambiar={(rol: Rol) => cambiar('rol', rol)}
      />
      <CampoDeClave
        id="cuenta-clave"
        etiqueta={nueva ? 'Contraseña temporal' : 'Contraseña nueva (opcional)'}
        autoComplete="new-password"
        required={nueva}
        valor={formulario.clave}
        alCambiar={(clave) => cambiar('clave', clave)}
        ayuda={nueva ? AYUDA_DE_CLAVE_NUEVA : AYUDA_DE_CLAVE_OTRA}
        error={errores.clave}
      />
    </div>
  )
}
