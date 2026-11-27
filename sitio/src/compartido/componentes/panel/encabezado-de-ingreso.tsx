import estilos from './encabezado-de-ingreso.module.css'

// Título de la pantalla de ingreso (`admin.components.beforeLogin`): Payload no pone uno.
export function EncabezadoDeIngreso() {
  return (
    <div className={estilos.encabezado}>
      <h1 className={estilos.titulo}>Ingresa al panel</h1>
      <p className={estilos.texto}>Usa el correo y la contraseña de tu cuenta del panel.</p>
    </div>
  )
}
