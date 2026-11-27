import type { BloqueBase, RegistroDeBloques } from './registro-de-bloques'
import { buscarComponenteDeBloque } from './registro-de-bloques'

interface PropsRenderizadorDeBloques<B extends BloqueBase> {
  bloques: readonly B[]
  registro: RegistroDeBloques<B>
}

// Server Component de presentación: dibuja, en orden, cada bloque con el componente que
// el registro asocia a su tipo. No obtiene datos ni conoce bloques concretos.
export function RenderizadorDeBloques<B extends BloqueBase>({
  bloques,
  registro,
}: PropsRenderizadorDeBloques<B>) {
  return (
    <>
      {bloques.map((bloque, indice) => {
        const Componente = buscarComponenteDeBloque(registro, bloque)
        return <Componente key={bloque.id ?? `${bloque.blockType}-${indice}`} bloque={bloque} />
      })}
    </>
  )
}
