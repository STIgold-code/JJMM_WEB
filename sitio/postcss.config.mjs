// Tailwind CSS v4 solo para el panel propio (`src/app/(panel)/`). El complemento no toca las
// hojas que no usan sus directivas (`@import`, `@theme`, `@apply`…): los CSS Modules del sitio
// público y los estilos de Payload pasan sin cambios.
const configuracion = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default configuracion
