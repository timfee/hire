import PlausibleProvider from 'next-plausible'
import { AnalyticsWrapper } from '@/app/analytics'
import '@/app/globals.css'

import localFont from '@next/font/local'

const Inter = localFont({
  display: 'swap',
  variable: '--font-inter-variable',
  src: [
    {
      path: './Inter-roman.var.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: './Inter-italic.var.woff2',
      weight: '100 900',
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
    <html lang="en" className={`${Inter.variable} h-max`}>
      <head>
        <PlausibleProvider
          domain="hire.timfeeley.com"
          trackLocalhost={true}
          taggedEvents
        />
      </head>
      <body className="h-screen bg-cover bg-gradient-to-t from-slate-100 to-slate-200">
        {children}
        <AnalyticsWrapper />
      </body>
    </html>
  )
}
