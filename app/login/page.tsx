/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import { useSupabase } from '@/components/auth/SupabaseProvider'

// Supabase auth needs to be triggered client-side
export default function Login() {
  const { supabase, session } = useSupabase()

  return (
    <>
      {session && session.user ? (
        <>
          <a
            className="mx-auto mt-10 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-700"
            href="/admin">
            access admin
          </a>

          <button
            className="mx-auto mt-10 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-700"
            onClick={async () => {
              await supabase.auth.signOut()
            }}>
            sign out
          </button>
        </>
      ) : (
        <button
          className="mx-auto mt-10 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-700"
          onClick={async () => {
            await supabase.auth.signInWithOAuth({
              options: {
                redirectTo: window.origin + '/login',
              },
              provider: 'google',
            })
          }}>
          sign in
        </button>
      )}
    </>
  )
}
