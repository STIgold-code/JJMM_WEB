import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { PropsDeBloque, RegistroDeBloques } from './registro-de-bloques'
import { TipoDeBloqueDesconocidoError } from './registro-de-bloques'
import { RenderizadorDeBloques } from './renderizador-de-bloques'

// Bloques de prueba: dobles mínimos con la forma que Payload entrega (blockType, id).
interface BloqueTitulo {
  blockType: 'titulo'
  id?: string | null
  texto: string
}

interface BloqueParrafo {
  blockType: 'parrafo'
  id?: string | null
  contenido: string
}

type BloqueDePrueba = BloqueTitulo | BloqueParrafo

function Titulo({ bloque }: PropsDeBloque<BloqueTitulo>) {
  return <h2>{bloque.texto}</h2>
}

function Parrafo({ bloque }: PropsDeBloque<BloqueParrafo>) {
  return <p>{bloque.contenido}</p>
}

const REGISTRO: RegistroDeBloques<BloqueDePrueba> = { titulo: Titulo, parrafo: Parrafo }

function dibujar(bloques: readonly BloqueDePrueba[]): string {
  return renderToStaticMarkup(<RenderizadorDeBloques bloques={bloques} registro={REGISTRO} />)
}

describe('RenderizadorDeBloques', () => {
  it('dibuja cada bloque con el componente registrado para su tipo, en orden', () => {
    const html = dibujar([
      { blockType: 'titulo', id: 'a', texto: 'Servicios' },
      { blockType: 'parrafo', id: 'b', contenido: 'Asesoría contable' },
      { blockType: 'titulo', id: 'c', texto: 'Planes' },
    ])

    expect(html).toBe('<h2>Servicios</h2><p>Asesoría contable</p><h2>Planes</h2>')
  })

  it('no dibuja nada cuando la lista está vacía', () => {
    expect(dibujar([])).toBe('')
  })

  it('acepta bloques sin id, como los que aún no se guardaron', () => {
    expect(dibujar([{ blockType: 'parrafo', contenido: 'Sin id' }])).toBe('<p>Sin id</p>')
  })

  it('lanza TipoDeBloqueDesconocidoError si un bloque no tiene componente registrado', () => {
    // Simula datos guardados de un bloque que ya no existe en el código.
    const huerfano = { blockType: 'retirado', id: 'x' } as unknown as BloqueDePrueba

    expect(() => dibujar([huerfano])).toThrow(TipoDeBloqueDesconocidoError)
    expect(() => dibujar([huerfano])).toThrow(
      'No hay un componente registrado para el bloque «retirado».',
    )
  })

  it('no confunde propiedades heredadas del objeto con tipos registrados', () => {
    const heredado = { blockType: 'toString', id: 'y' } as unknown as BloqueDePrueba

    expect(() => dibujar([heredado])).toThrow(TipoDeBloqueDesconocidoError)
  })
})
