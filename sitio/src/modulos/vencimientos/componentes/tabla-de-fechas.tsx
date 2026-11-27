import type { PeriodoPublico } from '../aplicacion/obtener-cronograma-sunat'
import estilos from './cronograma.module.css'

interface PropsTablaDeFechas {
  periodo: PeriodoPublico
  // Dígito del RUC consultado, para resaltar su fila.
  digitoResaltado: number | null
}

// Las diez fechas del periodo: sirve también sin JavaScript, eligiendo el dígito a ojo.
export function TablaDeFechas({ periodo, digitoResaltado }: PropsTablaDeFechas) {
  return (
    <div className={estilos.envoltorioDeTabla}>
      <table className={estilos.tabla}>
        <caption>Fechas de vencimiento del periodo {periodo.periodo}</caption>
        <thead>
          <tr>
            <th scope="col">Último dígito del RUC</th>
            <th scope="col">Vence el</th>
          </tr>
        </thead>
        <tbody>
          {periodo.fechas.map(({ digito, texto }) => (
            <tr
              key={digito}
              className={digito === digitoResaltado ? estilos.resaltada : undefined}
              aria-current={digito === digitoResaltado ? 'true' : undefined}
            >
              <th scope="row">{digito}</th>
              <td>{texto}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {periodo.buenosContribuyentes ? (
        <p className={estilos.buenosContribuyentes}>
          Buenos contribuyentes y UESP: {periodo.buenosContribuyentes}.
        </p>
      ) : null}
    </div>
  )
}
