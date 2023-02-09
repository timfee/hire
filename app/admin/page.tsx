import Link from 'next/link'

import { createStandardClientWithRoleAccount } from '@/lib/supabase-server'

export default async function AdminLander() {
  const companies = await getCompanies()
  return (
    <div className="flex flex-col">
      {companies &&
        companies.map(({ name, slug }) => (
          <Link
            href={`/admin/edit/${slug}`}
            key={slug}
            className="text-blue-800 underline">
            {name}
          </Link>
        ))}
    </div>
  )
}

async function getCompanies() {
  const supabase = createStandardClientWithRoleAccount()
  const { data: companies } = await supabase
    .from('Company')
    .select()
    .order('name', { ascending: true })

  return companies
}
