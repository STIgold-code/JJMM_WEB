'use client'

import { Eye, EyeOff } from 'lucide-react'
import { type ComponentProps, type ReactNode, useState } from 'react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { CLASE_DE_AYUDA } from './campo'
import { MensajeDeError } from './mensaje-de-error'

type Props = Omit<ComponentProps<typeof Input>, 'type' | 'autoComplete' | 'value' | 'onChange'> & {
  id: string
  etiqueta: string
  // `current-password` para la contraseña actual; `new-password` para una nueva (así el
  // navegador o el gestor de contraseñas la propone y la guarda).
  autoComplete: 'current-password' | 'new-password'
  valor: string
  alCambiar: (valor: string) => void
  ayuda?: ReactNode
  error?: string
}

interface PropsDelOjo {
  id: string
  visible: boolean
  alPulsar: () => void
}

// Botón «ojo»: muestra u oculta la contraseña del campo que controla.
function BotonOjo({ id, visible, alPulsar }: PropsDelOjo) {
  const Icono = visible ? EyeOff : Eye
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-pressed={visible}
      aria-label={visible ? 'Ocultar la contraseña' : 'Mostrar la contraseña'}
      aria-controls={id}
      onClick={alPulsar}
      className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
    >
      <Icono aria-hidden="true" strokeWidth={1.75} />
    </Button>
  )
}

// Contraseña de un formulario del panel con el botón «ojo» para verla mientras se escribe. La
// ayuda y el error se enlazan con `aria-describedby`.
export function CampoDeClave({ id, etiqueta, valor, alCambiar, ayuda, error, ...entrada }: Props) {
  const [visible, setVisible] = useState(false)
  const describe = [ayuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(' ')
  return (
    <div className="grid gap-[0.4rem]">
      <Label htmlFor={id} className="font-semibold">
        {etiqueta}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={valor}
          onChange={(evento) => alCambiar(evento.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describe || undefined}
          spellCheck={false}
          autoCapitalize="none"
          className="bg-card pr-11"
          {...entrada}
        />
        <BotonOjo id={id} visible={visible} alPulsar={() => setVisible((actual) => !actual)} />
      </div>
      {ayuda && (
        <p id={`${id}-ayuda`} className={CLASE_DE_AYUDA}>
          {ayuda}
        </p>
      )}
      {error && <MensajeDeError id={`${id}-error`} texto={error} />}
    </div>
  )
}
