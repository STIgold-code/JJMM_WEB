'use client'

import { ChevronDown } from 'lucide-react'

import { ROLES, type Rol } from '@/compartido/dominio/roles'

import { nombreDelRol } from '../../dominio/menu-del-panel'
import { CLASE_DE_AYUDA } from '../comunes/campo'
import { MensajeDeError } from '../comunes/mensaje-de-error'
import { Label } from '../ui/label'

interface Props {
  valor: Rol
  error?: string
  alCambiar: (rol: Rol) => void
}

const ID = 'cuenta-rol'
// Como la maqueta: primero el rol más común y con menos permisos.
const ORDEN_DE_LOS_ROLES: readonly Rol[] = ['editor', 'administrador']

// Selector nativo (accesible con teclado y lector de pantalla sin más piezas), con el estilo de
// las entradas del panel y la explicación de cada rol.
export function SelectorDeRol({ valor, error, alCambiar }: Props) {
  const describe = [`${ID}-ayuda`, error && `${ID}-error`].filter(Boolean).join(' ')
  return (
    <div className="grid gap-[0.4rem]">
      <Label htmlFor={ID} className="font-semibold">
        Rol
      </Label>
      <div className="relative">
        <select
          id={ID}
          value={valor}
          aria-invalid={error ? true : undefined}
          aria-describedby={describe}
          onChange={(evento) => {
            const rol = ROLES.find((r) => r === evento.target.value)
            if (rol) alCambiar(rol)
          }}
          className="h-9 w-full appearance-none rounded-md border border-input bg-card px-3 pr-9 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm"
        >
          {ORDEN_DE_LOS_ROLES.map((rol) => (
            <option key={rol} value={rol}>
              {nombreDelRol(rol)}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      <p id={`${ID}-ayuda`} className={CLASE_DE_AYUDA}>
        Editor: textos, imágenes, planes, avisos, blog, sedes y mensajes. Administrador: además,
        cuentas, menú y datos del estudio.
      </p>
      {error && <MensajeDeError id={`${ID}-error`} texto={error} />}
    </div>
  )
}
