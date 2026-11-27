import { obtenerAvisos } from './obtener-avisos'
import { SeccionAvisos } from './seccion-avisos'

interface PropsSeccionAvisosContenedor {
  titulo: string
}

export async function SeccionAvisosContenedor({ titulo }: PropsSeccionAvisosContenedor) {
  return <SeccionAvisos titulo={titulo} avisos={await obtenerAvisos()} />
}
