import localFont from 'next/font/local'

// Fuentes de la v4, servidas desde el propio sitio (sin peticiones a Google Fonts).
// Ambas son variables; los tokens --titulo y --texto las usan por su variable CSS.
export const oswald = localFont({
  src: './oswald-latin.woff2',
  weight: '200 700',
  display: 'swap',
  variable: '--fuente-oswald',
  fallback: ['Arial Narrow', 'sans-serif'],
})

// Como en la v4, solo se precarga la de los títulos.
export const openSans = localFont({
  src: './open-sans-latin.woff2',
  weight: '300 800',
  display: 'swap',
  preload: false,
  variable: '--fuente-open-sans',
  fallback: ['system-ui', 'sans-serif'],
})
