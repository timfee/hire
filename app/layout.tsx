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
      <body className="h-full bg-cover bg-gradient-to-t from-[#e6e9f0] to-[#eef1f5]">
        <div className="relative">
          {/* <Header /> */}
          {children}
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  )
}