'server-only'

import { cache } from 'react'

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from 'next/headers'

import { Database } from '@/types/supabase'

const getReferences = cache(async () => {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  return await supabase
    .from('Reference')
    .select('*')
    .order('order', { ascending: true })
    .then((data) => data.data)
})

export default getReferences
