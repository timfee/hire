import Link from 'next/link'

import { Container } from '@/components'
import { createStandardClientWithRoleAccount } from '@/lib/supabase-server'

export default async function AdminLander() {
  const companies = await getCompanies()
  return (
    <Container>
      <div role="list" className="mt-6 space-y-3">
        <Link
          href="/admin/new"
          className="block overflow-hidden rounded-md bg-green-600 px-6 py-4 text-white underline shadow">
          Create New Company
        </Link>

        {companies &&
          companies.map(({ name, slug }) => (
            <Link
              key={slug}
              href={`/admin/edit/${slug}`}
              className="block overflow-hidden rounded-md bg-white px-6 py-4 text-blue-800 underline shadow">
              {name}
            </Link>
          ))}
      </div>
    </Container>
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
