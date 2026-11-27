// Estado del botón «ojo» de los campos de contraseña: qué dice, si está presionado y qué tipo
// toma el campo.
export interface EstadoDeVerContrasena {
  etiqueta: 'Mostrar contraseña' | 'Ocultar contraseña'
  presionado: boolean
  tipo: 'password' | 'text'
}

export function estadoDeVerContrasena(visible: boolean): EstadoDeVerContrasena {
  return visible
    ? { etiqueta: 'Ocultar contraseña', presionado: true, tipo: 'text' }
    : { etiqueta: 'Mostrar contraseña', presionado: false, tipo: 'password' }
}
