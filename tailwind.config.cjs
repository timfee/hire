/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-soehne)',
        serif: 'var(--font-tiempos)',
      },
    },
    typography: require('./tailwind.typography.config.cjs'),
  },
}
