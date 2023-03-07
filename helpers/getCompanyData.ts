'server-only'

import { cache } from 'react'

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from 'next/headers'

import { refreshResumeUrl } from '@/content'
import { Database } from '@/types/supabase'

const getCompanyData = cache(async (slug: string, code?: string) => {
  const supabase = createServerComponentSupabaseClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    headers,
    cookies,
  })

  const { data, error } = await supabase
    .from('Company')
    .select('*')
    .eq('slug', slug)
    .eq('code', code ?? undefined)
    .single()

  if (!data || error) {
    throw Error(error.message)
  } else {
    const resumeUrl = await refreshResumeUrl(data)
    return { ...data, resumeUrl }
  }
})
export default getCompanyData
