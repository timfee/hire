import '@/styles/globals.css'

import { useState } from 'react'

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { type Session } from '@supabase/auth-helpers-react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { AppType } from 'next/app'
import PlausibleProvider from 'next-plausible'

import { Sans, Serif } from '@/utils/fonts'
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
      </SessionContextProvider>
      <style
        jsx
        global>{`
        :root {
          --font-sans: ${Sans.style.fontFamily};
          --font-serif: ${Serif.style.fontFamily};
        }
      `}</style>
    </PlausibleProvider>
  )
}

export default api.withTRPC(MyApp)
