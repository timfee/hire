import Link from 'next/link'

import prisma from '@/lib/prisma'

export default async function AdminLander() {
  const companies = await getCompanies()
  return (
    <div className="flex flex-col">
      {companies.map(({ name, slug }) => (
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
  return await prisma.company.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}
