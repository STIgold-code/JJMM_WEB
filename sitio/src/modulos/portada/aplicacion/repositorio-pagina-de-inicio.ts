// Secciones de la página de inicio en el orden del panel. El tipo de sección lo fija el
// adaptador (los bloques de Payload), así esta capa no depende de Payload.
export interface RepositorioPaginaDeInicio<S> {
  obtenerSecciones(): Promise<readonly S[]>
}
