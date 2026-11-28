'use client'

import { Plus } from 'lucide-react'

import { Button } from '../ui/button'

// «Nuevo aviso», «Nuevo vencimiento», «Cargar cronograma»: abre el panel lateral vacío.
export function BotonNuevo({ texto, alPulsar }: { texto: string; alPulsar: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" className="bg-card" onClick={alPulsar}>
      <Plus aria-hidden="true" />
      {texto}
    </Button>
  )
}
