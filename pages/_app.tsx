import '@/styles/global.css'

import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import PlausibleProvider from 'next-plausible'

import { Soehne, Tiempos } from '@/lib/fonts'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <PlausibleProvider
      domain="hire.timfeeley.com"
      trackFileDownloads
      trackOutboundLinks>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
      <style jsx global>{`
        :root {
          --inter-v-font: ${Soehne.style.fontFamily};
          --tiempos-font: ${Tiempos.style.fontFamily};
        }
      `}</style>
    </PlausibleProvider>
  )
}

export default MyApp
