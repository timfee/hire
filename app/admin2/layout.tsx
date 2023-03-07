import { ReactNode } from 'react'

import { createClient } from '@/components/supabase'
import { SupabaseListener, SupabaseProvider } from '@/components/supabase'
import 'server-only'

// do not cache this layout
export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <SupabaseProvider>
      <SupabaseListener serverAccessToken={session?.access_token} />
      {children}
    </SupabaseProvider>
  )
}
