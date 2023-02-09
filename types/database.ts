import type { Database } from '@/types/supabase'

export type Company = Database['public']['Tables']['Company']['Row']
export type Reference = Database['public']['Tables']['Reference']['Row']
