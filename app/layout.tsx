import 'server-only'

import '@/styles/globals.css'
import { Sans, Serif } from '@/utils/fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${Sans.variable} ${Serif.variable}`}>
      <body>{children}</body>
    </html>
  )
}
