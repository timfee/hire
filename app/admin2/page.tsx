import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'

import { getCompanies } from '@/helpers'
import { Database } from '@/types/supabase'

export default async function AdminPage() {
  const companies = await getCompanies()

  return (
    <div
      role="list"
      className="mt-6 space-y-3">
      <Link
        href="/admin/editor"
        className="block overflow-hidden rounded-md bg-green-600 px-6 py-4 text-white underline shadow">
        Create New Company
      </Link>

      {companies &&
        companies.map(({ name, slug }) => (
          <Link
            key={slug}
            href={`/admin/editor?slug=${slug}`}
            className="block overflow-hidden rounded-md bg-white px-6 py-4 text-blue-800 underline shadow">
            {name}
          </Link>
        ))}
    </div>
  )
}

async function getSomething() {
  const supabase = createServerComponentSupabaseClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    headers: headers,
    cookies: cookies,
  })

  return await supabase.auth.getUser()
}
