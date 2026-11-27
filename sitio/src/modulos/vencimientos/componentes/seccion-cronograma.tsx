import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'

import type { CronogramaSunatPublico } from '../aplicacion/obtener-cronograma-sunat'
import { ConsultaDeVencimiento } from './consulta-de-vencimiento'
import estilos from './cronograma.module.css'

interface PropsSeccionCronograma {
  titulo: string
  cronograma: CronogramaSunatPublico
}

// Cronograma de SUNAT por último dígito del RUC. Sin cronograma cargado para el año, un
// aviso claro en lugar de la consulta.
export function SeccionCronograma({ titulo, cronograma }: PropsSeccionCronograma) {
  const { anio, periodos, claveVigente } = cronograma
  return (
    <section id="cronograma" className={estilos.seccion} aria-labelledby="titulo-cronograma">
      <div {...propsDeRevelado({ clase: 'contenedor' })}>
        <h2 id="titulo-cronograma" className={estilos.encabezado}>
          {titulo}
        </h2>
        {periodos.length > 0 && claveVigente ? (
          <ConsultaDeVencimiento periodos={periodos} claveInicial={claveVigente} />
        ) : (
          <p className={estilos.sinCronograma}>
            Todavía no publicamos el cronograma de SUNAT de {anio}. Consulta tu fecha de vencimiento
            con el estudio.
          </p>
        )}
      </div>
    </section>
  )
}
