import localFont from '@next/font/local'

export const Inter = localFont({
  display: 'swap',
  preload: true,
  src: [
    {
      path: '../styles/fonts/Inter-roman.var.woff2',
      style: 'normal',
      weight: '100 900',
    },
    {
      path: '../styles/fonts/Inter-italic.var.woff2',
      style: 'italic',
      weight: '100 900',
    },
  ],
})

export const Tiempos = localFont({
  display: 'swap',
  preload: true,
  src: [
    {
      path: '../styles/fonts/tiempos-text-web-regular.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../styles/fonts/tiempos-text-web-regular-italic.woff2',
      style: 'italic',
      weight: '400',
    },
    {
      path: '../styles/fonts/tiempos-text-web-medium.woff2',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../styles/fonts/tiempos-text-web-medium-italic.woff2',
      style: 'italic',
      weight: '500',
    },
  ],
})

export const Soehne = localFont({
  display: 'swap',
  preload: true,
  src: [
    {
      path: '../styles/fonts/soehne-buch.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../styles/fonts/soehne-buch-kursiv.woff2',
      style: 'italic',
      weight: '400',
    },
    {
      path: '../styles/fonts/soehne-kraftig.woff2',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../styles/fonts/soehne-kraftig-kursiv.woff2',
      style: 'italic',
      weight: '500',
    },
    {
      path: '../styles/fonts/soehne-halbfett.woff2',
      style: 'normal',
      weight: '600',
    },
    {
      path: '../styles/fonts/soehne-halbfett-kursiv.woff2',
      style: 'italic',
      weight: '600',
    },
    {
      path: '../styles/fonts/soehne-dreiviertelfett.woff2',
      style: 'normal',
      weight: '700',
    },
    {
      path: '../styles/fonts/soehne-dreiviertelfett-kursiv.woff2',
      style: 'italic',
      weight: '700',
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
