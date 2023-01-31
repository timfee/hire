import '@/app/globals.css'

import localFont from '@next/font/local'

import { AnalyticsWrapper } from '@/app/analytics'

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
      <body className="h-full bg-gradient-to-t from-slate-100 to-slate-200 bg-cover">
        {children}
        <AnalyticsWrapper />
      </body>
    </html>
  )
}
