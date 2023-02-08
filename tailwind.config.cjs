/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    typography: require('./tailwind.typography.config.cjs'),
    extend: {
      fontFamily: {
        sans: 'var(--font-soehne)',
        serif: 'var(--font-tiempos)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}