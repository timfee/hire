/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import { useSupabase } from '@/components/auth/SupabaseProvider'

// Supabase auth needs to be triggered client-side
export default function Login() {
  const { supabase, session } = useSupabase()

  return (
    <>
      {session && session.user ? (
        <button
          className="mx-auto mt-10 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-700"
          onClick={async () => {
            await supabase.auth.signOut()
          }}>
          sign out
        </button>
      ) : (
        <button
          className="mx-auto mt-10 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-700"
          onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: window.origin + '/login',
              },
            })
          }}>
          sign in
        </button>
      )}
    </>
  )
}
