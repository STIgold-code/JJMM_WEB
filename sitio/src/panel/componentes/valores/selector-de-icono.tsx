'use client'

import { ICONOS_DE_VALOR, type IconoDeValor as Nombre, nombreDelIcono } from '../../dominio/valores'
import { CLASE_DE_AYUDA } from '../comunes/campo'
import { MensajeDeError } from '../comunes/mensaje-de-error'
import { IconoDeValor } from './icono-de-valor'

interface Props {
  valor: Nombre | ''
  alCambiar: (icono: Nombre) => void
  error?: string
}

const ID = 'valor-icono'

// Los seis íconos del sitio como opciones visuales (radios nativos: flechas del teclado, un solo
// valor). La lista es cerrada: un ícono nuevo necesita un cambio en el sitio.
export function SelectorDeIcono({ valor, alCambiar, error }: Props) {
  const describe = [`${ID}-ayuda`, error && `${ID}-error`].filter(Boolean).join(' ')
  return (
    <fieldset aria-describedby={describe} className="grid gap-[0.4rem]">
      <legend className="mb-[0.4rem] text-sm font-semibold">Ícono</legend>
      <div className="grid grid-cols-3 gap-2">
        {ICONOS_DE_VALOR.map((icono) => (
          <div key={icono} className="relative">
            <input
              type="radio"
              id={`${ID}-${icono}`}
              name={ID}
              value={icono}
              checked={valor === icono}
              onChange={() => alCambiar(icono)}
              className="peer absolute opacity-0"
            />
            <label
              htmlFor={`${ID}-${icono}`}
              className="grid cursor-pointer justify-items-center gap-[0.35rem] rounded-md border bg-card px-[0.4rem] py-[0.65rem] text-[0.8125rem] hover:border-[#bccbdc] peer-checked:border-primary peer-checked:bg-accent peer-checked:text-accent-foreground peer-checked:shadow-[inset_0_0_0_1px_var(--primary)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"
            >
              <IconoDeValor icono={icono} className="size-5" />
              {nombreDelIcono(icono)}
            </label>
          </div>
        ))}
      </div>
      <p id={`${ID}-ayuda`} className={CLASE_DE_AYUDA}>
        Son los seis íconos que tiene el sitio. Un ícono nuevo necesita un cambio en el sitio.
      </p>
      {error && <MensajeDeError id={`${ID}-error`} texto={error} />}
    </fieldset>
  )
}
