import 'server-only'

import '@/styles/globals.css'
import { Soehne, Tiempos } from '@/utils/fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${Soehne.variable} ${Tiempos.variable}`}>
      <body>{children}</body>
    </html>
  )
}
