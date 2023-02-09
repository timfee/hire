import Editor from '@/components/admin/Editor'
import { createClient } from '@/lib/supabase-server'
import type { Company } from '@/types/database'

type AdminPageParams = Pick<Company, 'slug'>

export default async function AdminPage({
  params: { slug },
}: {
  params: AdminPageParams
}) {
  const company = await getCompany({ slug })
  return <Editor company={company} data-superjson />
}

async function getCompany({ slug }: AdminPageParams) {
  const supabase = createClient()
  const { data } = await supabase
    .from('Company')
    .select()
    .eq('slug', slug)
    .single()

  return data
}
