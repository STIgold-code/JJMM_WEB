import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { mapearSedeDelMapa } from '../infraestructura/mapear-sede-del-mapa'
import { CanalesDeContacto } from './canales-de-contacto'
import { MapaDeSede } from './mapa-de-sede'

const SEDE = { nombre: 'Sede San Martín de Porres', direccion: 'Jr. Iquitos 593' }

describe('CanalesDeContacto', () => {
  it('enlaza cada canal con su título y su dato, escalonados', () => {
    const html = renderToStaticMarkup(
      <CanalesDeContacto
        canales={[
          {
            titulo: 'WhatsApp',
            enlace: { texto: '951 965 242', href: 'https://wa.me/51951965242' },
            icono: 'whatsapp',
            destacado: true,
          },
          {
            titulo: null,
            enlace: { texto: 'contabilidad@jjmm.com.pe', href: 'mailto:contabilidad@jjmm.com.pe' },
            icono: 'correo',
            destacado: false,
          },
        ]}
      />,
    )

    expect(html).toContain('<strong>WhatsApp</strong><span>951 965 242</span>')
    expect(html).toMatch(
      /href="mailto:contabilidad@jjmm\.com\.pe" class="[^"]* revelar" style="--retraso:0\.08s"/,
    )
    expect(html).toContain('<span><span>contabilidad@jjmm.com.pe</span></span>')
  })
})

describe('MapaDeSede', () => {
  it('abre el mapa de la sede en una pestaña nueva y lo anuncia', () => {
    const html = renderToStaticMarkup(
      <MapaDeSede
        sede={{ ...SEDE, enlaceDeMapa: 'https://maps.app.goo.gl/x' }}
        textoDelBoton="Ver mapa"
        retraso={0.24}
      />,
    )

    expect(html).toContain('<p>Sede San Martín de Porres<br/>Jr. Iquitos 593</p>')
    expect(html).toContain(
      'href="https://maps.app.goo.gl/x" target="_blank" rel="noopener">Ver mapa',
    )
    expect(html).toContain('(se abre en una pestaña nueva)')
  })

  it('sin enlace de mapa no muestra el botón', () => {
    const html = renderToStaticMarkup(
      <MapaDeSede sede={{ ...SEDE, enlaceDeMapa: null }} textoDelBoton="Ver mapa" retraso={0} />,
    )

    expect(html).not.toContain('<a')
  })
})

describe('mapearSedeDelMapa', () => {
  const sede = {
    id: 1,
    ...SEDE,
    distrito: 'San Martín de Porres',
    ciudad: 'Lima',
    orden: 1,
    activo: true,
    enlaceDeMapa: 'http://inseguro.pe',
    updatedAt: '',
    createdAt: '',
  }

  it('no publica un enlace que no es https ni una sede inactiva o sin poblar', () => {
    expect(mapearSedeDelMapa(sede)).toEqual({ ...SEDE, enlaceDeMapa: null })
    expect(mapearSedeDelMapa({ ...sede, activo: false })).toBeNull()
    expect(mapearSedeDelMapa(3)).toBeNull()
    expect(mapearSedeDelMapa(null)).toBeNull()
  })
})
