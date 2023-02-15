import { createClient } from '@supabase/supabase-js'

import { type Database } from '@/types/supabase'
import { env } from 'env.mjs'

export const createSupabaseServerClient = () =>
  createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  )

export type Company = Database['public']['Tables']['Company']['Row']
export type Reference = Database['public']['Tables']['Reference']['Row']
