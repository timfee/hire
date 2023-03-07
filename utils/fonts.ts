import localFont from 'next/font/local'

export const Serif = localFont({
  display: 'swap',
  preload: true,
  variable: '--font-serif',
  src: [
    {
      path: '../styles/fonts/serif-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/fonts/serif-regular-italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../styles/fonts/serif-bold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../styles/fonts/serif-bold-italic.woff2',
      weight: '600',
      style: 'italic',
    },
  ],
})

export const Sans = localFont({
  display: 'swap',
  preload: true,
  variable: '--font-sans',
  src: [
    {
      path: '../styles/fonts/sans-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/fonts/sans-regular-italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../styles/fonts/sans-medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../styles/fonts/sans-medium-italic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../styles/fonts/sans-semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../styles/fonts/sans-semibold-italic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../styles/fonts/sans-bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../styles/fonts/sans-bold-italic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../styles/fonts/sans-black.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../styles/fonts/sans-black-italic.woff2',
      weight: '800',
      style: 'italic',
    },
  ],
})
