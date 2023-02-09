import 'server-only'

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { createClient as createClientClient } from '@supabase/supabase-js'
import { cookies, headers } from 'next/headers'

import type { Database } from '@/types/supabase'

export const createClient = () =>
  createServerComponentSupabaseClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    headers,
    cookies,
  })

export const createStandardClientWithRoleAccount = () =>
  createClientClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )
