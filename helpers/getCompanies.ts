'server-only'

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from 'next/headers'

import { Database } from '@/types/supabase'

export default async function getCompanies() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const { data, error } = await supabase
    .from('Company')
    .select()
    .order('name', { ascending: true })

  if (!data || error) {
    throw Error(error.message)
  } else {
    return data
  }
}
