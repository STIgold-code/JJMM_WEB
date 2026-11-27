import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { tarjetasDeAtencion } from '../../dominio/atencion'
import { TarjetasDeAtencion } from './tarjetas-de-atencion'

describe('TarjetasDeAtencion', () => {
  it('marca como pendiente solo la tarjeta que tiene algo pendiente', () => {
    const html = renderToStaticMarkup(
      <TarjetasDeAtencion
        tarjetas={tarjetasDeAtencion({ mensajesNuevos: 3, borradores: 0, datosPorCompletar: null })}
      />,
    )
    expect(html.match(/data-pendiente="true"/g)).toHaveLength(1)
    expect(html.match(/data-pendiente="false"/g)).toHaveLength(1)
    expect(html).toContain('Respóndelos y márcalos como atendidos')
    expect(html).toContain('No hay borradores pendientes')
  })

  it('sin tarjetas legibles no dibuja la sección', () => {
    expect(renderToStaticMarkup(<TarjetasDeAtencion tarjetas={[]} />)).toBe('')
  })
})
