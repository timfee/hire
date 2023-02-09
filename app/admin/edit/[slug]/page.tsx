import type { Company } from '@prisma/client'

import Editor from '@/components/admin/Editor'
import prisma from '@/lib/prisma'

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
  return await prisma.company.findFirstOrThrow({
    where: {
      slug,
    },
  })
}
