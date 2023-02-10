import './globals.css'

import localFont from '@next/font/local'
import clsx from 'clsx'
import PlausibleProvider from 'next-plausible'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const tiempos = localFont({
  display: 'swap',
  variable: '--font-tiempos',
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

const soehne = localFont({
  display: 'swap',
  variable: '--font-soehne',
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
