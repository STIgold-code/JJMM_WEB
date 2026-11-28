// Búsqueda de los listados del panel: sin tildes ni mayúsculas, «maria» encuentra a «María».
export const normalizarParaBuscar = (texto: string): string =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
