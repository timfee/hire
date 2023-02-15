/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      objectPosition: {
        'prose-fit': '4rem center',
      },
      fontFamily: {
        sans: ['var(--sans-serif)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--serif)', ...defaultTheme.fontFamily.serif],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            p: {
              fontFamily: theme('fontFamily.serif')[0],
            },
            ':is(h1,h2,h3,h4,h5,h6)': {
              fontFamily: theme('fontFamily.sans')[0],
            },
            ':is(code,pre)': {
              fontFamily: theme('fontFamily.mono'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
