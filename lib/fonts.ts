import localFont from '@next/font/local'

export const Inter = localFont({
  display: 'swap',
  preload: true,
  src: [
    {
      path: '../styles/fonts/Inter-roman.var.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../styles/fonts/Inter-italic.var.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
})

export const Tiempos = localFont({
  display: 'swap',
  preload: true,
  src: [
    {
      path: '../styles/fonts/tiempos-text-web-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/fonts/tiempos-text-web-regular-italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../styles/fonts/tiempos-text-web-medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../styles/fonts/tiempos-text-web-medium-italic.woff2',
      weight: '500',
      style: 'italic',
    },
  ],
})

export const Soehne = localFont({
  display: 'swap',
  preload: true,
  src: [
    {
      path: '../styles/fonts/soehne-buch.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/fonts/soehne-buch-kursiv.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../styles/fonts/soehne-kraftig.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../styles/fonts/soehne-kraftig-kursiv.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../styles/fonts/soehne-halbfett.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../styles/fonts/soehne-halbfett-kursiv.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../styles/fonts/soehne-dreiviertelfett.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../styles/fonts/soehne-dreiviertelfett-kursiv.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})

// @font-face {
//   font-family: 'Tiempos';
//   src: url('./tiempos-text-web-regular.woff2') format('woff2');
//   font-weight: 400;
// }
// @font-face {
//   font-family: 'Tiempos';
//   src: url('/tiempos-text-web-regular-italic.woff2') format('woff2');
//   font-weight: 400;
//   font-style: italic;
// }
// @font-face {
//   font-family: 'Tiempos';
//   src: url('/tiempos-text-web-bold.woff2') format('woff2');
//   font-weight: 700;
// }
// @font-face {
//   font-family: 'Tiempos';
//   src: url('/tiempos-text-web-bold-italic.woff2') format('woff2');
//   font-weight: 700;
//   font-style: italic;
// }

// @font-face {
//   font-family: 'Tiempos';
//   src: url('/tiempos-text-web-medium.woff2') format('woff2');
//   font-weight: 500;
// }

// @font-face {
//   font-family: 'Tiempos';
//   src: url('/tiempos-text-web-medium-italic.woff2') format('woff2');
//   font-weight: 500;
//   font-style: italic;
// }
// @font-face {
//   font-family: 'Tiempos';
//   src: url('/tiempos-text-web-semibold.woff2') format('woff2');
//   font-weight: 600;
// }
// @font-face {
//   font-family: 'Tiempos';
//   src: url('/tiempos-text-web-semibold-italic.woff2') format('woff2');
//   font-weight: 600;
//   font-style: italic;
// }
