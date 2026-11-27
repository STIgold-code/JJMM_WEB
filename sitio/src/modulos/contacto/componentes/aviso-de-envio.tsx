import type { EstadoDelFormulario } from './estado-del-formulario'
import estilos from './contacto.module.css'

interface PropsAvisoDeEnvio {
  estado: EstadoDelFormulario['estado']
  // Enlace de WhatsApp del último envío, por si el navegador bloqueó la pestaña nueva.
  enlace: string | null
}

const MENSAJES: Partial<Record<EstadoDelFormulario['estado'], string>> = {
  enviado: 'Recibimos tus datos. Termina de enviar tu mensaje en WhatsApp.',
  limite: 'Enviaste varios mensajes seguidos. Intenta en unos minutos o escríbenos por WhatsApp.',
  error: 'No pudimos guardar tu mensaje. Escríbenos por WhatsApp o llámanos.',
}

// Región viva: los lectores de pantalla anuncian el resultado del envío sin mover el foco.
export function AvisoDeEnvio({ estado, enlace }: PropsAvisoDeEnvio) {
  const mensaje = MENSAJES[estado]
  return (
    <p className={estilos.aviso} role="status">
      {mensaje ? (
        <>
          {mensaje}{' '}
          {enlace ? (
            <a href={enlace} target="_blank" rel="noopener">
              Abrir WhatsApp<span className="oculto"> (se abre en una pestaña nueva)</span>
            </a>
          ) : null}
        </>
      ) : null}
    </p>
  )
}
