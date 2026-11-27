import { obtenerCronogramaSunat, obtenerVencimientos } from './obtener-vencimientos'
import { SeccionCronograma } from './seccion-cronograma'
import { SeccionVencimientos } from './seccion-vencimientos'

interface PropsConTitulo {
  titulo: string
}

export async function SeccionVencimientosContenedor({ titulo }: PropsConTitulo) {
  return <SeccionVencimientos titulo={titulo} grupos={await obtenerVencimientos()} />
}

// La fecha de hoy (en Lima) define el periodo vigente; la página se dibuja en cada petición.
export async function SeccionCronogramaContenedor({ titulo }: PropsConTitulo) {
  const cronograma = await obtenerCronogramaSunat(new Date())
  return <SeccionCronograma titulo={titulo} cronograma={cronograma} />
}
