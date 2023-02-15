import { createClient } from '@supabase/supabase-js'
import { env } from 'env.mjs'

import { type Database } from '@/types/supabase'

export const createSupabaseServerClient = () =>
  createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  )

export type Company = Database['public']['Tables']['Company']['Row']
export type Reference = Database['public']['Tables']['Reference']['Row']
