'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface Props {
  invalido: boolean
  describidoPor?: string
}

// Contraseña con botón «ojo» para verla mientras se escribe.
export function CampoDeContrasena({ invalido, describidoPor }: Props) {
  const [visible, setVisible] = useState(false)
  const Icono = visible ? EyeOff : Eye
  return (
    <div className="grid gap-[0.4rem]">
      <Label htmlFor="clave" className="font-semibold">
        Contraseña
      </Label>
      <div className="relative">
        <Input
          id="clave"
          name="clave"
          type={visible ? 'text' : 'password'}
          autoComplete="current-password"
          required
          aria-invalid={invalido || undefined}
          aria-describedby={describidoPor}
          className="h-10 bg-card pr-11 text-[0.9375rem]"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-pressed={visible}
          aria-label={visible ? 'Ocultar la contraseña' : 'Mostrar la contraseña'}
          onClick={() => setVisible((actual) => !actual)}
          className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
        >
          <Icono aria-hidden="true" strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  )
}
