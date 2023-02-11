import './globals.css'

import localFont from '@next/font/local'
import clsx from 'clsx'
import PlausibleProvider from 'next-plausible'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const tiempos = localFont({
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
  variable: '--font-tiempos',
})

const soehne = localFont({
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
  variable: '--font-soehne',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth antialiased',
        tiempos.variable,
        soehne.variable
      )}>
      <head>
        <PlausibleProvider
          domain="hire.timfeeley.com"
          trackFileDownloads
          trackOutboundLinks
        />
      </head>
      <body className="h-full bg-gradient-to-t from-slate-100 to-slate-200 bg-fixed bg-no-repeat">
        {children}
      </body>
    </html>
  )
}
