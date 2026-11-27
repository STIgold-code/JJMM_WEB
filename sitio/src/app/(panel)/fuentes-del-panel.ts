import localFont from 'next/font/local'

// Las mismas fuentes locales del sitio público. Open Sans es la de toda la interfaz; Oswald,
// la de la marca, solo va en el nombre del estudio y los títulos de página.
export const openSans = localFont({
  src: '../(frontend)/fuentes/open-sans-latin.woff2',
  weight: '300 800',
  display: 'swap',
  variable: '--fuente-open-sans',
  fallback: ['system-ui', 'sans-serif'],
})

export const oswald = localFont({
  src: '../(frontend)/fuentes/oswald-latin.woff2',
  weight: '200 700',
  display: 'swap',
  preload: false,
  variable: '--fuente-oswald',
  fallback: ['Arial Narrow', 'sans-serif'],
})
