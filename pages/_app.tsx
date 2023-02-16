import '@/styles/globals.css'

import { useState } from 'react'

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { type Session } from '@supabase/auth-helpers-react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { AppType } from 'next/app'
import PlausibleProvider from 'next-plausible'

import { Soehne, Tiempos } from '@/utils/fonts'
import type { Database } from 'types/supabase'

import { api } from '../utils/api'

const MyApp: AppType<{
  initialSession: Session
}> = ({ Component, pageProps }) => {
  const [supabase] = useState(() => createBrowserSupabaseClient<Database>())

  return (
    <PlausibleProvider
      domain="hire.timfeeley.com"
      trackFileDownloads
      trackOutboundLinks>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
        <style
          jsx
          global>{`
          :root {
            --sans-serif: ${Soehne.style.fontFamily};
            --serif: ${Tiempos.style.fontFamily};
          }
        `}</style>
      </SessionContextProvider>
    </PlausibleProvider>
  )
}

export default api.withTRPC(MyApp)
